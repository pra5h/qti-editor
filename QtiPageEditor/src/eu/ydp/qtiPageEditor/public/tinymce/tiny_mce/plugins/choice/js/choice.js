tinyMCEPopup.requireLangPack();

var choiceDialog = {
	init : function(ed) {
		
		var ed = ed;
		var f = document.forms[0]; 
		var data = tinyMCEPopup.getWindowArg("choicedata");
		
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
		var type = 'radio';
		if(data != undefined && data[7] != undefined) {
			if(data[7] > 1) {
				f.multiple.checked = true;
				type = 'checkbox';
			} else {
				f.multiple.checked = false;
			}
		}
		
		if(data != undefined && data[1].length > 0 && data[1].length == data[2].length) {
		
			for(q=0; q<data[1].length;q++) {
				var newDiv = document.createElement('div');
				newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
				if(data[2][q] == 0) {
					correct = '';
				} else {
					correct = ' checked ';
				}
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
					newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="260px" style="padding-right: 5px;"><input type="hidden" id="answer_' + q + '" name="answers[]" style="width: 100%; margin-right: 5px;" value="' + odp + '"/><div style="width: 80px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;" onclick="tinyMCE.execCommand(\'mceAppendImageToExercise\', false, {src:\'' + src + '\',div:this});"><img style="max-height: 40px; max-width: 80px;" src="' + odp + '" /></div></td><input type="hidden" id="id_' + q + '" name="ids[]" value="' + data[3][q] + '"/><td width="50px"><input id="point_' + q + '" type="' + type + '" name="points[]" style="margin: 0; padding: 0;"' + correct + '/></td><td width="50px"><input id="fixed_' + q + '" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" ' + fixed + '/></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td width="50px"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
				} else {
					f.images.checked = false;
					newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="260px" style="padding-right: 5px;"><input type="text" id="answer_' + q + '" name="answers[]" style="width: 100%; margin-right: 5px;" value="' + odp + '"/></td><input type="hidden" id="id_' + q + '" name="ids[]" value="' + data[3][q] + '"/><td width="50px"><input id="point_' + q + '" type="' + type + '" name="points[]" style="margin: 0; padding: 0;"' + correct + '/></td><td width="50px"><input id="fixed_' + q + '" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" ' + fixed + '/></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td width="50px"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
				}
				document.getElementById('answer_list').appendChild(newDiv);
				
				if(tinyMCE.feedback == undefined) {
					tinyMCE.feedback = new Array;
				}
				if(tinyMCE.feedback[data[3][q]] == undefined) {
					tinyMCE.feedback[data[3][q]] = {text: new Array, sound: new Array};
				}				
				if(data[8][q] != undefined) {
					tinyMCE.feedback[data[3][q]].text = data[8][q];
				}
				if(data[9][q] != undefined) {
					tinyMCE.feedback[data[3][q]].sound = data[9][q];
				}
				
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
			newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
			newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="260px" style="padding-right: 5px;"><input type="text" id="answer_0" name="answers[]" style="width: 100%; margin-right: 5px;" value=""/></td><input type="hidden" id="id_0" name="ids[]" value="' + id_0 + '"/><td width="50px"><input id="point_0" type="radio" name="points[]" style="margin: 0; padding: 0;"/></td><td width="50px"><input id="fixed_0" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td width="50px"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
			document.getElementById('answer_list').appendChild(newDiv);
			
			var newDiv = document.createElement('div');
			newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
			newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="260px" style="padding-right: 5px;"><input type="text" id="answer_1" name="answers[]" style="width: 100%; margin-right: 5px;" value=""/></td><input type="hidden" id="id_1" name="ids[]" value="' + id_1 + '"/><td width="50px"><input id="point_1" type="radio" name="points[]" style="margin: 0; padding: 0;"/></td><td width="50px"><input id="fixed_1" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td width="50px"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
			document.getElementById('answer_list').appendChild(newDiv);
			
			var removeButton = document.getElementById('remove_button');
			removeButton.parentNode.removeChild(removeButton);
			
			var insertButton = document.getElementById('insert');
			insertButton.setAttribute('value', 'Insert');
		
		}
		
	},

	insertChoiceSection : function(form) {
		var question = '', identifier = '', responseDeclaration = '', shuffle = '', multiple = '', images = '', answers = new Array(), points = new Array(), ids = new Array(), fixed = new Array();
		var elements = form.elements;
		var i = 0;
		var adding = 0;
		var skip_point = 0;
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
			if(element.getAttribute('name') == 'multiple') {
				multiple = element.checked;
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
			if(element.getAttribute('name') == 'points[]') {
				if(skip_point == 0) {
					if(element.checked == true) {
						points.push(1);
					} else {
						points.push(0);
					}
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
		
		if(multiple == true) {
			var maxChoices = answers.length;
		} else {
			var maxChoices = 1;
		}
		
		if(adding == 1) {
			var choiceSection = '<p>&nbsp;</p><!-- <choiceInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '" maxChoices="' + String(maxChoices) + '"> --><div id="choiceInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">';
			choiceSection += '<p id="choiceInteraction">' + question + '</p>';
			responseDeclaration = '<!-- <responseDeclaration identifier="' + identifier + '" cardinality="single" baseType="identifier"><correctResponse>';
			for(i in answers) {
				choiceSection += '<!-- <simpleChoice identifier="' + ids[i] + '"';
				if(fixed[i] == 1) {
					choiceSection += ' fixed="true" ';
				}
				choiceSection += '>' + answers[i];
				if(tinyMCE.feedback != undefined && tinyMCE.feedback[identifier] != undefined && tinyMCE.feedback[identifier].text[ids[i]] != undefined) {
					choiceSection += '<feedbackInline ';
					if(points[i] > 0) {
						choiceSection += 'mark="CORRECT"'
					} else {
						choiceSection += 'mark="WRONG"'
					}
					choiceSection += ' fadeEffect="300" outcomeIdentifier="' + identifier + '-LASTCHANGE" identifier=".*' + ids[i] + '.*" showHide="show">' + tinyMCE.feedback[identifier].text[ids[i]] + '</feedbackInline>'
				} 
				choiceSection += '</simpleChoice> --><br /><input id="choiceInteraction" name="simpleChoice" type="checkbox" ';
				if(points[i] > 0) {
					choiceSection += 'checked="checked" '
				}
				choiceSection += '/>' + answers[i];
				if(points[i] == 1) {
					responseDeclaration += '<value>' + ids[i] + '</value>';
				}
			}
			responseDeclaration += '</correctResponse></responseDeclaration> -->';
			choiceSection += '</div><!-- end of choiceInteraction -->';
			
			choiceSection += '<p>&nbsp;</p>';
			
			var ed = tinymce.EditorManager.activeEditor;
			var bm = ed.selection.getBookmark();
			ed.selection.moveToBookmark(bm);
			tinyMCE.execCommand('mceInsertContent', false, choiceSection);
			
			body = ed.selection.getNode();
			while(body.nodeName != 'BODY') {
				body = body.parentNode;
			}
			regexp = new RegExp('(<!-- <itemBody> -->)','gi');
			body.innerHTML = body.innerHTML.replace(regexp, responseDeclaration + '$1');
			
			ed.selection.moveToBookmark(bm);
			
		} else {
		
			var ed = tinymce.EditorManager.activeEditor;
			var nd = tinyMCE.selectedNode;	
			var bm = ed.selection.getBookmark();
			
			while(nd.nodeName != 'DIV') {
				nd = nd.parentNode;
			}
			if(nd.previousSibling.nodeName == "P") {
				var regexp = new RegExp('<!-- <choiceInteraction responseIdentifier="' + identifier + '" shuffle="[^"]*" maxChoices="[^"]*"([^>]*)> -->','gi');
				nd.previousSibling.innerHTML = nd.previousSibling.innerHTML.replace(regexp, '<!-- <choiceInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '" maxChoices="' + String(maxChoices) + '"$1> -->');
			} else {
				var regexp = new RegExp(' <choiceInteraction responseIdentifier="' + identifier + '" shuffle="[^"]*" maxChoices="[^"]*"([^>]*)> ','gi');
				nd.previousSibling.data = nd.previousSibling.data.replace(regexp, ' <choiceInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '" maxChoices="' + String(maxChoices) + '"$1> ');
			}
			choiceSection = '<p id="choiceInteraction">' + question + '</p>';
			for(i in answers) {
				choiceSection += '<!-- <simpleChoice identifier="' + ids[i] + '"';
				if(fixed[i] == 1) {
					choiceSection += ' fixed="true" ';
				}
				choiceSection += '>' + answers[i];
				if(tinyMCE.feedback != undefined && tinyMCE.feedback[identifier] != undefined && tinyMCE.feedback[identifier].text[ids[i]] != undefined) {
					choiceSection += '<feedbackInline ';
					if(points[i] > 0) {
						choiceSection += 'mark="CORRECT"'
					} else {
						choiceSection += 'mark="WRONG"'
					}
					choiceSection += ' fadeEffect="300"  outcomeIdentifier="' + identifier + '-LASTCHANGE" identifier=".*' + ids[i] + '.*" showHide="show">' + tinyMCE.feedback[identifier].text[ids[i]] + '</feedbackInline>'
				} 
				choiceSection += '</simpleChoice> --><br /><input id="choiceInteraction" name="simpleChoice" type="checkbox" ';
				if(points[i] > 0) {
					choiceSection += 'checked="checked" ';
				}
				choiceSection += '/>' + answers[i];
				if(points[i] == 1) {
					responseDeclaration += '<value>' + ids[i] + '</value>';
				}
			}
			nd.innerHTML = choiceSection;
			
			body = nd;
			while(body.nodeName != 'BODY') {
				body = body.parentNode;
			}
			regexp = new RegExp('(<!-- <responseDeclaration identifier="' + identifier + '"[^>]*>[^<]*<correctResponse>)(?:[^<]*<value>[^<]*<\/value>[^<]*)*(<\/correctResponse>[^>]*<\/responseDeclaration> -->)','gi');
			body.innerHTML = body.innerHTML.replace(regexp, '$1' + responseDeclaration + '$2');
			
			ed.selection.moveToBookmark(bm);
			
		}
		
		// Remove illegal text before headins
		var beforeHeadings = ed.selection.dom.doc.body.innerHTML.match(/(.*?)(?=<!-- \?xml)/);
		if(beforeHeadings != undefined && beforeHeadings[1] != '') {
			ed.selection.dom.doc.body.innerHTML = ed.selection.dom.doc.body.innerHTML.replace(/(.*?)(?=<!-- \?xml)/,'');
		}
		if(beforeHeadings && beforeHeadings[1] != '') {
			ed.selection.dom.doc.body.innerHTML = ed.selection.dom.doc.body.innerHTML.replace(/<itemBody> -->/,'<itemBody> -->' + beforeHeadings[1]);
		}
		
		if(tinyMCE.feedback != undefined) {
			
			var rg = new RegExp('<!-- <modalFeedback[^>]*senderIdentifier="' + identifier + '"[^>]*>[^<]*</modalFeedback> -->','gi');
			if(rg.exec(tinyMCE.activeEditor.dom.doc.body.innerHTML) != '') {
				tinyMCE.activeEditor.dom.doc.body.innerHTML = tinyMCE.activeEditor.dom.doc.body.innerHTML.replace(rg,'');
			}
			
			if(tinyMCE.feedback[identifier] != undefined) {
				
				var mf = '';
				for (i in tinyMCE.feedback[identifier].sound) {
					mf += '<!-- <modalFeedback senderIdentifier="' + identifier + '" identifier="' + i + '" showHide="show"';
					if(tinyMCE.feedback[identifier].sound[i] != undefined && tinyMCE.feedback[identifier].sound[i] != '') {
						mf += ' sound="' + tinyMCE.feedback[identifier].sound[i] + '"';
					}
					mf += '>' + '</modalFeedback> -->'
				}
				tinyMCE.activeEditor.dom.doc.body.innerHTML = tinyMCE.activeEditor.dom.doc.body.innerHTML.replace(/(<!-- <\/itemBody> -->)/i, '$1' + mf);
				
			}
			tinyMCE.feedback = new Array;
			
		} 
		
		tinyMCEPopup.close();
		return true;
		
	}

};

tinyMCEPopup.onInit.add(choiceDialog.init, choiceDialog);

