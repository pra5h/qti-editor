tinyMCEPopup.requireLangPack();
var choiceDialog = {
	windowId : null,
	
	init : function(ed) {
		document.body.setAttribute('onUnload',"tinymce.DOM.remove('mcePopupLayer_'+choiceDialog.windowId);");
		document.body.setAttribute('onLoad',"choiceDialog.windowId = lock(tinyMCEPopup.id);");

		var ed = ed;
		var f = document.forms[0]; 
		var data = tinyMCEPopup.getWindowArg("choicedata");

		tagInsert.init(f.question.id);
		InputHelper.init(f.question);
		
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
					correct = ' checked="checked" ';
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
					newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td class="answer"><input type="hidden" id="id_' + q + '" name="ids[]" value="' + data[3][q] + '"/><input type="hidden" id="answer_' + q + '" name="answers[]" style="width: 100%; margin-right: 5px;" value=""/><div id="media_answer_'+q+'" class="exerciseMedia" style="width: 80px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;" onclick="tinyMCE.execCommand(\'mceAppendImageToExercise\', false, {src:\'' + src + '\',div:this});"><img style="max-height: 40px; max-width: 80px;" src="' + odp + '" /></div></td><td class="correct"><input id="point_' + q + '" type="' + type + '" name="points[]" style="margin: 0; padding: 0;"' + correct + '/></td><td class="fixed"><input id="fixed_' + q + '" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" ' + fixed + '/></td><td class="remove"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td class="feedback"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
				} else {
					f.images.checked = false;
					newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td class="answer"><input type="hidden" id="id_' + q + '" name="ids[]" value="' + data[3][q] + '"/><input type="text" id="answer_' + q + '" name="answers[]" style="width: 100%; margin-right: 5px;" value=""/></td><td class="correct"><input id="point_' + q + '" type="' + type + '" name="points[]" style="margin: 0; padding: 0;"' + correct + '/></td><td class="fixed"><input id="fixed_' + q + '" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" ' + fixed + '/></td><td class="remove"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td class="feedback"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
				}
				document.getElementById('answer_list').appendChild(newDiv);
				//tak trzeba ze względu na <math> inaczej podczas inicjalizacji input.value zamienia &lt; na <
				
				tagInsert.init("answer_"+q);
				InputHelper.init($("#answer_"+q));
				if (f.images.checked){
					document.getElementById("taginsert_menu_answer_"+q).style.display = 'none';
					$("#taginsert_math_answer_"+q).hide();
				} else {
					$("#answer_"+q).val(odp);
				}
				/*
				if(tinyMCE.feedback == undefined) {
					tinyMCE.feedback = new Array();
				}
				if(tinyMCE.feedback[data[4]] == undefined) {
					tinyMCE.feedback[data[4]] = data[8][data[4]];
				}
				*/
				/*
				if(tinyMCE.feedback[data[3][q]] == undefined) {
					tinyMCE.feedback[data[3][q]] = {text: new Array, sound: new Array};
				}				
				if(data[8][q] != undefined) {
					//tinyMCE.feedback[data[3][q]].text = data[8][q];
					tinyMCE.feedback[data[3][q]].text = data[8];
				}
				if(data[9][q] != undefined) {
					//tinyMCE.feedback[data[3][q]].sound = data[9][q];
					tinyMCE.feedback[data[3][q]].sound = data[9];
				}
				
				*/
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
			newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td class="answer"><input type="hidden" id="id_0" name="ids[]" value="' + id_0 + '"/><input type="text" id="answer_0" name="answers[]" style="width: 100%; margin-right: 5px;" value=""/></td><td class="correct"><input id="point_0" type="radio" name="points[]" style="margin: 0; padding: 0;"/></td><td class="fixed"><input id="fixed_0" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td><td class="remove"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td class="feedback"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
			document.getElementById('answer_list').appendChild(newDiv);
			tagInsert.init("answer_0");
			InputHelper.init($("#answer_0").get(0));
			
			var newDiv = document.createElement('div');
			newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
			newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td class="answer"><input type="hidden" id="id_1" name="ids[]" value="' + id_1 + '"/><input type="text" id="answer_1" name="answers[]" style="width: 100%; margin-right: 5px;" value=""/></td><td class="correct"><input id="point_1" type="radio" name="points[]" style="margin: 0; padding: 0;"/></td><td class="fixed"><input id="fixed_1" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td><td class="remove"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td class="feedback"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
			document.getElementById('answer_list').appendChild(newDiv);
			tagInsert.init("answer_1");
			InputHelper.init($("#answer_1").get(0));
			var removeButton = document.getElementById('remove_button');
			removeButton.parentNode.removeChild(removeButton);
			
			var insertButton = document.getElementById('insert');
			insertButton.setAttribute('value', 'Insert');

		}
		$('.focusedChoice').focus();
	},

	insertChoiceSection : function(form) {
		var ed = tinymce.EditorManager.activeEditor;
		ed.execCommand('mceAddUndoLevel');
		var question = '', identifier = '', responseDeclaration = '', shuffle = '', multiple = '', images = '', answers = new Array(), points = new Array(), ids = new Array(), fixed = new Array();
		var elements = form.elements;
		var i = 0;
		var adding = 0;
		var skip_point = 0;
		var images = form.images.checked;
		while(elements[i] != undefined) {
			var element = elements[i];
			
			if(element.getAttribute('name') == 'question') {
				if (!ed.validateHtml(element.value, 'question')) {
					return false;
				}
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
			/*if(element.getAttribute('name') == 'images') {
				images = element.checked;
			}*/
			if(element.getAttribute('name') == 'answers[]') {

				if (images == true) {
					var src = $('img', $('#media_'+element.getAttribute('id'))).attr('src');
					answers.push('<img src="' + src + '"/>');
				} else {
					if(element.value != '') {
						if (!ed.validateHtml(element.value, 'answer')) {
							return false;
						}
						answers.push(element.value);
					} else {
						skip_point = 1;
					}
				}
				/*
				if(element.value != '') {
					if(images == true) {
						var src = $('img', $('#media_'+element.getAttribute('id'))).attr('src');
						answers.push('<img src="' + src + '"/>');
					} else {
						if (!ed.validateHtml(element.value, 'answer')) {
							return false;
						}
						answers.push(element.value);
					}
				} else {
					skip_point = 1;
				}
				*/
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
			responseDeclaration = '<!-- <responseDeclaration identifier="' + identifier + '" cardinality="' + (multiple ? 'multiple' : 'single') + '" baseType="identifier"><correctResponse>';
			for(i in answers) {
				choiceSection += '<!-- <simpleChoice identifier="' + ids[i] + '"';
				if(fixed[i] == 1) {
					choiceSection += ' fixed="true" ';
				}
				choiceSection += '>' + answers[i];
				if(tinyMCE.feedback != undefined && tinyMCE.feedback[identifier] != undefined && tinyMCE.feedback[identifier][ids[i]] != undefined && tinyMCE.feedback[identifier][ids[i]].text != '') {
					choiceSection += '<feedbackInline ';
					if(points[i] > 0) {
						choiceSection += 'mark="CORRECT"';
					} else {
						choiceSection += 'mark="WRONG"';
					}
					choiceSection += ' fadeEffect="300" variableIdentifier="' + identifier + '-LASTCHANGE" value="\\+' + ids[i] + '.*" showHide="show">' + tinyMCE.feedback[identifier][ids[i]].text + '</feedbackInline>';
				} 
				choiceSection += '</simpleChoice> --><br /><input id="choiceInteraction" ';
				if(points[i] > 0) {
					choiceSection += 'checked="checked" ';
				}
				choiceSection += 'name="simpleChoice" type="checkbox" />' + answers[i];
				if(points[i] == 1) {
					responseDeclaration += '<value>' + ids[i] + '</value>';
				}
			}
			responseDeclaration += '</correctResponse></responseDeclaration> -->';
			choiceSection += '</div><!-- </choiceInteraction> -->';
			
			choiceSection += '<p>&nbsp;</p><span id="focus">_</span>';
			
			var dom = ed.dom;
			var patt = '';
			
	//		ed.execCommand('mceBeginUndoLevel');
		//	var bm = ed.selection.getBookmark();
			
			ed.execCommand('mceInsertContent', false, '<br class="_mce_marker" />');

			tinymce.each('h1,h2,h3,h4,h5,h6,p'.split(','), function(n) {

				if (patt) {
					patt += ',';
				}
				patt += n + ' ._mce_marker';
			});

			tinymce.each(dom.select(patt), function(n) {
				ed.dom.split(ed.dom.getParent(n, 'h1,h2,h3,h4,h5,h6,p'), n);
			});
			choiceSection = ed.correctHtml(choiceSection, 'decode');
			dom.setOuterHTML(dom.select('._mce_marker')[0], choiceSection);

//			ed.execCommand('mceEndUndoLevel');
			
			body = ed.selection.getNode();
			while(body.nodeName != 'BODY') {
				body = body.parentNode;
			}
			regexp = new RegExp('(<!-- <itemBody> -->)','gi');
			body.innerHTML = body.innerHTML.replace(regexp, responseDeclaration + '$1');
			
			ed.focusAfterInsert('focus');
			
		} else {
		
			var nd = tinyMCE.selectedNode;	
			
			while(nd.nodeName != 'DIV') {
				nd = nd.parentNode;
			}
			nd.previousSibling.nodeValue = ' <choiceInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '" maxChoices="' + String(maxChoices) + '"> ';
			/*if(nd.previousSibling.nodeName == "P") {
				var regexp = new RegExp('<!-- <choiceInteraction responseIdentifier="' + identifier + '" shuffle="[^"]*" maxChoices="[^"]*"([^>]*)> -->','gi');
				nd.previousSibling.innerHTML = nd.previousSibling.innerHTML.replace(regexp, '<!-- <choiceInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '" maxChoices="' + String(maxChoices) + '"$1> -->');
			} else {
				//var regexp = new RegExp(' <choiceInteraction responseIdentifier="' + identifier + '" shuffle="[^"]*" maxChoices="[^"]*"([^>]*)> ','gi');
				nd.previousSibling.nodeValue = ' <choiceInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '" maxChoices="' + String(maxChoices) + '"> ');
			}*/
			choiceSection = '<p id="choiceInteraction">' + question + '</p>';
			for(i in answers) {
				choiceSection += '<!-- <simpleChoice identifier="' + ids[i] + '"';
				if(fixed[i] == 1) {
					choiceSection += ' fixed="true" ';
				}
				choiceSection += '>' + answers[i];
				if(tinyMCE.feedback != undefined && tinyMCE.feedback[identifier] != undefined && tinyMCE.feedback[identifier][ids[i]] != undefined && tinyMCE.feedback[identifier][ids[i]].text != '') {
					choiceSection += '<feedbackInline ';
					if(points[i] > 0) {
						choiceSection += 'mark="CORRECT"';
					} else {
						choiceSection += 'mark="WRONG"';
					}
					choiceSection += ' fadeEffect="300"  variableIdentifier="' + identifier + '-LASTCHANGE" value="\\+' + ids[i] + '.*" showHide="show">' + tinyMCE.feedback[identifier][ids[i]].text + '</feedbackInline>';
				} 
				choiceSection += '</simpleChoice> --><br /><input id="choiceInteraction" ';
				if(points[i] > 0) {
					choiceSection += 'checked="checked" ';
				}
				choiceSection += 'name="simpleChoice" type="checkbox" />' + answers[i];
				if(points[i] == 1) {
					responseDeclaration += '<value>' + ids[i] + '</value>';
				}
			}
			choiceSection = ed.correctHtml(choiceSection, 'decode');
			nd.innerHTML = choiceSection;
			
			body = nd;
			while(body.nodeName != 'BODY') {
				body = body.parentNode;
			}
			
			var xh = ed.XmlHelper;
			var correctResponseNode = xh.getCorrectResponseNodeId(body, identifier);
			regexp = new RegExp('(<responseDeclaration[^>]*>[^<]*<correctResponse>)(?:[^<]*<value>[^<]*<\/value>[^<]*)*(<\/correctResponse>[^>]*<\/responseDeclaration>)','gi');
			correctResponseNode.nodeValue = correctResponseNode.nodeValue.replace(regexp, '$1' + responseDeclaration + '$2');
			correctResponseNode.nodeValue = correctResponseNode.nodeValue.replace(/cardinality="[^"]+"/, 'cardinality="' + (multiple ? 'multiple' : 'single') + '"');
			ed.focusAfterModify(nd);
		}

		// Remove illegal text before headins
		var beforeHeadings = ed.selection.dom.doc.body.innerHTML.match(/(.*?)(?=<!-- \?xml)/);
		if(beforeHeadings != undefined && beforeHeadings[1] != '') {
			ed.selection.dom.doc.body.innerHTML = ed.selection.dom.doc.body.innerHTML.replace(/(.*?)(?=<!-- \?xml)/,'');
		}
		if(beforeHeadings && beforeHeadings[1] != '') {
			ed.selection.dom.doc.body.innerHTML = ed.selection.dom.doc.body.innerHTML.replace(/<itemBody> -->/,'<itemBody> -->' + beforeHeadings[1]);
		}
		/*
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
		*/
		ed.execCommand('mceEndUndoLevel');
		tinyMCEPopup.close();
		return true;
		
	}
};

tinyMCEPopup.onInit.add(choiceDialog.init, choiceDialog);

