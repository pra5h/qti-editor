tinyMCEPopup.requireLangPack();

var draggableDialog = {
	init : function(ed) {
		
		var ed = ed;
		var f = document.forms[0]; 
		var data = tinyMCEPopup.getWindowArg("draggabledata");

		if(data != undefined && data.contents != undefined) {

			var it = 0;
			var value = data.contents.replace(/<!-- <slot>(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)?<\/slot> --><span id="mgap"[^>]*>[^<]*<\/span>/gi, function() { return '\[slot #' + ++it + '\]'});

			f.contents.value = value;
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
		var type = 'radio';

		if(data != undefined && data.slots.length > 0) {
		
			for(q=0; q<data.slots.length;q++) {
				var newDiv = document.createElement('div');
				newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
				if(data.fixed[q] == 'true') {
					fixed = ' checked';
				} else {
					fixed = '';
				}
				var odp = data.slots[q];
				
				var qc = q + 1;

				newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="200px" style="padding-right: 5px;"><input type="text" id="answer_' + q + '" name="slots[]" style="width: 100%; margin-right: 5px;" value="' + odp + '"/></td><input type="hidden" id="id_' + q + '" name="ids[]" value="' + data.ids[q] + '"/><td width="50px"><input id="fixed_' + q + '" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" ' + fixed + '/></td><td width="80px"><input type="button" id="add_slot_' + qc + '" class="apply_slot" name="add_slot" value="Add" onclick="apply_slot(' + qc + ');" /></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td width="50px"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
				
				document.getElementById('slots_list').appendChild(newDiv);
				
				if(tinyMCE.feedback == undefined) {
					tinyMCE.feedback = new Array;
				}
				if(tinyMCE.feedback[data.ids[q]] == undefined) {
					tinyMCE.feedback[data.ids[q]] = {text: new Array, sound: new Array};
				}				
				if(data.fdb[q] != undefined) {
					tinyMCE.feedback[data.ids[q]].text = data.fdb[q];
				}
				if(data.fd[q] != undefined) {
					tinyMCE.feedback[data.ids[q]].sound = data.fd[q];
				}
				
			}
		
		} else {
			
			if(data == undefined) {
				document.getElementById('slots_list').innerHTML += '<input type="hidden" name="addnew" value="1">';
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
			newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="200px" style="padding-right: 5px;"><input type="text" id="answer_0" name="slots[]" style="width: 100%; margin-right: 5px;" value=""/></td><input type="hidden" id="id_0" name="ids[]" value="' + id_0 + '"/><td width="50px"><input id="fixed_0" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td><td width="80px"><input type="button" id="add_slot_1" class="apply_slot" name="add_slot" value="Add" onclick="apply_slot(1);" /></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td width="50px"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
			document.getElementById('slots_list').appendChild(newDiv);
			
			var newDiv = document.createElement('div');
			newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
			newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="200px" style="padding-right: 5px;"><input type="text" id="answer_1" name="slots[]" style="width: 100%; margin-right: 5px;" value=""/></td><input type="hidden" id="id_1" name="ids[]" value="' + id_1 + '"/><td width="50px"><input id="fixed_1" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td><td width="80px"><input type="button" id="add_slot_2" class="apply_slot" name="add_slot" value="Add" onclick="apply_slot(2);" /></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td width="50px"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
			document.getElementById('slots_list').appendChild(newDiv);
			
			var removeButton = document.getElementById('remove_button');
			removeButton.parentNode.removeChild(removeButton);
			
			var insertButton = document.getElementById('insert');
			insertButton.setAttribute('value', 'Insert');
		
		}
		
	},

	insertDraggableSection : function(form) {
		var contents = '', identifier = '', shuffle = '', slots = new Array(), points = new Array(), ids = new Array(), fixed = new Array();
		var elements = form.elements;
		var i = 0;
		var adding = 0;
		var skip_point = 0;
		
		while(elements[i] != undefined) {
			var element = elements[i];
			if(element.getAttribute('name') == 'contents') {
				points = element.value.match(/\[slot #([0-9])+\]/gi);
				contents = element.value.replace(/\[slot #[0-9]+\]/gi, '<!-- <slot></slot> --><span id="mgap" style="border: 1px solid green;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
			}
			if(element.getAttribute('name') == 'identifier') {
				identifier = element.value;
			}
			if(element.getAttribute('name') == 'shuffle') {
				shuffle = element.checked;
			}
			if(element.getAttribute('name') == 'slots[]') {
				if(element.value != '') {
					slots.push(element.value);
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
		
		if(contents == '' || slots.length < 1 /*|| slots.length != points.length*/) {
			return false;
		}

		if(adding == 1) {
			var responseDeclaration = '<!-- <responseDeclaration identifier="' + identifier + '" cardinality="commutative" baseType="identifier"><correctResponse>';
			var draggableSection = '<p>&nbsp;</p><!-- <dragDropInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '"> --><div id="dragDropInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">';
			draggableSection += '<!-- <contents> --><p id="dragDropInteractionContents">' + contents;

			for (i in points) {
				var idx = points[i].match(/[0-9]+/i);
				idx--;
				responseDeclaration += '<value>' + ids[idx]  + '</value>';
			}

			draggableSection += '</p><!-- </contents> -->';
			draggableSection += '<!-- <sourcelist> -->';

			for(i in slots) {
				draggableSection += '<!-- <dragElement identifier="' + ids[i] + '"';
				if(fixed[i] == 1) {
					draggableSection += ' fixed="true" ';
				}
				draggableSection += '>' + slots[i];
				draggableSection += '</dragElement> --><span class="dragElement" name="dragElement" style="border: 1px solid green; margin: 5px;">' + slots[i] + '</span>';
			}
			
			draggableSection += '<!-- </sourcelist> -->';
			responseDeclaration += '</correctResponse></responseDeclaration> -->';
			draggableSection += '</div><!-- end of dragDropInteraction -->';
			draggableSection += '<p>&nbsp;</p>';

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

			dom.setOuterHTML(dom.select('._mce_marker')[0], draggableSection);
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

			var responseDeclaration = '';
			var ed = tinymce.EditorManager.activeEditor;
			var nd = tinyMCE.selectedNode;	
			var bm = ed.selection.getBookmark();
			
			while(nd.nodeName != 'DIV') {
				nd = nd.parentNode;
			}

			if(nd.previousSibling.nodeName == "P") {
				var regexp = new RegExp('<!-- <dragDropInteraction responseIdentifier="' + identifier + '" shuffle="[^"]*"([^>]*)> -->','gi');
				nd.previousSibling.innerHTML = nd.previousSibling.innerHTML.replace(regexp, '<!-- <dragDropInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '$1> -->');
			} else {
				var regexp = new RegExp(' <dragDropInteraction responseIdentifier="' + identifier + '" shuffle="[^"]*"([^>]*)> ','gi');
				nd.previousSibling.data = nd.previousSibling.data.replace(regexp, ' <dragDropInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '"$1> ');
			}

			draggableSection = '<!-- <contents> --><p id="dragDropInteractionContents">' + contents;
			draggableSection += '</p><!-- </contents> -->';
			draggableSection += '<!-- <sourcelist> -->';

			for (i in points) {
				var idx = points[i].match(/[0-9]+/i);
				idx--;
				responseDeclaration += '<value>' + ids[idx]  + '</value>';
			}

			for(i in slots) {
				draggableSection += '<!-- <dragElement identifier="' + ids[i] + '"';
				if(fixed[i] == 1) {
					draggableSection += ' fixed="true" ';
				}
				draggableSection += '>' + slots[i];
				draggableSection += '</dragElement> --><span class="dragElement" name="dragElement" style="border: 1px solid green; margin: 5px;">' + slots[i] + '</span>';
			}
			draggableSection += '<!-- </sourcelist> -->';
			nd.innerHTML = draggableSection;

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

tinyMCEPopup.onInit.add(draggableDialog.init, draggableDialog);

