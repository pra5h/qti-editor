tinyMCEPopup.requireLangPack();

var gapDialog = {
	init : function(ed) {
		
		var ed = ed;
		var f = document.forms[0]; 
		var data = tinyMCEPopup.getWindowArg("gapdata");
		
		if(data != undefined) {
			
			f.gap.value = data.value;
			if(data.id != '') {
				f.identifier.value = data.id;
			} else {
				var randid = Math.random();
				randid = String(randid);
				var rg = new RegExp('0.([0-9]*)',"gi");
				exec = rg.exec(randid);
				f.identifier.value = 'id_' + exec[1];
			}
		
		} else {
			
			f = document.forms[0];
			var randid = Math.random();
			randid = String(randid);
			var rg = new RegExp('0.([0-9]*)',"gi");
			exec = rg.exec(randid);
			f.identifier.value = 'id_' + exec[1];

			document.getElementById('gap_content').innerHTML += '<input type="hidden" name="addnew" value="1">';
			
			var removeButton = document.getElementById('remove_button');
			removeButton.parentNode.removeChild(removeButton);
			
			var insertButton = document.getElementById('insert');
			insertButton.setAttribute('value', 'Insert');
			
		}
		
	},

	insertGap : function(form) {
		
		var gap = form.gap.value;
		var identifier = form.identifier.value;
		if(gap != undefined && gap != '') {
			var ed = tinymce.EditorManager.activeEditor;
			var bm = ed.selection.getBookmark();
			ed.selection.moveToBookmark(bm);
			
			if(form.addnew != undefined && form.addnew.getAttribute('value') == '1') {
				
				var gapTag = '<!-- <textEntryInteraction responseIdentifier="' + identifier + '" expectedLength="' + gap.length + '">';
				if(tinyMCE.feedback != undefined && tinyMCE.feedback[identifier] != undefined && tinyMCE.feedback[identifier].onok != undefined) {
					gapTag += '<feedbackInline ';
					gapTag += 'mark="CORRECT"';
					gapTag += ' fadeEffect="300" senderIdentifier="^' + identifier + '$" outcomeIdentifier="' + identifier + '" identifier="' + gap + '" showHide="show">' + tinyMCE.feedback[identifier].onok + '</feedbackInline>'
				} 
				if(tinyMCE.feedback != undefined && tinyMCE.feedback[identifier] != undefined && tinyMCE.feedback[identifier].onwrong != undefined) {
					gapTag += '<feedbackInline ';
					gapTag += 'mark="WRONG"';
					gapTag += ' fadeEffect="300" senderIdentifier="^' + identifier + '$" outcomeIdentifier="' + identifier + '" identifier="' + gap + '" showHide="hide">' + tinyMCE.feedback[identifier].onwrong + '</feedbackInline>'
				} 
				gapTag += '</textEntryInteraction> --><span id="gap" class="mceNonEditable" style="border: 1px solid blue; color: blue; background-color: #f0f0f0;">' + gap + '</span>&nbsp;';
				tinyMCE.execCommand('mceInsertContent', false, gapTag);
				
				responseDeclaration = '<!-- <responseDeclaration identifier="' + identifier + '" cardinality="single" baseType="string"><correctResponse>';
				responseDeclaration += '<value>' + gap + '</value>';
				responseDeclaration += '</correctResponse></responseDeclaration> -->';
				
				body = ed.selection.getNode();
				while(body.nodeName != 'BODY') {
					body = body.parentNode;
				}
				regexp = new RegExp('(<!-- <itemBody> -->)','gi');
				body.innerHTML = body.innerHTML.replace(regexp, responseDeclaration + '$1');
				ed.selection.moveToBookmark(bm);
				
			} else {
			
				var gapTag = tinyMCE.selectedNode;
				var bm = ed.selection.getBookmark();

				gapTag.innerHTML = gap;
				var fdb = '';
				if(tinyMCE.feedback != undefined && tinyMCE.feedback[identifier] != undefined && tinyMCE.feedback[identifier].onok != undefined) {
					fdb += '<feedbackInline ';
					gapTag += 'mark="CORRECT"';
					fdb += ' fadeEffect="300" senderIdentifier="^' + identifier + '$" outcomeIdentifier="' + identifier + '" identifier="' + gap + '" showHide="show">' + tinyMCE.feedback[identifier].onok + '</feedbackInline>'
				} 
				if(tinyMCE.feedback != undefined && tinyMCE.feedback[identifier] != undefined && tinyMCE.feedback[identifier].onwrong != undefined) {
					fdb += '<feedbackInline ';
					gapTag += 'mark="WRONG"';
					fdb += ' fadeEffect="300" senderIdentifier="^' + identifier + '$" outcomeIdentifier="' + identifier + '" identifier="' + gap + '" showHide="hide">' + tinyMCE.feedback[identifier].onwrong + '</feedbackInline>'
				}
				gapTag.previousSibling.data = gapTag.previousSibling.data.replace(/ <textEntryInteraction responseIdentifier="([^"]*)" expectedLength="([^"]*)">[^<]*(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)*[^<]*<\/textEntryInteraction> /gi, ' <textEntryInteraction responseIdentifier="$1" expectedLength="' + gap.length + '">' + fdb + '</textEntryInteraction> ');
				responseDeclaration = '<value>' + gap + '</value>';
				
				body = ed.selection.getNode();
				while(body.nodeName != 'BODY') {
					body = body.parentNode;
				}
				regexp = new RegExp('(<!-- <responseDeclaration identifier="' + identifier + '"[^>]*>[^<]*<correctResponse>)(?:[^<]*<value>[^<]*<\/value>[^<]*)*(<\/correctResponse>[^>]*<\/responseDeclaration> -->)','gi');
				body.innerHTML = body.innerHTML.replace(regexp, '$1' + responseDeclaration + '$2');
				
				ed.selection.moveToBookmark(bm);
				
			}
			
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
			
			var rg_onok = new RegExp('<!-- <modalFeedback[^>]*outcomeIdentifier="' + identifier + '"[^>]*showHide="show"[^>]*>[^<]*</modalFeedback> -->','gi');
			var rg_onwrong = new RegExp('<!-- <modalFeedback[^>]*outcomeIdentifier="' + identifier + '"[^>]*showHide="hide"[^>]*>[^<]*</modalFeedback> -->','gi');
			if(rg_onok.exec(tinyMCE.activeEditor.dom.doc.body.innerHTML) != '') {
				tinyMCE.activeEditor.dom.doc.body.innerHTML = tinyMCE.activeEditor.dom.doc.body.innerHTML.replace(rg_onok,'');
			}
			if(rg_onwrong.exec(tinyMCE.activeEditor.dom.doc.body.innerHTML) != '') {
				tinyMCE.activeEditor.dom.doc.body.innerHTML = tinyMCE.activeEditor.dom.doc.body.innerHTML.replace(rg_onwrong,'');
			}
			
			if(tinyMCE.feedback[identifier] != undefined) {
				
				var mf_onok = '<!-- <modalFeedback outcomeIdentifier="' + identifier + '" identifier="' + gap + '" showHide="show"';
				if(tinyMCE.feedback[identifier].sound_onok != undefined && tinyMCE.feedback[identifier].sound_onok != '') {
					mf_onok += ' sound="' + tinyMCE.feedback[identifier].sound_onok + '"';
				}
				mf_onok += '></modalFeedback> -->'
				var mf_onwrong = '<!-- <modalFeedback outcomeIdentifier="' + identifier + '" identifier="' + gap + '" showHide="hide"';
				if(tinyMCE.feedback[identifier].sound_onwrong != undefined && tinyMCE.feedback[identifier].sound_onwrong != '') {
					mf_onwrong += ' sound="' + tinyMCE.feedback[identifier].sound_onwrong + '"';
				}
				mf_onwrong += '></modalFeedback> -->'
				
				tinyMCE.activeEditor.dom.doc.body.innerHTML = tinyMCE.activeEditor.dom.doc.body.innerHTML.replace(/(<!-- <\/itemBody> -->)/i, '$1' + mf_onok + mf_onwrong);
				tinyMCE.feedback = new Array;
				
			}
			
		} 
		
		tinyMCEPopup.close();
		return true;
		
	}

};

tinyMCEPopup.onInit.add(gapDialog.init, gapDialog);

