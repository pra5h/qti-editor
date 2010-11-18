tinyMCEPopup.requireLangPack();

var choiceDialog = {
	init : function(ed) {
		
		var ed = ed;
		var f = document.forms[0]; 
		var data = tinyMCEPopup.getWindowArg("choicedata");
		
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
		
		if(data != undefined && data[1].length > 0) {
		
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
				newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="260px" style="padding-right: 5px;"><input type="text" id="answer_' + q + '" name="answers[]" style="width: 100%; margin-right: 5px;" value="' + data[1][q] + '"/></td><input type="hidden" id="id_' + q + '" name="ids[]" value="' + data[3][q] + '"/><td width="50px" align="center"><input id="point_' + q + '" type="radio" name="points[]" style="margin: 0; padding: 0;"' + correct + '/></td><td width="50px" align="center"><input id="fixed_' + q + '" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" ' + fixed + '/></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td width="50px" align="left"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
				document.getElementById('answer_list').appendChild(newDiv);
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
			
			var removeButton = document.getElementById('remove_button');
			removeButton.parentNode.removeChild(removeButton);
			
			var insertButton = document.getElementById('insert');
			insertButton.setAttribute('value', 'Insert');
		
		}
		
	},

	insertInlineChoice : function(form) {
		var identifier = '', responseDeclaration = '', answers = new Array(), points = new Array(), ids = new Array(), fixed = new Array();
		var elements = form.elements;
		var i = 0;
		var adding = 0;
		var skip_point = 0;
		
		while(elements[i] != undefined) {
			var element = elements[i];
			
			if(element.getAttribute('name') == 'identifier') {
				identifier = element.value;
			}
			if(element.getAttribute('name') == 'shuffle') {
				shuffle = element.checked;
			}
			if(element.getAttribute('name') == 'answers[]') {
				if(element.value != '') {
					answers.push(element.value);
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
		
		if(answers.length < 1 || answers.length != points.length) {
			return false;
		}
		
		if(adding == 1) {
		
			var choiceSection = '<!-- </qy:tag> --><!-- <qy:tag name="exercise"> --><!-- <inlineChoiceInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '"> --><span id="inlineChoiceInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; background-color: #f0f0f0;">';
			responseDeclaration = '<!-- <responseDeclaration identifier="' + identifier + '" cardinality="single" baseType="identifier"><correctResponse>';
			for(i in answers) {
				choiceSection += '<!-- <inlineChoice identifier="' + ids[i] + '"';
				if(fixed[i] == 1) {
					choiceSection += ' fixed="true" ';
				}
				choiceSection += '>' + answers[i];
				
				if(tinyMCE.feedback != undefined && tinyMCE.feedback[identifier] != undefined && tinyMCE.feedback[identifier].text[ids[i]] != undefined) {
					choiceSection += '<feedbackInline ';
					if(points[i] == 1) { 
						choiceSection += 'mark="CORRECT"';
					} else {
						choiceSection += 'mark="WRONG"';
					}
					choiceSection += ' fadeEffect="300" senderIdentifier="^' + ids[i] + '$" outcomeIdentifier="' + ids[i] + '" identifier="' + answers[i] + '" showHide="show">' + tinyMCE.feedback[identifier].text[ids[i]] + '</feedbackInline>'
				} 
				
				choiceSection += '</inlineChoice> -->';
				if(points[i] == 1) {
					responseDeclaration += '<value>' + ids[i] + '</value>';
					choiceSection += '<span id="inlineChoiceAnswer" style="border: none; color: blue; background-color: #f0f0f0;">' + answers[i] + '<span style="color: green; font-weight: bold;"> &raquo;</span></span>';
				} else {
					choiceSection += '<span id="inlineChoiceAnswer" style="display: none;">' + answers[i] + '</span>';
				}
			}
			responseDeclaration += '</correctResponse></responseDeclaration> -->';
			choiceSection += '</span><!-- end of inlineChoiceInteraction --><!-- </qy:tag> --><!-- <qy:tag name="text"> -->&nbsp;';
			
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
			
			var bm = ed.selection.getBookmark();
			
			var nd = tinyMCE.selectedNode;
			while(nd.id != 'inlineChoiceInteraction') {
				nd = nd.parentNode;
			}
			var regexp = new RegExp(' <inlineChoiceInteraction responseIdentifier="' + identifier + '" shuffle="[^"]*"([^>]*)> ','gi');
			if(nd.previousSibling != undefined) {
				nd.previousSibling.data = nd.previousSibling.data.replace(regexp, ' <inlineChoiceInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '"$1> ');
			} else {
				nd.parentNode.previousSibling.data = nd.parentNode.previousSibling.data.replace(regexp, ' <inlineChoiceInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '"$1> ');
			}
 			choiceSection = '';
			for(i in answers) {
				choiceSection += '<!-- <inlineChoice identifier="' + ids[i] + '"';
				if(fixed[i] == 1) {
					choiceSection += ' fixed="true" ';
				}
				choiceSection += '>' + answers[i];
				
				if(tinyMCE.feedback != undefined && tinyMCE.feedback[identifier] != undefined && tinyMCE.feedback[identifier].text[ids[i]] != undefined) {
					choiceSection += '<feedbackInline ';
					if(points[i] == 1) { 
						choiceSection += 'mark="CORRECT"';
					} else {
						choiceSection += 'mark="WRONG"';
					}
					choiceSection += ' fadeEffect="300" senderIdentifier="^' + ids[i] + '$" outcomeIdentifier="' + ids[i] + '" identifier="' + answers[i] + '" showHide="show">' + tinyMCE.feedback[identifier].text[ids[i]] + '</feedbackInline>'
				}
				
				choiceSection += '</inlineChoice> -->';
				
				if(points[i] == 1) {
					responseDeclaration += '<value>' + ids[i] + '</value>';
					choiceSection += '<span id="inlineChoiceAnswer" style="border: none; color: blue; background-color: #f0f0f0;">' + answers[i] + '<span style="color: green; font-weight: bold;"> &raquo;</span></span>';
				} else {
					choiceSection += '<span id="inlineChoiceAnswer" style="display: none;">' + answers[i] + '</span>';
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
					mf += '></modalFeedback> -->'
				}
				tinyMCE.activeEditor.dom.doc.body.innerHTML = tinyMCE.activeEditor.dom.doc.body.innerHTML.replace(/(<!-- <\/itemBody> -->)/i, '$1' + mf);
				tinyMCE.feedback = new Array;
				
			}
			
		} 
		
		tinyMCEPopup.close();
		return true;
		
	}

};

tinyMCEPopup.onInit.add(choiceDialog.init, choiceDialog);

