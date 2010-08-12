tinyMCEPopup.requireLangPack();

var orderDialog = {
	init : function(ed) {
		
		var ed = ed;
		var f = document.forms[0]; 
		var data = tinyMCEPopup.getWindowArg("orderdata");
		
		if(data != undefined && data[0] != undefined) {
			f.question.value = data[0];
		}
		if(data != undefined && data[4] != undefined) {
			f.identifier.value = data[4];
		} else {
			var randid = Math.random();
			randid = String(randid);
			var rg = new RegExp('0.([0-9]*)',"gi");
			exec = rg.exec(randid);
			f.identifier.value = 'id_' + exec[1];
		}
		if(data != undefined && data[5] != undefined) {
			if(data[5] == 'true') {
				f.shuffle.checked = true;
			}
		}
		
		if(data != undefined && data[1].length > 0 && data[1].length == data[2].length) {
		
			for(q=0; q<data[1].length;q++) {
				var newDiv = document.createElement('div');
				newDiv.setAttribute('style', 'width: 100%; margin: 3px; background-image:url(img/move.png); padding-left: 20px; background-repeat: no-repeat;');
				correct = data[2][q];
				if(data[6][q] == 'true') {
					fixed = ' checked';
				} else {
					fixed = '';
				}
				var odp = data[1][q];
				if(odp.match(/^<img[^>]*\/?>$/i)) {
					f.images.checked = true;
					odp = odp.replace(/^<img src="([^"]*)"[^>]*\/?>$/, '$1');
					src = odp.split('/');
					src = src[src.length - 1];
					newDiv.innerHTML = '<img src=""/><table cellpadding=0 cellspacing=0><tr><td width="260px" style="padding-right: 5px;"><input type="hidden" id="answer_' + q + '" name="answers[]" style="width: 100%; margin-right: 5px;" value="' + odp + '"/><div style="width: 80px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;" onclick="tinyMCE.execCommand(\'mceAppendImageToExercise\', false, {src:\'' + src + '\',div:this});"><img style="max-height: 40px; max-width: 80px;" src="' + odp + '"/></div></td><input type="hidden" id="id_' + q + '" name="ids[]" value="' + data[3][q] + '"/><td width="50px"><input id="fixed_' + q + '" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" ' + fixed + '/></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td></tr></table>';
				} else {
					f.images.checked = false;
					newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="260px" style="padding-right: 5px;"><input type="text" id="answer_' + q + '" name="answers[]" style="width: 100%; margin-right: 5px;" value="' + odp + '"/></td><input type="hidden" id="id_' + q + '" name="ids[]" value="' + data[3][q] + '"/><td width="50px"><input id="fixed_' + q + '" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" ' + fixed + '/></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td></tr></table>';
				}
				document.getElementById('answer_list_sortable').appendChild(newDiv);
			}
		
		} else {
			
			if(data == undefined) {
				document.getElementById('answer_list').innerHTML += '<input type="hidden" name="addnew" value="1">';
			}
			
			var randid = Math.random();
			randid = String(randid);
			var rg = new RegExp('0.([0-9]*)',"gi");
			exec = rg.exec(randid);
			var id_0 = 'id_' + exec[1];
			
			var randid = Math.random();
			randid = String(randid);
			var rg = new RegExp('0.([0-9]*)',"gi");
			exec = rg.exec(randid);
			var id_1 = 'id_' + exec[1];
			
			var newDiv = document.createElement('div');
			newDiv.setAttribute('style', 'width: 100%; margin: 3px; background-image:url(img/move.png); padding-left: 20px; background-repeat: no-repeat;');
			newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="260px" style="padding-right: 5px;"><input type="text" id="answer_0" name="answers[]" style="width: 100%; margin-right: 5px;" value=""/></td><input type="hidden" id="id_0" name="ids[]" value="' + id_0 + '"/><td width="50px"><input id="fixed_0" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td></tr></table>';
			document.getElementById('answer_list_sortable').appendChild(newDiv);
			
			var newDiv = document.createElement('div');
			newDiv.setAttribute('style', 'width: 100%; margin: 3px; background-image:url(img/move.png); padding-left: 20px; background-repeat: no-repeat;');
			newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="260px" style="padding-right: 5px;"><input type="text" id="answer_1" name="answers[]" style="width: 100%; margin-right: 5px;" value=""/></td><input type="hidden" id="id_1" name="ids[]" value="' + id_1 + '"/><td width="50px"><input id="fixed_1" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td></tr></table>';
			document.getElementById('answer_list_sortable').appendChild(newDiv);
			
			var removeButton = document.getElementById('remove_button');
			removeButton.parentNode.removeChild(removeButton);
			
			var insertButton = document.getElementById('insert');
			insertButton.setAttribute('value', 'Insert');
		
		}
		
		$("#answer_list_sortable").sortable();

		
	},

	insertOrderSection : function(form) {
		var question = '', identifier = '', responseDeclaration = '', shuffle = '', multiple = '', images = '', answers = new Array(), points = new Array(), ids = new Array(), fixed = new Array();
		var elements = form.elements;
		var i = 0;
		var adding = 0;
		var skip_point = 0;
		var ordering = 1;
	
		while(elements[i] != undefined) {
			var element = elements[i];
			if(element.getAttribute('name') == 'question') {
				question = element.value;
			}
			if(element.getAttribute('name') == 'identifier') {
				identifier = element.value;
			}
			if(element.getAttribute('name') == 'shuffle') {
				shuffle = element.checked;
			}
			if(element.getAttribute('name') == 'images') {
				images = element.checked;
			}
			if(element.getAttribute('name') == 'answers[]') {
				if(element.value != '') {
					if(images == true) {
						answers.push('<img src="' + element.value + '"/>');
					} else {
						answers.push(element.value);
					}
					points.push(ordering);
					ordering++;
				} else {
					skip_point = 1;
				}
			}
			if(element.getAttribute('name') == 'ids[]') {
				if(skip_point == 0) {
					ids.push(element.value);
				} else {
					skip_point = 0;
				}
			}
			if(element.getAttribute('name') == 'fixed[]') {
				if(skip_point == 0) {
					if(element.checked == true) {
						fixed.push(1);
					} else {
						fixed.push(0);
					}
				} else {
					skip_point = 0;
				}
			}
			if(element.getAttribute('name') == 'addnew' && element.getAttribute('value') == '1') {
				adding = 1;
			}
			i++;
		}
		
		if(question == '' || answers.length < 1 || answers.length != points.length) {
			return false;
		}
		
		if(adding == 1) {
			var orderSection = '<p>&nbsp;</p><!-- <orderInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '"> --><div id="orderInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">';
			orderSection += '<p id="choiceInteraction">' + question + '</p>';
			responseDeclaration = '<!-- <responseDeclaration identifier="' + identifier + '" cardinality="ordered" baseType="identifier"><correctResponse>';
			var responseOrder = new Array;
			for(i in answers) {
				responseOrder[points[i]] = ids[i];
			}
			var i = answers.length;
			if (i > 0) {
				while (--i) {
					var j = Math.floor(Math.random() * (i + 1));
					var tempi = answers[i];
					var tempj = answers[j];
					answers[i] = tempj;
					answers[j] = tempi;
					var tempi = ids[i];
					var tempj = ids[j];
					ids[i] = tempj;
					ids[j] = tempi;
					var tempi = points[i];
					var tempj = points[j];
					points[i] = tempj;
					points[j] = tempi;
				}
			}
			for(i in answers) {
				orderSection += '<!-- <simpleChoice identifier="' + ids[i] + '"';
				if(fixed[i] == 1) {
					orderSection += ' fixed="true" ';
				}
				orderSection += '>' + answers[i] + '</simpleChoice> --><div id="orderOption" name="' + points[i] + '"  style="border: 1px solid green; margin: 2px;"';
				orderSection += '>' + answers[i] + '</div>';
			}
			for(i in responseOrder) {
				responseDeclaration += '<value>' + responseOrder[i] + '</value>';
			}
			responseDeclaration += '</correctResponse></responseDeclaration> -->';
			orderSection += '</div><!-- end of orderInteraction -->';
			
			orderSection += '<p>&nbsp;</p>';
			
			var ed = tinymce.EditorManager.activeEditor;
			ed.selection.moveToBookmark(ed.selection.getBookmark());
			tinyMCE.execCommand('mceInsertContent', false, orderSection);
			
			body = ed.selection.getNode();
			while(body.nodeName != 'BODY') {
				body = body.parentNode;
			}
			regexp = new RegExp('(<!-- <itemBody> -->)','gi');
			body.innerHTML = body.innerHTML.replace(regexp, responseDeclaration + '$1');
			
		} else {
			var ed = tinymce.EditorManager.activeEditor;
			var nd = tinyMCE.selectedNode;
			while(nd.nodeName != 'DIV' || nd.id != 'orderInteraction') {
				nd = nd.parentNode;
			}
			if(nd.previousSibling.nodeName == "P") {
				var regexp = new RegExp('<!-- <orderInteraction responseIdentifier="' + identifier + '" shuffle="[^"]*"([^>]*)> -->','gi');
				nd.previousSibling.innerHTML = nd.previousSibling.innerHTML.replace(regexp, '<!-- <orderInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '"$1> -->');
			} else {
				var regexp = new RegExp(' <orderInteraction responseIdentifier="' + identifier + '" shuffle="[^"]*"([^>]*)> ','gi');
				nd.previousSibling.data = nd.previousSibling.data.replace(regexp, ' <orderInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '"$1> ');
			}
			orderSection = '<p id="choiceInteraction">' + question + '</p>';
			var responseOrder = new Array;
			
			for(i in answers) {
				responseOrder[points[i]] = ids[i];
			}
			
			var i = answers.length;
			if (i > 0) {
				while (--i) {
					var j = Math.floor(Math.random() * (i + 1));
					var tempi = answers[i];
					var tempj = answers[j];
					answers[i] = tempj;
					answers[j] = tempi;
					var tempi = ids[i];
					var tempj = ids[j];
					ids[i] = tempj;
					ids[j] = tempi;
					var tempi = points[i];
					var tempj = points[j];
					points[i] = tempj;
					points[j] = tempi;
				}
			}
			
			for(i in answers) {
				orderSection += '<!-- <simpleChoice identifier="' + ids[i] + '"';
				if(fixed[i] == 1) {
					orderSection += ' fixed="true" ';
				}
				orderSection += '>' + answers[i] + '</simpleChoice> --><div id="orderOption" name="' + points[i] + '" style="border: 1px solid green; margin: 2px;"'; 
				orderSection += '>' + answers[i] + '</div>';
			}
			for(i in responseOrder) {
				responseDeclaration += '<value>' + responseOrder[i] + '</value>';
			}
			nd.innerHTML = orderSection;
			
			body = nd;
			while(body.nodeName != 'BODY') {
				body = body.parentNode;
			}
			regexp = new RegExp('(<!-- <responseDeclaration identifier="' + identifier + '"[^>]*>[^<]*<correctResponse>)(?:[^<]*<value>[^<]*<\/value>[^<]*)*(<\/correctResponse>[^>]*<\/responseDeclaration> -->)','gi');
			body.innerHTML = body.innerHTML.replace(regexp, '$1' + responseDeclaration + '$2');
			
		}
		
		tinyMCEPopup.close();
		return true;
		
	}

};

tinyMCEPopup.onInit.add(orderDialog.init, orderDialog);

