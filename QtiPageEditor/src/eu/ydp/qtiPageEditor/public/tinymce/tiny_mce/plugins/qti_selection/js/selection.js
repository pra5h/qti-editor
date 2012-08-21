tinyMCEPopup.requireLangPack();

var selectionDialog = {
	windowId : null,
	
	init : function(ed) {
		document.body.setAttribute('onUnload',"tinymce.DOM.remove('mcePopupLayer_'+selectionDialog.windowId);");
		document.body.setAttribute('onLoad',"selectionDialog.windowId = lock(tinyMCEPopup.id);");	
		var ed = ed;
		var f = document.forms[0]; 
		var data = tinyMCEPopup.getWindowArg("selectiondata");
		
		tagInsert.init(f.question.id);
		InputHelper.init(f.question);

		if(data != undefined && data.question != undefined) {
			f.question.value = data.question;
		}
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
		
		if(data != undefined && data.answers.length > 0 && data.choices.length) {
		
			for(q=0; q<data.choices.length;q++) {
				var newDiv = document.createElement('div');
				newDiv.setAttribute('style', 'width: 100%; margin: 3px;');

				var ct = q+1;
				
				var opt = data.choices[q];
				var optImg = '';
				if(opt.match(/^<img[^>]*\/?>$/i)) {
					f.images.checked = true;
					opt = opt.replace(/^<img src="([^"]*)"[^>]*\/?>$/, '$1');
					src = opt.split('/');
					src = src[src.length - 1];
					optImg = '<div style="width: 80px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;" onclick="tinyMCE.execCommand(\'mceAppendImageToExercise\', false, {src:\'' + src + '\',div:this});"><img style="max-height: 40px; max-width: 80px;" src="' + opt + '" /></div>';
				}				
				newDiv.innerHTML = '<table><tr><td><br class="clr"/><strong>' + ct + '.</strong>&nbsp;\n\
					<input type="hidden" name="choices_ids[]" value="' + data.ids_ch[q] + '">\n\
					<input type="text" name="choices[]" value="" id="choice_'+q+'"/>&nbsp;'+optImg+'</td>\n\
					<td><input type="button" id="remove_option" name="remove_option" value="Remove" onclick="remove_option_row(this);" /></td></tr></table>';
				document.getElementById('option_list').appendChild(newDiv);
				// &lt vs <
				$('#choice_'+q).val(opt); //data.choices[q]
				tagInsert.init("choice_"+q);
				InputHelper.init($("#choice_"+q));
				if (f.images.checked) {
					$('#choice_'+q).get(0).type = 'hidden';
					$("#taginsert_menu_choice_"+q).hide();
					$("#taginsert_math_choice_"+q).hide();
				}
			}

			for(q=0; q<data.answers.length;q++) {
				var newDiv = document.createElement('div');
				newDiv.setAttribute('style', 'width: 100%; margin: 3px;');

				if(data.fixed_ans[q] == 'true') {
					var fixed = ' checked';
				} else {
					var fixed = '';
				}
				var odp = data.answers[q];
				if(odp.match(/^<img[^>]*\/?>$/i)) {
					f.images.checked = true;
					odp = odp.replace(/^<img src="([^"]*)"[^>]*\/?>$/, '$1');
					src = odp.split('/');
					src = src[src.length - 1];
					img = '<div style="width: 80px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;" onclick="tinyMCE.execCommand(\'mceAppendImageToExercise\', false, {src:\'' + src + '\',div:this});"><img style="max-height: 40px; max-width: 80px;" src="' + odp + '" /></div>';
				} else {
					f.images.checked = false;
					img = '';
				}

				var newInnerHTML = '<table class="answer" cellpadding=0 cellspacing=0><tr>\n\
					<td width="260px" style="padding-right: 5px;">\n\
					<input type="text" id="answer_'+q+'" name="answers[]" style="width: 100%; margin-right: 5px;" value=""/>\n\
					'+img+'\
					</td>\n\
					<input type="hidden" id="id_0" name="ids[]" value="' + data.ids_ans[q] + '"/>\n\
					<td width="400px" id="optionsSpans">';
				for(p=0; p<data.choices.length;p++) {
					var ct = p+1;
					//if (ct%4 == 1 && ct != 1 )
						//newInnerHTML += '<hr/>';
					newInnerHTML += '<span class="optionSpan" >\n\
						<strong>' + ct + '.</strong>\n\
						<input id="point_' + p + '" type="radio" value="' + data.ids_ch[p] + '" name="points[' + data.ids_ans[q] + ']" ';
					if(data.points[data.ids_ans[q]] == data.ids_ch[p]) {
						newInnerHTML += ' checked="checked" ';
					}
					newInnerHTML += '/></span>';
					
				}
				newInnerHTML += '</td>\n\
					<td width="50px"><input id="fixed_0" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" ' + fixed + '/></td>\n\
					<td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td>\n\
					<td width="50px"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr>\n\
					</table>';

				newDiv.innerHTML = newInnerHTML;

				document.getElementById('answer_list').appendChild(newDiv);
				// &lt vs <
				$('#answer_'+q).val(odp);
				
				tagInsert.init("answer_"+q);
				InputHelper.init($("#answer_"+q));

				if (f.images.checked) {
					$('#answer_'+q).get(0).type = 'hidden';
					$("#taginsert_menu_answer_"+q).hide();
					$("#taginsert_math_answer_"+q).hide();
				}
				
				if(tinyMCE.feedback == undefined) {
					tinyMCE.feedback = new Array;
				}
				tinyMCE.feedback[data.identifier] = data.feedbacks;
			}
		
		} else {
			
			if(data == undefined) {
				document.getElementById('answer_list').innerHTML += '<input type="hidden" name="addnew" value="1">';
			}

			var randid = Math.random();
			randid = String(randid);
			var rg = new RegExp('0.([0-9]*)',"gi");
			exec = rg.exec(randid);
			var id_2 = 'id_' + exec[1];

			var randid = Math.random();
			randid = String(randid);
			var rg = new RegExp('0.([0-9]*)',"gi");
			exec = rg.exec(randid);
			var id_3 = 'id_' + exec[1];

			var newDiv = document.createElement('div');
			newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
			newDiv.innerHTML = '<table><tbody><tr><td><br class="clr"/><strong>1.</strong>&nbsp;\n\
				<input type="hidden" name="choices_ids[]" value="' + id_2 + '">\n\
				<input type="text" name="choices[]" value="" id="choice_0"></td>\n\
				<td><input type="button" id="remove_option" name="remove_option" value="Remove" onclick="remove_option_row(this);" /></td></tr></tbody></table>';
			document.getElementById('option_list').appendChild(newDiv);
			tagInsert.init("choice_0");
			InputHelper.init($("#choice_0"));

			var newDiv = document.createElement('div');
			newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
			newDiv.innerHTML = '<table><tbody><tr><td><br class="clr"/><strong>2.</strong>&nbsp;\n\
				<input type="hidden" name="choices_ids[]" value="' + id_3 + '">\n\
				<input type="text" name="choices[]" value="" id="choice_1"></td>\n\
				<td><input type="button" id="remove_option" name="remove_option" value="Remove" onclick="remove_option_row(this);" /></td></tr></tbody></table>';
			document.getElementById('option_list').appendChild(newDiv);
			tagInsert.init("choice_1");
			InputHelper.init($("#choice_1"));

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
			newDiv.innerHTML = '<table class="answer" cellpadding=0 cellspacing=0><tr>\n\
				<td width="260px" style="padding-right: 5px;">\n\
				<input type="text" id="answer_0" name="answers[]" style="width: 100%; margin-right: 5px;" value=""/>\n\
				</td>\n\
				<input type="hidden" id="id_0" name="ids[]" value="' + id_0 + '"/>\n\
				<td width="400px" id="optionsSpans">\n\
				<span class="optionSpan" >\n\
				<strong>1.</strong>\n\
				<input id="point_0" type="radio" value="' + id_2 + '" name="points[' + id_0 + ']" />\n\
				</span>\n\
				<span class="optionSpan" >\n\
				<strong>2.</strong>\n\
				<input id="point_0" type="radio" value="' + id_3 + '" name="points[' + id_0 + ']" /></span></td>\n\
				<td width="50px"><input id="fixed_0" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td>\n\
				<td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td>\n\
				<td width="50px"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr>\n\
				</table>';
			document.getElementById('answer_list').appendChild(newDiv);
			tagInsert.init("answer_0");
			InputHelper.init($("#answer_0"));
			
			var newDiv = document.createElement('div');
			newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
			newDiv.innerHTML = '<table class="answer" cellpadding=0 cellspacing=0><tr>\n\
				<td width="260px" style="padding-right: 5px;">\n\
				<input type="text" id="answer_1" name="answers[]" style="width: 100%; margin-right: 5px;" value=""/>\n\
				</td>\n\
				<input type="hidden" id="id_1" name="ids[]" value="' + id_1 + '"/>\n\
				<td width="400px" id="optionsSpans">\n\
				<span class="optionSpan">\n\
				<strong>1.</strong>\n\
				<input id="point_1" type="radio" value="' + id_2 + '" name="points[' + id_1 + ']" />\n\
				</span>\n\
				<span class="optionSpan">\n\
				<strong>2.</strong>\n\
				<input id="point_1" type="radio" value="' + id_3 + '" name="points[' + id_1 + ']" /></span></td>\n\
				<td width="50px"><input id="fixed_1" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td>\n\
				<td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td>\n\
				<td width="50px"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr>\n\
				</table>';
			document.getElementById('answer_list').appendChild(newDiv);
			tagInsert.init("answer_1");
			InputHelper.init($("#answer_1"));
			
			var removeButton = document.getElementById('remove_button');
			removeButton.parentNode.removeChild(removeButton);
			
			var insertButton = document.getElementById('insert');
			insertButton.setAttribute('value', 'Insert');
		
		}
		$('.focusedSelection').focus();
	},

	insertSelectionSection : function(form) {
		var ed = tinymce.EditorManager.activeEditor;
		ed.execCommand('mceAddUndoLevel');
		var dataobj = {};
		dataobj.question = ''; 
		dataobj.identifier = '';
		dataobj.responseDeclaration = '';
		dataobj.shuffle = '';
		dataobj.answers = new Array();
		dataobj.options = new Array();
		dataobj.options_ids = new Array();
		dataobj.points = new Array();
		dataobj.ids = new Array();
		dataobj.fixed = new Array();
		dataobj.isAnswersAsImage = form.images.checked;
		var elements = form.elements;
		
		var i = 0;
		var adding = 0;
		var skip_point = 0;
		while(elements[i] != undefined) {
			var element = elements[i];
			if(element.getAttribute('name') == 'question') {
				if (!ed.validateHtml(element.value, 'question')) {
					return false;
				}
				dataobj.question = element.value;
			}
			if(element.getAttribute('name') == 'identifier') {
				dataobj.identifier = element.value;
			}
			if(element.getAttribute('name') == 'shuffle') {
				dataobj.shuffle = element.checked;
			}
			if(element.getAttribute('name') == 'answers[]') {
				if(element.value != '') {
					if (!ed.validateHtml(element.value, 'answer')) {
						return false;
					}
					dataobj.answers.push(element.value);
				} else {
					skip_point = 1;
				}
			}
			if(element.getAttribute('name') == 'choices[]') {
				if(element.value != '') {
					if (!ed.validateHtml(element.value, 'option')) {
						return false;
					}
					dataobj.options.push(element.value);
				} else {
					skip_point = 1;
				}
			}
			if(element.getAttribute('name') == 'choices_ids[]') {
				if(element.value != '') {
					dataobj.options_ids.push(element.value);
				} else {
					skip_point = 1;
				}
			}
			if(element.getAttribute('name') == 'ids[]') {
				if(skip_point == 0) {
					dataobj.ids.push(element.value);
				} else {
					skip_point = 0;
				}
			}
			if(element.getAttribute('name') != undefined && element.getAttribute('name').match(/points\[.*/i)) {
				var mc = element.getAttribute('name').match(/points\[([^\]]*)\]/i);
				if(skip_point == 0 && element.checked === true) {
					dataobj.points[mc[1]] = element.value;
				} else {
					skip_point = 0;
				}
			}
			if(element.getAttribute('name') == 'fixed[]') {
				if(skip_point == 0) {
					if(element.checked == true) {
						dataobj.fixed.push(1);
					} else {
						dataobj.fixed.push(0);
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

		var responseDeclaration = '';

		if(adding == 1) {
			var selectionSection = '<p>&nbsp;</p><!-- <selectionInteraction responseIdentifier="' + dataobj.identifier + '" shuffle="' + String(dataobj.shuffle) + '"> --><div id="selectionInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">';
			selectionSection += '<p id="selectionInteraction">' + dataobj.question + '</p>';
			responseDeclaration = '<!-- <responseDeclaration identifier="' + dataobj.identifier + '" cardinality="multiple" baseType="integer"><correctResponse>';

			if (dataobj.options.length > 0) {
				selectionSection += '<table class="selectionTable"><tr><td></td>';
			}
			
			for(i in dataobj.options) {
				var option = '';
				if (dataobj.isAnswersAsImage) {
					option = '<img width="80" src="'+dataobj.options[i]+'" />';
				} else {
					option = dataobj.options[i];
				}
				selectionSection += '<td><!-- <simpleChoice identifier="'+dataobj.options_ids[i]+'">'+option+'</simpleChoice> -->'+ option+'</td>';
				//<!-- <simpleChoice identifier="' + dataobj.options_ids[i] + '"';
				//selectionSection += '>' + dataobj.options[i];
				//selectionSection += '</simpleChoice> --><input id="choiceInteraction" name="simpleChoice" type="checkbox" ';
				//selectionSection += '/>' + dataobj.options[i]+'</td>';
			}
			
			if (dataobj.options.length > 0) {
				selectionSection += '</tr>';
			}

			for(i in dataobj.answers) {
				selectionSection += '<tr><td><!-- <item identifier="' + dataobj.ids[i] + '"';
				if(dataobj.fixed[i] == 1) {
					selectionSection += ' fixed="true" ';
				}
				var ans = '';
				if (dataobj.isAnswersAsImage) {
					ans = '<img width="80" src="'+dataobj.answers[i]+'" />';
				} else {
					ans = dataobj.answers[i];
				}
				selectionSection += '>' + ans; //dataobj.answers[i];
				if(tinyMCE.feedback != undefined && tinyMCE.feedback[dataobj.identifier] != undefined && tinyMCE.feedback[dataobj.identifier].text[dataobj.ids[i]] != undefined) {
					if ('' != tinyMCE.feedback[dataobj.identifier].text[dataobj.ids[i]].onOk) {
						selectionSection += '<feedbackInline ';
						selectionSection += 'value="\\+' + dataobj.ids[i] + ' '+dataobj.points[dataobj.ids[i]]+'.*" ';
						selectionSection += 'mark="CORRECT" ';
						selectionSection += 'fadeEffect="300" ';
						//selectionSection += 'senderIdentifier="^' + dataobj.identifier + '$" ';
						selectionSection += 'variableIdentifier="' + dataobj.identifier + '-LASTCHANGE" '; 
						selectionSection += 'showHide="show">' + tinyMCE.feedback[dataobj.identifier].text[dataobj.ids[i]].onOk + '</feedbackInline>';
					}
					
					if ('' != tinyMCE.feedback[dataobj.identifier].text[dataobj.ids[i]].onWrong) {
						selectionSection += '<feedbackInline ';
						selectionSection += 'value="\\+' + dataobj.ids[i] + ' (?:(?!'+dataobj.points[dataobj.ids[i]]+').)*(;+?.*|$)" ';
						selectionSection += 'mark="WRONG" ';
						selectionSection += 'fadeEffect="300" ';
						//selectionSection += 'senderIdentifier="^' + dataobj.identifier + '$" ';
						selectionSection += 'variableIdentifier="' + dataobj.identifier + '-LASTCHANGE" '; 
						selectionSection += 'showHide="show">' + tinyMCE.feedback[dataobj.identifier].text[dataobj.ids[i]].onWrong + '</feedbackInline>';
					}
				}
				selectionSection += '</item> -->';
				selectionSection += ans + '</td>';
				var checked = '';
				for(opi in dataobj.options_ids) {
					if (dataobj.points[dataobj.ids[i]] == dataobj.options_ids[opi]) {
						checked = 'checked="checked"';
					}
					selectionSection += '<td><input id="selectionInteraction" name="simpleChoice" type="checkbox" '+checked+'/></td>';
					checked = '';
				}
				selectionSection += '</tr>';
			}
			
			if (dataobj.options.length > 0) {
				selectionSection += '</table>';
			}

			for(i in dataobj.points) {
				responseDeclaration += '<value>' + i + ' ' + dataobj.points[i] + '</value>';
			}

			responseDeclaration += '</correctResponse></responseDeclaration> -->';
			selectionSection += '</div><!-- end of selectionInteraction -->';
			selectionSection += '<p>&nbsp;</p><span id="focus">_</span>';

			//var ed = tinyMCEPopup.editor;
			//var ed = tinymce.EditorManager.activeEditor;
			var dom = ed.dom;
			var patt = '';
			//ed.execCommand('mceBeginUndoLevel');
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
			selectionSection = ed.correctHtml(selectionSection, 'decode');
			dom.setOuterHTML(dom.select('._mce_marker')[0], selectionSection);

			body = ed.selection.getNode();
			while(body.nodeName != 'BODY') {
				body = body.parentNode;
			}
			regexp = new RegExp('(<!-- <itemBody> -->)','gi');
			body.innerHTML = body.innerHTML.replace(regexp, responseDeclaration + '$1');
			ed.focusAfterInsert('focus');
			//ed.execCommand('mceEndUndoLevel');

		} else {

			//var ed = tinymce.EditorManager.activeEditor;
			//ed.execCommand('mceBeginUndoLevel');
			var nd = tinyMCE.selectedNode;	
			
			while(nd.nodeName != 'DIV') {
				nd = nd.parentNode;
			}
			nd.previousSibling.nodeValue = ' <selectionInteraction responseIdentifier="' + dataobj.identifier + '" shuffle="' + String(dataobj.shuffle) + '"> ';
			/*if(nd.previousSibling.nodeName == "P") {
				var regexp = new RegExp('<!-- <selectionInteraction responseIdentifier="' + dataobj.identifier + '" shuffle="[^"]*"([^>]*)> -->','gi');
				nd.previousSibling.innerHTML = nd.previousSibling.innerHTML.replace(regexp, '<!-- <selectionInteraction responseIdentifier="' + dataobj.identifier + '" shuffle="' + String(dataobj.shuffle) + '"$1> -->');
			} else {
				var regexp = new RegExp(' <selectionInteraction responseIdentifier="' + dataobj.identifier + '" shuffle="[^"]*"([^>]*)> ','gi');
				nd.previousSibling.data = nd.previousSibling.data.replace(regexp, ' <selectionInteraction responseIdentifier="' + dataobj.identifier + '" shuffle="' + String(dataobj.shuffle) + '"$1> ');
			}*/
			selectionSection = '<p id="selectionInteraction">' + dataobj.question + '</p>';

			if (dataobj.options.length > 0) {
				selectionSection += '<table class="selectionTable"><tr><td></td>';
			}
			var option = '';

			for(i in dataobj.options) {

				if (dataobj.isAnswersAsImage) {
					option = '<img width="80" src="'+dataobj.options[i]+'" />';
				} else {
					option = dataobj.options[i];
				}
				selectionSection += '<td><!-- <simpleChoice identifier="'+dataobj.options_ids[i]+'">'+option+'</simpleChoice> -->'+ option+'</td>';
				//<!-- <simpleChoice identifier="' + dataobj.options_ids[i] + '"';
				//selectionSection += '>' + dataobj.options[i];
				//selectionSection += '</simpleChoice> --><input id="choiceInteraction" name="simpleChoice" type="checkbox" ';
				//selectionSection += '/>' + dataobj.options[i]+'</td>';
			}
			
			if (dataobj.options.length > 0) {
				selectionSection += '</tr>';
			}
/*
			selectionSection = '<p id="choiceInteraction">' + dataobj.question + '</p>';
			for(i in dataobj.options) {
				selectionSection += '<!-- <simpleChoice identifier="' + dataobj.options_ids[i] + '"';
				selectionSection += '>' + dataobj.options[i];
				selectionSection += '</simpleChoice> --><br /><input id="choiceInteraction" name="simpleChoice" type="checkbox" ';
				selectionSection += '/>' + dataobj.options[i];
			}
			*/
			var ans = '';
			for(i in dataobj.answers) {
				
				if (dataobj.isAnswersAsImage) {
					ans = '<img width="80" src="'+dataobj.answers[i]+'" />';
				} else {
					ans = dataobj.answers[i];
				}
				selectionSection += '<tr><td><!-- <item identifier="' + dataobj.ids[i] + '"';
				//selectionSection += '<!-- <item identifier="' + dataobj.ids[i] + '"';
				if(dataobj.fixed[i] == 1) {
					selectionSection += ' fixed="true" ';
				}
				selectionSection += '>' + ans; //dataobj.answers[i];
				if(tinyMCE.feedback != undefined && tinyMCE.feedback[dataobj.identifier] != undefined && tinyMCE.feedback[dataobj.identifier].text[dataobj.ids[i]] != undefined) {
					if ('' != tinyMCE.feedback[dataobj.identifier].text[dataobj.ids[i]].onOk) {
						selectionSection += '<feedbackInline ';
						selectionSection += 'value="\\+' + dataobj.ids[i] + ' '+dataobj.points[dataobj.ids[i]]+'.*" ';
						selectionSection += 'mark="CORRECT" ';
						selectionSection += 'fadeEffect="300" ';
						//selectionSection += 'senderIdentifier="^' + dataobj.identifier + '$" ';
						selectionSection += 'variableIdentifier="' + dataobj.identifier + '-LASTCHANGE" '; 
						selectionSection += 'showHide="show">' + tinyMCE.feedback[dataobj.identifier].text[dataobj.ids[i]].onOk + '</feedbackInline>';
					}

					if ('' != tinyMCE.feedback[dataobj.identifier].text[dataobj.ids[i]].onWrong) {
						selectionSection += '<feedbackInline ';
						selectionSection += 'value="\\+' + dataobj.ids[i] + ' (?:(?!'+dataobj.points[dataobj.ids[i]]+').)*(;+?.*|$)" ';
						selectionSection += 'mark="WRONG" ';
						selectionSection += 'fadeEffect="300" ';
						//selectionSection += 'senderIdentifier="^' + dataobj.identifier + '$" ';
						selectionSection += 'variableIdentifier="' + dataobj.identifier + '-LASTCHANGE" '; 
						selectionSection += 'showHide="show">' + tinyMCE.feedback[dataobj.identifier].text[dataobj.ids[i]].onWrong + '</feedbackInline>';
					}
				}
				selectionSection += '</item> -->';
				selectionSection += ans + '</td>';
				//selectionSection += '</item> --><li>';
				//selectionSection += dataobj.answers[i] + '</li>';
				var checked = '';
				for(opi in dataobj.options_ids) {
					if (dataobj.points[dataobj.ids[i]] == dataobj.options_ids[opi]) {
						checked = 'checked="checked"';
					}
					selectionSection += '<td><input id="selectionInteraction" name="simpleChoice" type="checkbox" '+checked+'/></td>';
					checked = '';
				}
				selectionSection += '</tr>';
			}
			if (dataobj.options.length > 0) {
				selectionSection += '</table>';
			}

			for(i in dataobj.points) {
				responseDeclaration += '<value>' + i + ' ' + dataobj.points[i] + '</value>';
			}
			selectionSection = ed.correctHtml(selectionSection, 'decode');
			nd.innerHTML = selectionSection;

			var body = nd;
			while(body.nodeName != 'BODY') {
				body = body.parentNode;
			}
			
			var xh = ed.XmlHelper;
			var correctResponseNode = xh.getCorrectResponseNodeId(body, dataobj.identifier);
			regexp = new RegExp('(<responseDeclaration[^>]*>[^<]*<correctResponse>)(?:[^<]*<value>[^<]*<\/value>[^<]*)*(<\/correctResponse>[^>]*<\/responseDeclaration>)','gi');
			correctResponseNode.nodeValue = correctResponseNode.nodeValue.replace(regexp, '$1' + responseDeclaration + '$2');
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
			
			var rg = new RegExp('<!-- <modalFeedback[^>]*senderIdentifier="' + dataobj.identifier + '"[^>]*>[^<]*</modalFeedback> -->','gi');
			if(rg.exec(tinyMCE.activeEditor.dom.doc.body.innerHTML) != '') {
				tinyMCE.activeEditor.dom.doc.body.innerHTML = tinyMCE.activeEditor.dom.doc.body.innerHTML.replace(rg,'');
			}
			
			if(tinyMCE.feedback[dataobj.identifier] != undefined) {
				
				var mf = '';
				for (i in tinyMCE.feedback[dataobj.identifier].sound) {
					mf += '<!-- <modalFeedback senderIdentifier="' + dataobj.identifier + '" identifier="' + i + '" showHide="show"';
					if(tinyMCE.feedback[dataobj.identifier].sound[i] != undefined && tinyMCE.feedback[dataobj.identifier].sound[i] != '') {
						mf += ' sound="' + tinyMCE.feedback[dataobj.identifier].sound[i] + '"';
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

tinyMCEPopup.onInit.add(selectionDialog.init, selectionDialog);

