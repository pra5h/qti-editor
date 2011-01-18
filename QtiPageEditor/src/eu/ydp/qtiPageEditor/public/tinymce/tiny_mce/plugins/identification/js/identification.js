tinyMCEPopup.requireLangPack();

var identificationDialog = {
	init : function(ed) {
		
		var ed = ed;
		var f = document.forms[0]; 
		var data = tinyMCEPopup.getWindowArg("identificationdata");

		if(data != undefined && data.identifier != undefined) {
			f.identifier.value = data.identifier;
		} else {
			var randid = Math.random();
			randid = String(randid);
			var rg = new RegExp('0.([0-9]*)',"gi");
			exec = rg.exec(randid);
			f.identifier.value = 'id_' + exec[1];
		}
		if(data != undefined && data.shuffle != undefined) {
			if(data.shuffle == 'true') {
				f.shuffle.checked = true;
			}
		}
		if(data != undefined && data.max_selections != undefined) {
			f.max_selections.value = data.max_selections;
		}
		if(data != undefined && data.separator != undefined) {
			f.separator.value = data.separator;
		}
		
		if(data != undefined && data.answers.length > 0) {
		
			for(q=0; q<data.answers.length;q++) {
				var newDiv = document.createElement('div');
				newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
				if(data.points[q] == 0) {
					correct = '';
				} else {
					correct = ' checked ';
				}
				if(data.fixed[q] == 'true') {
					fixed = ' checked';
				} else {
					fixed = '';
				}
				newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="260px" style="padding-right: 5px;"><input type="text" id="answer_' + q + '" name="answers[]" style="width: 100%; margin-right: 5px;" value="' + data.answers[q] + '"/></td><input type="hidden" id="id_' + q + '" name="ids[]" value="' + data.ids[q] + '"/><td width="50px" align="center"><input id="point_' + q + '" type="checkbox" name="points[]" style="margin: 0; padding: 0;"' + correct + '/></td><td width="50px" align="center"><input id="fixed_' + q + '" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" ' + fixed + '/></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td width="50px" align="left"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
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
			newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="260px" style="padding-right: 5px;"><input type="text" id="answer_0" name="answers[]" style="width: 100%; margin-right: 5px;" value=""/></td><input type="hidden" id="id_0" name="ids[]" value="' + id_0 + '"/><td width="50px" align="center"><input id="point_0" type="checkbox" name="points[]" style="margin: 0; padding: 0;"/></td><td width="50px" align="center"><input id="fixed_0" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td width="50px" align="left"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
			document.getElementById('answer_list').appendChild(newDiv);
			
			var newDiv = document.createElement('div');
			newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
			newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="260px" style="padding-right: 5px;"><input type="text" id="answer_1" name="answers[]" style="width: 100%; margin-right: 5px;" value=""/></td><input type="hidden" id="id_1" name="ids[]" value="' + id_1 + '"/><td width="50px" align="center"><input id="point_1" type="checkbox" name="points[]" style="margin: 0; padding: 0;"/></td><td width="50px" align="center"><input id="fixed_1" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td width="50px" align="left"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
			document.getElementById('answer_list').appendChild(newDiv);
			
			var removeButton = document.getElementById('remove_button');
			removeButton.parentNode.removeChild(removeButton);
			
			var insertButton = document.getElementById('insert');
			insertButton.setAttribute('value', 'Insert');
		
		}
		
	},

	insertIdentification : function(form) {
		var identifier = '', responseDeclaration = '', max_selections = '1', separator = ',', answers = new Array(), points = new Array(), ids = new Array(), fixed = new Array();
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
			if(element.getAttribute('name') == 'max_selections') {
				max_selections = element.value;
			}
			if(element.getAttribute('name') == 'separator') {
				separator = element.value;
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
		
			var identificationSection = '<p>&nbsp;</p><!-- <identificationInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '" max_selections="' + max_selections + '" separator="' + separator + '"> --><div id="identificationInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; background-color: #f0f0f0;">';
			responseDeclaration = '<!-- <responseDeclaration identifier="' + identifier + '" cardinality="multiple" baseType="identifier"><correctResponse>';
			for(i in answers) {
				identificationSection += '<!-- <simpleChoice identifier="' + ids[i] + '"';
				if(fixed[i] == 1) {
					identificationSection += ' fixed="true" ';
				}
				identificationSection += '>' + answers[i];
				
				if(tinyMCE.feedback != undefined && tinyMCE.feedback[identifier] != undefined && tinyMCE.feedback[identifier].text[ids[i]] != undefined) {
					identificationSection += '<feedbackInline ';
					if(points[i] == 1) { 
						identificationSection += 'mark="CORRECT"';
					} else {
						identificationSection += 'mark="WRONG"';
					}
					identificationSection += ' fadeEffect="300" senderIdentifier="^' + ids[i] + '$" outcomeIdentifier="' + ids[i] + '" identifier="' + answers[i] + '" showHide="show">' + tinyMCE.feedback[identifier].text[ids[i]] + '</feedbackInline>'
				} 
				
				identificationSection += '</simpleChoice> --><br /><input id="choiceInteraction" name="simpleChoice" type="checkbox" ';
				if(points[i] == 1) {
					identificationSection += 'checked="checked" ';
				}
				identificationSection += '/>' + answers[i];
				if(points[i] == 1) {
					responseDeclaration += '<value>' + ids[i] + '</value>';
				}
			}
			responseDeclaration += '</correctResponse></responseDeclaration> -->';
			identificationSection += '</div><!-- end of identificationInteraction --><p>&nbsp;</p>';
			
			var ed = tinymce.EditorManager.activeEditor;
			var bm = ed.selection.getBookmark();
			ed.selection.moveToBookmark(bm);
			tinyMCE.execCommand('mceInsertContent', false, identificationSection);

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
			while(nd.id != 'identificationInteraction') {
				nd = nd.parentNode;
			}
			var regexp = new RegExp(' <identificationInteraction responseIdentifier="' + identifier + '" shuffle="[^"]*"(.*?)max_selections="[^"]*"(.*?)separator="[^"]*"(.*?)> ','gi');
			if(nd.previousSibling != undefined) {
				nd.previousSibling.data = nd.previousSibling.data.replace(regexp, ' <identificationInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '"$1max_selections="' + max_selections + '"$2separator="' + separator + '"$3> ');
			} else {
				nd.parentNode.previousSibling.data = nd.parentNode.previousSibling.data.replace(regexp, ' <identificationInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '"$1max_selections="' + max_selections + '"$2separator="' + separator + '"$3> ');
			}
 			identificationSection = '';
			for(i in answers) {
				identificationSection += '<!-- <simpleChoice identifier="' + ids[i] + '"';
				if(fixed[i] == 1) {
					identificationSection += ' fixed="true" ';
				}
				identificationSection += '>' + answers[i];
				
				if(tinyMCE.feedback != undefined && tinyMCE.feedback[identifier] != undefined && tinyMCE.feedback[identifier].text[ids[i]] != undefined) {
					identificationSection += '<feedbackInline ';
					if(points[i] == 1) { 
						identificationSection += 'mark="CORRECT"';
					} else {
						identificationSection += 'mark="WRONG"';
					}
					identificationSection += ' fadeEffect="300" senderIdentifier="^' + ids[i] + '$" outcomeIdentifier="' + ids[i] + '" identifier="' + answers[i] + '" showHide="show">' + tinyMCE.feedback[identifier].text[ids[i]] + '</feedbackInline>'
				}
				
				identificationSection += '</simpleChoice> -->';
				identificationSection += '<br /><input id="choiceInteraction" name="simpleChoice" type="checkbox" ';
				if(points[i] > 0) {
					responseDeclaration += '<value>' + ids[i] + '</value>';
					identificationSection += 'checked="checked" ';
				}
				identificationSection += '/>' + answers[i];
				
			}
			nd.innerHTML = identificationSection;
			
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

tinyMCEPopup.onInit.add(identificationDialog.init, identificationDialog);

