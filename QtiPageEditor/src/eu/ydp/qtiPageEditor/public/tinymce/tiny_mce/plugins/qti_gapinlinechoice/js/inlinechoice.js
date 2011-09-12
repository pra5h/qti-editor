tinyMCEPopup.requireLangPack();

var inlineChoiceDialog = {
	init : function(ed) {
		var ed = ed;
		var f = document.forms[0]; 
		var jsonData = tinyMCEPopup.getWindowArg("inlineChoiceData");
		var data = tinymce.util.JSON.parse(jsonData);
						
		if(data != undefined && data['identifier'] != undefined) {
			f.identifier.value = data['identifier'];
		} else {
			var randid = Math.random();
			randid = String(randid);
			var rg = new RegExp('0.([0-9]*)',"gi");
			exec = rg.exec(randid);
			f.identifier.value = 'id_' + exec[1];
		}
		
		if (data != undefined && data['shuffle'] != undefined) {
			if (data['shuffle'] == true) {
				f.shuffle.checked = true;
			}
		}
		
		
		if(data != undefined && Object.keys(data['answers']).length > 0) {
		
			for(q=0; q<Object.keys(data['answers']).length;q++) {
				var newDiv = document.createElement('div');
				newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
				if(data['points'][q] == 0) {
					correct = '';
				} else {
					correct = ' checked ';
				}
				if(data['fixed'][q] == true) {
					fixed = ' checked';
				} else {
					fixed = '';
				}
				newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="260px" style="padding-right: 5px;"><input type="text" id="answer_' + q + '" name="answers[]" style="width: 100%; margin-right: 5px;" value="' + data['answers'][q] + '"/></td><input type="hidden" id="id_' + q + '" name="ids[]" value="' + data['ids'][q] + '"/><td width="50px" align="center"><input id="point_' + q + '" type="radio" name="points[]" style="margin: 0; padding: 0;"' + correct + '/></td><td width="50px" align="center"><input id="fixed_' + q + '" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" ' + fixed + '/></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td width="50px" align="left"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
				document.getElementById('answer_list').appendChild(newDiv);
			}

			if (0 < Object.keys(data.ids).length) {
				tinyMCE.feedback = new Array();
				tinyMCE.feedback[data.identifier] = {"sound": new Array(), text: new Array()};
				
				for (q=0; q<Object.keys(data.ids).length; q++) {
					var inlChId = data.ids[q];
					tinyMCE.feedback[data.identifier].text[inlChId] = data.feedbacks[data.ids[q]]; 
				}
			}
		
		} else {
			
			if(data == undefined) {
				document.getElementById('answer_list').innerHTML = document.getElementById('answer_list').innerHTML + '<input type="hidden" name="addnew" value="1">';
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
			newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="260px" style="padding-right: 5px;"><input type="text" id="answer_0" name="answers[]" style="width: 100%; margin-right: 5px;" value=""/></td><input type="hidden" id="id_0" name="ids[]" value="' + id_0 + '"/><td width="50px" align="center"><input id="point_0" type="radio" name="points[]" style="margin: 0; padding: 0;"/></td><td width="50px" align="center"><input id="fixed_0" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td width="50px" align="left"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
			document.getElementById('answer_list').appendChild(newDiv);
			
			var newDiv = document.createElement('div');
			newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
			newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="260px" style="padding-right: 5px;"><input type="text" id="answer_1" name="answers[]" style="width: 100%; margin-right: 5px;" value=""/></td><input type="hidden" id="id_1" name="ids[]" value="' + id_1 + '"/><td width="50px" align="center"><input id="point_1" type="radio" name="points[]" style="margin: 0; padding: 0;"/></td><td width="50px" align="center"><input id="fixed_1" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td width="50px" align="left"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
			document.getElementById('answer_list').appendChild(newDiv);
			
			//var removeButton = document.getElementById('remove_button');
			//removeButton.parentNode.removeChild(removeButton);
			
			var insertButton = document.getElementById('insert');
			insertButton.setAttribute('value', 'Insert');
		
		}
	},

	insertInlineChoice : function(form) {
		
		var elements = form.elements;
		var objData = new Array();
		objData.answers = new Array();
		objData.ids = new Array();
		objData.points = new Array();
		objData.fixed = new Array();
		objData.feedbacks = new Object();
		
		var i = 0;
		var adding = 0;
		var skip_point = 0;
		//objData.identifier = $('#identifier').val();
		while(elements[i] != undefined) {
			var element = elements[i];
			
			if(element.getAttribute('name') == 'identifier') {
				objData.identifier = element.value;
			}
			
			if(element.getAttribute('name') == 'shuffle') {
				objData.shuffle = element.checked;
			}
			
			if(element.getAttribute('name') == 'answers[]') {
				if(element.value != '') {
					objData.answers.push(element.value);
				} else {
					skip_point = 1;
				}
			}
			
			if(element.getAttribute('name') == 'ids[]') {
				if(skip_point == 0) {
					objData.ids.push(element.value);
				} else {
					skip_point = 0;
				}
			}
			
			if(element.getAttribute('name') == 'points[]') {
				if(skip_point == 0) {
					if(element.checked == true) {
						objData.points.push(1);
					} else {
						objData.points.push(0);
					}
				} else {
					skip_point = 0;
				}
			}
			if(element.getAttribute('name') == 'fixed[]') {
				if(skip_point == 0) {
					if(element.checked == true) {
						objData.fixed.push(1);
					} else {
						objData.fixed.push(0);
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
		
		for (index in objData.ids) {
			var rId = objData.ids[index];
			
			if(tinyMCE.feedback != undefined && tinyMCE.feedback[objData.identifier] != undefined && objData.ids[index] != undefined && tinyMCE.feedback[objData.identifier].text[objData.ids[index]] != undefined) {
				objData.feedbacks[rId] = tinyMCE.feedback[objData.identifier].text[objData.ids[index]];
			}
		}
		
		if(objData.answers.length < 1 || objData.answers.length != objData.points.length) {
			return false;
		}
		
			var rowNr = tinyMCEPopup.getWindowArg("rowNumber");
			var win = tinyMCEPopup.getWindowArg("win");
			var jsonString = tinymce.util.JSON.serialize(objData);
			win.$('#distractorData'+rowNr).val(jsonString);

			//pokazanie w formularzu poprawnej odpowiedzi
			for (i in objData.answers) {
				
				if (1 == objData.points[i]) {
					win.$('#answer'+rowNr).val(objData.answers[i]);
				}
			}

		tinyMCEPopup.close();
		return true;
	}

};

tinyMCEPopup.onInit.add(inlineChoiceDialog.init, inlineChoiceDialog);

