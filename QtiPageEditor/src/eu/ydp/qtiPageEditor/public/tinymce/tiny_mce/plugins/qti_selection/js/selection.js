tinyMCEPopup.requireLangPack();

var selectionDialog = {
	init : function(ed) {
		
		var ed = ed;
		var f = document.forms[0]; 
		var data = tinyMCEPopup.getWindowArg("selectiondata");

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
				
//				if(data.fixed_ch[q] == 'true') {
//					var fixed = ' checked';
//				} else {
//					var fixed = '';
//				}
				var odp = data.answers[q];
				var ct = q+1;
				newDiv.innerHTML = '<strong>' + ct + '.</strong>&nbsp;\n\
					<input type="hidden" name="choices_ids[]" value="' + data.ids_ch[q] + '">\n\
					<input type="text" name="choices[]" value="' + data.choices[q] + '" id="choice_0">&nbsp;\n\
					<input type="button" id="remove_option" name="remove_option" value="Remove" onclick="remove_option_row(this);" />';
				document.getElementById('option_list').appendChild(newDiv);
				
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

				var newInnerHTML = '<table cellpadding=0 cellspacing=0><tr>\n\
					<td width="260px" style="padding-right: 5px;">\n\
					<input type="text" id="answer_0" name="answers[]" style="width: 100%; margin-right: 5px;" value="' + odp + '"/>\n\
					</td>\n\
					<input type="hidden" id="id_0" name="ids[]" value="' + data.ids_ans[q] + '"/>\n\
					<td width="400px" id="optionsSpans">';
				for(p=0; p<data.choices.length;p++) {
					var ct = p+1;
					newInnerHTML += '<span class="optionSpan" style="margin-left: 10px; margin-right: 10px;">\n\
						<strong>' + ct + '.</strong>&nbsp;\n\
						<input id="point_' + p + '" type="radio" value="' + data.ids_ch[p] + '" name="points[' + data.ids_ans[q] + ']" style="margin: 0; padding: 0;"';
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
			newDiv.innerHTML = '<strong>1.</strong>&nbsp;\n\
				<input type="hidden" name="choices_ids[]" value="' + id_2 + '">\n\
				<input type="text" name="choices[]" value="" id="choice_0">&nbsp;\n\
				<input type="button" id="remove_option" name="remove_option" value="Remove" onclick="remove_option_row(this);" />';
			document.getElementById('option_list').appendChild(newDiv);

			var newDiv = document.createElement('div');
			newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
			newDiv.innerHTML = '<strong>2.</strong>&nbsp;\n\
				<input type="hidden" name="choices_ids[]" value="' + id_3 + '">\n\
				<input type="text" name="choices[]" value="" id="choice_1">&nbsp;\n\
				<input type="button" id="remove_option" name="remove_option" value="Remove" onclick="remove_option_row(this);" />';
			document.getElementById('option_list').appendChild(newDiv);

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
			newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr>\n\
				<td width="260px" style="padding-right: 5px;">\n\
				<input type="text" id="answer_0" name="answers[]" style="width: 100%; margin-right: 5px;" value=""/>\n\
				</td>\n\
				<input type="hidden" id="id_0" name="ids[]" value="' + id_0 + '"/>\n\
				<td width="400px" id="optionsSpans">\n\
				<span class="optionSpan" style="margin-left: 10px; margin-right: 10px;">\n\
				<strong>1.</strong>&nbsp;\n\
				<input id="point_0" type="radio" value="' + id_2 + '" name="points[' + id_0 + ']" style="margin: 0; padding: 0;"/>\n\
				</span>\n\
				<span class="optionSpan" style="margin-left: 10px; margin-right: 10px;">\n\
				<strong>2.</strong>&nbsp;\n\
				<input id="point_0" type="radio" value="' + id_3 + '" name="points[' + id_0 + ']" style="margin: 0; padding: 0;"/>\n\
				</span>\n\
				</td>\n\
				<td width="50px"><input id="fixed_0" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td>\n\
				<td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td>\n\
				<td width="50px"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr>\n\
				</table>';
			document.getElementById('answer_list').appendChild(newDiv);
			
			var newDiv = document.createElement('div');
			newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
			newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr>\n\
				<td width="260px" style="padding-right: 5px;">\n\
				<input type="text" id="answer_1" name="answers[]" style="width: 100%; margin-right: 5px;" value=""/>\n\
				</td>\n\
				<input type="hidden" id="id_1" name="ids[]" value="' + id_1 + '"/>\n\
				<td width="400px" id="optionsSpans">\n\
				<span class="optionSpan" style="margin-left: 10px; margin-right: 10px;">\n\
				<strong>1.</strong>&nbsp;\n\
				<input id="point_1" type="radio" value="' + id_2 + '" name="points[' + id_1 + ']" style="margin: 0; padding: 0;"/>\n\
				</span>\n\
				<span class="optionSpan" style="margin-left: 10px; margin-right: 10px;">\n\
				<strong>2.</strong>&nbsp;\n\
				<input id="point_1" type="radio" value="' + id_3 + '" name="points[' + id_1 + ']" style="margin: 0; padding: 0;"/>\n\
				</span>\n\
				</td>\n\
				<td width="50px"><input id="fixed_1" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td>\n\
				<td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td>\n\
				<td width="50px"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr>\n\
				</table>';
			document.getElementById('answer_list').appendChild(newDiv);
			
			var removeButton = document.getElementById('remove_button');
			removeButton.parentNode.removeChild(removeButton);
			
			var insertButton = document.getElementById('insert');
			insertButton.setAttribute('value', 'Insert');
		
		}
	},

	insertSelectionSection : function(form) {

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
		
		var elements = form.elements;
		
		var i = 0;
		var adding = 0;
		var skip_point = 0;
		while(elements[i] != undefined) {
			var element = elements[i];
			if(element.getAttribute('name') == 'question') {
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
					dataobj.answers.push(element.value);
				} else {
					skip_point = 1;
				}
			}
			if(element.getAttribute('name') == 'choices[]') {
				if(element.value != '') {
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
			selectionSection += '<p id="choiceInteraction">' + dataobj.question + '</p>';
			responseDeclaration = '<!-- <responseDeclaration identifier="' + dataobj.identifier + '" cardinality="multiple" baseType="integer"><correctResponse>';

			if (dataobj.options.length > 0) {
				selectionSection += '<table class="selectionTable"><tr><td></td>';
			}
			
			for(i in dataobj.options) {
				selectionSection += '<td><!-- <simpleChoice identifier="'+dataobj.options_ids[i]+'">'+dataobj.options[i]+'</simpleChoice> -->'+ dataobj.options[i]+'</td>';
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
				selectionSection += '>' + dataobj.answers[i];
				if(tinyMCE.feedback != undefined && tinyMCE.feedback[dataobj.identifier] != undefined && tinyMCE.feedback[dataobj.identifier].text[dataobj.ids[i]] != undefined) {
					if ('' != tinyMCE.feedback[dataobj.identifier].text[dataobj.ids[i]].onOk) {
						selectionSection += '<feedbackInline ';
						selectionSection += 'identifier="\\+' + dataobj.ids[i] + ' '+dataobj.options_ids[i]+'.*" ';
						selectionSection += 'mark="CORRECT" ';
						selectionSection += 'fadeEffect="300" ';
						//selectionSection += 'senderIdentifier="^' + dataobj.identifier + '$" ';
						selectionSection += 'outcomeIdentifier="' + dataobj.identifier + '-LASTCHANGE" '; 
						selectionSection += 'showHide="show">' + tinyMCE.feedback[dataobj.identifier].text[dataobj.ids[i]].onOk + '</feedbackInline>';
					}
					
					if ('' != tinyMCE.feedback[dataobj.identifier].text[dataobj.ids[i]].onWrong) {
						selectionSection += '<feedbackInline ';
						selectionSection += 'identifier="\\+' + dataobj.ids[i] + ' (?:(?!'+dataobj.options_ids[i]+').)*(;+?.*|$)" ';
						selectionSection += 'mark="WRONG" ';
						selectionSection += 'fadeEffect="300" ';
						//selectionSection += 'senderIdentifier="^' + dataobj.identifier + '$" ';
						selectionSection += 'outcomeIdentifier="' + dataobj.identifier + '-LASTCHANGE" '; 
						selectionSection += 'showHide="show">' + tinyMCE.feedback[dataobj.identifier].text[dataobj.ids[i]].onWrong + '</feedbackInline>';
					}
				}
				selectionSection += '</item> -->';
				selectionSection += dataobj.answers[i] + '</td>';
				var checked = '';
				for(opi in dataobj.options_ids) {
					if (dataobj.points[dataobj.ids[i]] == dataobj.options_ids[opi]) {
						checked = 'checked="checked"';
					}
					selectionSection += '<td><input id="choiceInteraction" name="simpleChoice" type="checkbox" '+checked+'/></td>';
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
			selectionSection += '<p>&nbsp;</p>';

			var ed = tinyMCEPopup.editor;
			var dom = ed.dom;
			var patt = '';
			
			ed.execCommand('mceBeginUndoLevel');
			var bm = ed.selection.getBookmark();
			
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

			dom.setOuterHTML(dom.select('._mce_marker')[0], selectionSection);
			ed.selection.moveToBookmark(bm);
			ed.execCommand('mceEndUndoLevel');
			
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
				var regexp = new RegExp('<!-- <selectionInteraction responseIdentifier="' + dataobj.identifier + '" shuffle="[^"]*"([^>]*)> -->','gi');
				nd.previousSibling.innerHTML = nd.previousSibling.innerHTML.replace(regexp, '<!-- <selectionInteraction responseIdentifier="' + dataobj.identifier + '" shuffle="' + String(dataobj.shuffle) + '"$1> -->');
			} else {
				var regexp = new RegExp(' <selectionInteraction responseIdentifier="' + dataobj.identifier + '" shuffle="[^"]*"([^>]*)> ','gi');
				nd.previousSibling.data = nd.previousSibling.data.replace(regexp, ' <selectionInteraction responseIdentifier="' + dataobj.identifier + '" shuffle="' + String(dataobj.shuffle) + '"$1> ');
			}
			selectionSection = '<p id="choiceInteraction">' + dataobj.question + '</p>';

			if (dataobj.options.length > 0) {
				selectionSection += '<table class="selectionTable"><tr><td></td>';
			}
			
			for(i in dataobj.options) {
				selectionSection += '<td><!-- <simpleChoice identifier="'+dataobj.options_ids[i]+'">'+dataobj.options[i]+'</simpleChoice> -->'+ dataobj.options[i]+'</td>';
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
			for(i in dataobj.answers) {
				selectionSection += '<tr><td><!-- <item identifier="' + dataobj.ids[i] + '"';
				//selectionSection += '<!-- <item identifier="' + dataobj.ids[i] + '"';
				if(dataobj.fixed[i] == 1) {
					selectionSection += ' fixed="true" ';
				}
				selectionSection += '>' + dataobj.answers[i];
				if(tinyMCE.feedback != undefined && tinyMCE.feedback[dataobj.identifier] != undefined && tinyMCE.feedback[dataobj.identifier].text[dataobj.ids[i]] != undefined) {
					if ('' != tinyMCE.feedback[dataobj.identifier].text[dataobj.ids[i]].onOk) {
						selectionSection += '<feedbackInline ';
						selectionSection += 'identifier="\\+' + dataobj.ids[i] + ' '+dataobj.options_ids[i]+'.*" ';
						selectionSection += 'mark="CORRECT" ';
						selectionSection += 'fadeEffect="300" ';
						//selectionSection += 'senderIdentifier="^' + dataobj.identifier + '$" ';
						selectionSection += 'outcomeIdentifier="' + dataobj.identifier + '-LASTCHANGE" '; 
						selectionSection += 'showHide="show">' + tinyMCE.feedback[dataobj.identifier].text[dataobj.ids[i]].onOk + '</feedbackInline>';
					}
					
					if ('' != tinyMCE.feedback[dataobj.identifier].text[dataobj.ids[i]].onWrong) {
						selectionSection += '<feedbackInline ';
						selectionSection += 'identifier="\\+' + dataobj.ids[i] + ' (?:(?!'+dataobj.options_ids[i]+').)*(;+?.*|$)" ';
						selectionSection += 'mark="WRONG" ';
						selectionSection += 'fadeEffect="300" ';
						//selectionSection += 'senderIdentifier="^' + dataobj.identifier + '$" ';
						selectionSection += 'outcomeIdentifier="' + dataobj.identifier + '-LASTCHANGE" '; 
						selectionSection += 'showHide="show">' + tinyMCE.feedback[dataobj.identifier].text[dataobj.ids[i]].onWrong + '</feedbackInline>';
					}
				}
				selectionSection += '</item> -->';
				selectionSection += dataobj.answers[i] + '</td>';
				//selectionSection += '</item> --><li>';
				//selectionSection += dataobj.answers[i] + '</li>';
				var checked = '';
				for(opi in dataobj.options_ids) {
					if (dataobj.points[dataobj.ids[i]] == dataobj.options_ids[opi]) {
						checked = 'checked="checked"';
					}
					selectionSection += '<td><input id="choiceInteraction" name="simpleChoice" type="checkbox" '+checked+'/></td>';
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

			nd.innerHTML = selectionSection;

			var body = nd;
			while(body.nodeName != 'BODY') {
				body = body.parentNode;
			}
			regexp = new RegExp('(<!-- <responseDeclaration identifier="' + dataobj.identifier + '"[^>]*>[^<]*<correctResponse>)(?:[^<]*<value>[^<]*<\/value>[^<]*)*(<\/correctResponse>[^>]*<\/responseDeclaration> -->)','gi');
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
		tinyMCEPopup.close();
		return true;
		
	}

};

tinyMCEPopup.onInit.add(selectionDialog.init, selectionDialog);

