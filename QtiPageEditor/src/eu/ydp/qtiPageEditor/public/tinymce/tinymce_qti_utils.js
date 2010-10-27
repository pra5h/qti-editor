
function actionOnQTI(e) {
	
	var ed = tinymce.EditorManager.activeEditor;
	
	// fix for writing content before xml template
	if(ed.selection.getStart().attributes != undefined && ed.selection.getStart().hasAttribute('_moz_editor_bogus_node')) {
		ed.selection.dom.doc.body.innerHTML = ed.selection.dom.doc.body.innerHTML.replace(/(.*)(<!-- \?xml[^\?]*\? -->[^<]*<!-- <assessmentItem[^>]*> -->[^<]*<!-- <itemBody> -->)/gi,'$2$1');
	}
	
	// TODO: ZNALEZC OBEJSCIE DLA IE !! WAZNE !!
	if(!tinymce.isIE) { 
		if(ed.selection.getRng().startContainer.nodeName == 'BODY') {
			if(ed.selection.dom.doc.body.getElementsByTagName('p')[0] != undefined && tinyMCE.originalBookmark == undefined) {
				ed.selection.select(ed.selection.dom.doc.body.getElementsByTagName('p')[0]);
				//ed.selection.moveToBookmark(ed.selection.getBookmark());
			} 
		} 
	} 
	
	if(tinyMCE.changesTracking != undefined) {
		if(tinyMCE.changesTracking === true) {
		
			if(tinyMCE.originalBookmark != undefined) {
				ed.selection.moveToBookmark(tinyMCE.originalBookmark);
				delete tinyMCE.originalBookmark;
			}
			
			// Disable editing original content
			if(ed.selection.getNode().nodeName != undefined && ed.selection.getNode().nodeName == 'SPAN' && ed.selection.getNode().getAttribute('class') == 'changestracking_original') {
				if(e.type == 'keypress' && (e.charCode != 0 || e.keyCode == 8 || e.keyCode == 88 || e.keyCode == 46 || e.keyCode == 86)) {
					return false;
				}
			}
			
			// On typing text or pasting
			if(e.type=='keypress' && (e.charCode != 0 || e.keyCode == 86)) {
				
				if(ed.selection.getContent() != '') {
					
					// replace selected text
					ed.windowManager.alert('Text replacing is not allowed in changes tracking mode');
					return false;
					
				} else if(ed.selection.getNode().nodeName != undefined && ed.selection.getNode().nodeName == 'SPAN' && ed.selection.getNode().attributes != undefined && ed.selection.getNode().getAttribute('class') == 'changestracking_new') {
					
					// type inside previously added text
					return true;
					
				} else if(ed.selection.getNode().nodeName != undefined && ed.selection.getNode().nodeName == 'SPAN' && ed.selection.getNode().className != undefined && ed.selection.getNode().className == 'AMedit') {
					
					// type inside math expressions
					ed.selection.getNode().setAttribute('style','color: red;');
					return true;
					
				} else {
					
					// type new text
					tinyMCE.execCommand('mceInsertContent', false, '<span class="changestracking_new" style="color: red; text-decoration: underline;" title="Changes tracking: new content">' + String.fromCharCode(e.charCode) + '</span>');
					return false;
					
				}
				
			}
			
			// Actions on normal text
			if(ed.selection.getNode().nodeName == undefined || ed.selection.getNode().nodeName != 'SPAN' || ed.selection.getNode().attributes == undefined || ed.selection.getNode().getAttribute('class') != 'changestracking_new') {
				// on backspace
				if(e.type == 'keypress' && e.keyCode == 8) {
					var content = ed.selection.getContent();
					if(content != '') {
						
						var myBookmark = ed.selection.getBookmark();
						ed.selection.moveToBookmark(myBookmark);
						tinyMCE.execCommand('mceInsertContent', false, '<span class="changestracking_original" style="color: red; text-decoration: line-through;" title="Changes tracking: original content">' + content + '</span>');
						myBookmark.end = myBookmark.start;
						ed.selection.moveToBookmark(myBookmark);
						
					} else if(ed.selection.getNode().nodeName != undefined && ed.selection.getNode().nodeName == 'SPAN' && ed.selection.getNode().className != undefined && ed.selection.getNode().className == 'AMedit') {
						
						ed.selection.getNode().setAttribute('style','color: red;');
						return true;
						
					} else {
						
						var myBookmark = ed.selection.getBookmark();
						
						myBookmark.start = myBookmark.start - 1;
						ed.selection.moveToBookmark(myBookmark);
						
						var content = ed.selection.getContent();
						tinyMCE.execCommand('mceInsertContent', false, '<span class="changestracking_original" style="color: red; text-decoration: line-through;" title="Changes tracking: original content">' + content + '</span>');
						myBookmark.end = myBookmark.start;
						ed.selection.moveToBookmark(myBookmark);
						
					}
					//reduceNumberOfSpans();
					return false;
				} // eof on backspace
				
				// on delete
				if(e.type == 'keypress' && e.keyCode == 46) {
					var content = ed.selection.getContent();
					if(content != '') {
						var myBookmark = ed.selection.getBookmark();
						ed.selection.moveToBookmark(myBookmark);
						tinyMCE.execCommand('mceInsertContent', false, '<span class="changestracking_original" style="color: red; text-decoration: line-through;" title="Changes tracking: original content">' + content + '</span>');
						myBookmark.start = myBookmark.end;
						ed.selection.moveToBookmark(myBookmark);
					} else {
						ed.windowManager.alert('Delete button is not working properly in changes tracking mode, due to technical reasons');
						//var myBookmark = ed.selection.getBookmark();
						//myBookmark.end = myBookmark.end + 1;
						//ed.selection.moveToBookmark(myBookmark);
						//var content = ed.selection.getContent();
						//tinyMCE.execCommand('mceInsertContent', false, '<span class="changestracking_original" style="color: red; text-decoration: line-through;" title="Changes tracking: original content">' + content + '</span>');
						//myBookmark.start = myBookmark.end;
						//ed.selection.moveToBookmark(myBookmark);
					}
					//reduceNumberOfSpans();
					return false;
				} // eof on delete
			
			}// eof actions on normal text
			
		} else {
			if(e.type == 'keypress' && (e.charCode != 0 || e.keyCode == 8 || e.keyCode == 46)) {
				if(ed.selection.getNode().nodeName != undefined && ed.selection.getNode().nodeName == 'SPAN' && ed.selection.getNode().attributes != undefined && ed.selection.getNode().getAttribute('class') == 'changestracking_new') {
					return false;
				}
				if(ed.selection.getNode().nodeName != undefined && ed.selection.getNode().nodeName == 'SPAN' && ed.selection.getNode().attributes != undefined && ed.selection.getNode().getAttribute('class') == 'changestracking_original') {
					return false;
				}
			}
		}
		
	} // eof changesTracking

	if ((e.type == 'dblclick' && e.button == 0) || (e.type == 'keypress' && e.keyCode == '113')) {
		
		if(e.type == 'dblclick') {
			var selectedNode = e.target;
		} else {
			var selectedNode = ed.selection.getNode();
		}
		
		if(selectedNode.nodeName == 'HTML') {
			return false;
		}
		
		while(selectedNode.nodeName != 'BODY') {
			if(selectedNode.attributes != undefined) {
				
				// QY Comments
				if (selectedNode.nodeName == 'DIV' && selectedNode.getAttribute('class') == 'mceNonEditable qy_comment') {
					runComment(selectedNode);
					break;
				}
				
				// MediaLib
				if(selectedNode.nodeName == 'IMG' || (selectedNode.nodeName == 'FIELDSET' && selectedNode.id == 'runFileUploadLib')) {
					runMediaLib(selectedNode);
					break;
				}
				
				// Gap
				if (selectedNode.nodeName == 'SPAN' && selectedNode.id == 'gap') {
					runGap(selectedNode);
					break
				}
				
				// Inline choice
				if (selectedNode.id == 'inlineChoiceInteraction' || selectedNode.id == 'inlineChoiceAnswer' || selectedNode.parentNode.id == 'inlineChoiceAnswer') {
					runInlineChoice(selectedNode);
					break;
				}
				
				// Multiple choice
				if ((selectedNode.nodeName == 'P' && selectedNode.id == 'choiceInteraction' && selectedNode.parentNode.id == 'choiceInteraction') || (selectedNode.nodeName == 'DIV' && selectedNode.id == 'choiceInteraction')) {
					runMultipleChoice(selectedNode);
					break;
				}
				
				// Order
				if (selectedNode.id == 'orderOption' || (selectedNode.id == 'choiceInteraction' && selectedNode.parentNode.id == 'orderInteraction')) {
					runOrder(selectedNode);
					break;
				}
				
				// Match
				if (selectedNode.id != undefined && (selectedNode.id == 'matchInteraction' || selectedNode.id.match(/canvas_/))) {
					runMatch(selectedNode);
					break;
				}
				
			}
			selectedNode = selectedNode.parentNode;
		}
		
	}
	return true;
	
}

//QY Comments
function runComment(selectedNode) {
	
	var ed = tinymce.EditorManager.activeEditor;
	var comment_content = selectedNode.innerHTML;
	var idref = selectedNode.getAttribute('id');
	idref = idref.replace(/^ref_([0-9]+)/i, '$1');
	var commented_text = selectedNode.nextSibling;
	if(commented_text != undefined) {
		if(commented_text.nodeName != 'SPAN' || commented_text.id != idref) {
			for(i in commented_text.children) {
				if(commented_text.children[i].nodeName == 'SPAN' && commented_text.children[i].id == idref) {
					commented_text = commented_text.children[i];
					break;
				}
			}
		} 
		commented_text = commented_text.innerHTML;
		tinyMCE.execCommand('mceComment', false, {comment_content: comment_content, comment_id: idref, commented_text: commented_text});
	} else {
		tinyMCE.execCommand('mceComment', false, {comment_content: comment_content, comment_id: idref, commented_text: ''});
	}
		
}

//MediaLib
function runMediaLib(selectedNode) {

	var ed = tinymce.EditorManager.activeEditor;
	if(selectedNode.nodeName == 'IMG') {
		var node = selectedNode;
	} else {
		var node = selectedNode.getElementsByTagName('img')[0];
	}
	
	if(node.getAttribute('id') == 'mceVideo') {
		var src = node.previousSibling.getAttribute('src');
		var title = node.previousSibling.getAttribute('title');
		tinyMCE.execCommand('mceAddVideo', false, {src: src, title: title});
	} else {
		var src = node.attributes['src'].value;
		if(node.attributes['title'] != undefined) {
			var title = node.attributes['title'].value;
		} else {
			var title = '';
		}
		var data = {src: src, title: title};
		//src = src.split('/');
		//src = src[src.length - 1];
		tinyMCE.execCommand('mceAppendImageToPage', false, data);
	}

}

// Gap
function runGap(selectedNode) {
			
	var ed = tinymce.EditorManager.activeEditor;
	var qtiNode = selectedNode;
	var qtiNodeInnerHTML = qtiNode.innerHTML;
	
	var id = qtiNode.previousSibling.data;
	rg = new RegExp('<textEntryInteraction responseIdentifier="([^"]*)"[^>]*>',"gi");
	id = rg.exec(id);
	if(id[1] && id[1] != undefined && id[1] != '') {
		id = id[1];
	} else {
		id = '';
	}
	var body = ed.selection.dom.doc.body.innerHTML;
	
	rg = new RegExp('<feedbackInline[^>]*showHide="show"[^>]*>([^<]*)<\/feedbackInline>','gi');
	var onok = rg.exec(qtiNode.previousSibling.data);
	if(onok != undefined) {
		var oo = onok[1];
	} else {
		var oo = '';
	}
	rg = new RegExp('<modalFeedback[^>]*outcomeIdentifier="' + id + '"[^>]*showHide="show"[^>]*sound="([^"]*)"[^>]*>','gi');
	var onok_sound = rg.exec(body);
	if(onok_sound != undefined) {
		var oo_snd = onok_sound[1];
	} else {
		var oo_snd = '';
	}
	rg = new RegExp('<feedbackInline[^>]*showHide="hide"[^>]*>([^<]*)<\/feedbackInline>','gi');
	var onwrong = rg.exec(qtiNode.previousSibling.data);
	if(onwrong != undefined) {
		var ow = onwrong[1];
	} else {
		var ow = '';
	}
	rg = new RegExp('<modalFeedback[^>]*outcomeIdentifier="' + id + '"[^>]*showHide="hide"[^>]*sound="([^"]*)"[^>]*>','gi');
	var onwrong_sound = rg.exec(body);
	if(onwrong_sound != undefined) {
		var ow_snd = onwrong_sound[1];
	} else {
		var ow_snd = '';
	}
	
	var gapdata = {value: qtiNodeInnerHTML, id: id, onok: oo, onwrong: ow, onok_sound: oo_snd, onwrong_sound: ow_snd};
	
	tinyMCE.selectedNode = selectedNode;
	tinyMCE.execCommand('mceGap', false, gapdata);
	
}

// Inline choice
function runInlineChoice(selectedNode) {
			
	var ed = tinymce.EditorManager.activeEditor;
	var answers = new Array();
	var points = new Array();
	var ids = new Array();
	var fixed = new Array();
	var data = new Array();
	var fdb = new Array();
	
	var inlineChoiceSpan = selectedNode;
	while(inlineChoiceSpan.id != 'inlineChoiceInteraction') {
		inlineChoiceSpan = inlineChoiceSpan.parentNode;
	}
	var choiceSectionHTML = inlineChoiceSpan.innerHTML;
	if(inlineChoiceSpan.previousSibling != undefined) {
		if(inlineChoiceSpan.previousSibling.nodeName == "P") {
			var identifier = inlineChoiceSpan.previousSibling.innerHTML.match(/<inlineChoiceInteraction responseIdentifier="([^"]+)"[^>]*>/i);
			var shuffle = inlineChoiceSpan.previousSibling.innerHTML.match(/<inlineChoiceInteraction.*?shuffle="([^"]*)"[^>]*>/i);
		} else {
			var identifier = inlineChoiceSpan.previousSibling.data.match(/<inlineChoiceInteraction responseIdentifier="([^"]+)"[^>]*>/i);
			var shuffle = inlineChoiceSpan.previousSibling.data.match(/<inlineChoiceInteraction.*?shuffle="([^"]*)"[^>]*>/i);
		}
	} else {
		var identifier = inlineChoiceSpan.parentNode.previousSibling.data.match(/<inlineChoiceInteraction responseIdentifier="([^"]+)"[^>]*>/i);
		var shuffle = inlineChoiceSpan.parentNode.previousSibling.data.match(/<inlineChoiceInteraction.*?shuffle="([^"]*)"[^>]*>/i);
	}
	var answers_paragraph = choiceSectionHTML.match(/<!-- <inlineChoice identifier="[^"]*"[^>]*>[^<]*(?:<feedbackInline[^>]*>([^<]*)<\/feedbackInline>)?<\/inlineChoice> --><span id="inlineChoiceAnswer" style="[^"]*"[^>]*>([^<]*)(<span[^>]*>[^<]*<\/span>)?<\/span>/gi);
	var values = new Array();
	for (ans in answers_paragraph) {
		values.push(answers_paragraph[ans].match(/<!-- <inlineChoice identifier="([^"]*)"\s*(?:fixed="([^"]*)")?[^>]*>[^<]*(?:<feedbackInline[^>]*>([^<]*)<\/feedbackInline>)?<\/inlineChoice> --><span id="inlineChoiceAnswer" style="[^"]*"[^>]*>([^<]*)(<span[^>]*>[^<]*<\/span>)?<\/span>/i));
	}
	var i=0;
	while(values[i] != undefined) {
		ids.push(values[i][1]);
		answers.push(values[i][4]);
		if(values[i][5] != undefined) {
			points.push(1);
		} else {
			points.push(0);
		}
		if(values[i][2] == 'true') {
			fixed.push('true');
		} else {
			fixed.push('false');
		}
		fdb[values[i][1]] = values[i][3];
		i++;
	}
	
	data.push('');
	data.push(answers);
	data.push(points);
	data.push(ids);
	data.push(identifier[1]);
	data.push(shuffle[1]);
	data.push(fixed);
	data.push(fdb);
	
	var body = ed.selection.dom.doc.body.innerHTML;
	
	rg = new RegExp('<modalFeedback[^>]*senderIdentifier="' + identifier[1] + '"[^>]*identifier="([^"]*)"[^>]*sound="([^"]*)"[^>]*>','gi');
	var fdArr = body.match(rg);
	if(fdArr != undefined) {
		var fd = new Array;
		for (i in fdArr) {
			rg = new RegExp('<modalFeedback[^>]*senderIdentifier="' + identifier[1] + '"[^>]*identifier="([^"]*)"[^>]*sound="([^"]*)"[^>]*>','i');
			var arr = rg.exec(fdArr[i]);
			fd[arr[1]] = arr[2]
		}
		data.push(fd);
	}			
	
	tinyMCE.selectedNode = selectedNode;
	tinyMCE.execCommand('mceInlineChoice', false, data);
	
}

// Multiple choice
function runMultipleChoice(selectedNode) {
			
	var ed = tinymce.EditorManager.activeEditor;
	var answers = new Array();
	var points = new Array();
	var ids = new Array();
	var fixed = new Array();
	var fdb = new Array();
	var data = new Array();
	
	var sectionDiv = selectedNode;
	while(sectionDiv.nodeName != 'DIV') {
		sectionDiv = sectionDiv.parentNode;
	}
	var choiceSectionHTML = sectionDiv.innerHTML;
	var question = choiceSectionHTML.match(/<p id="choiceInteraction">([^<]*)<\/p>/i);
	if(sectionDiv.previousSibling.nodeName == "P") {
		var identifier = sectionDiv.previousSibling.innerHTML.match(/<choiceInteraction responseIdentifier="([^"]+)"[^>]*>/i);
		var shuffle = sectionDiv.previousSibling.innerHTML.match(/<choiceInteraction.*?shuffle="([^"]*)"[^>]*>/i);
		var maxChoices = sectionDiv.previousSibling.innerHTML.match(/<choiceInteraction.*?maxChoices="([^"]*)"[^>]*>/i);
	} else {
		var identifier = sectionDiv.previousSibling.data.match(/<choiceInteraction responseIdentifier="([^"]+)"[^>]*>/i);
		var shuffle = sectionDiv.previousSibling.data.match(/<choiceInteraction.*?shuffle="([^"]*)"[^>]*>/i);
		var maxChoices = sectionDiv.previousSibling.data.match(/<choiceInteraction.*?maxChoices="([^"]*)"[^>]*>/i);
	}
	var answers_paragraph = choiceSectionHTML.match(/<!-- <simpleChoice identifier="[^"]*"[^>]*>([^<]*|<img[^>]*>)[^<]*(?:<feedbackInline[^>]*>[^<]*<\/feedbackInline>)?[^<]*<\/simpleChoice>[^<]* --><br[^>]*><input id="choiceInteraction" name="simpleChoice" (checked="checked" )?type="checkbox">(<img[^>]*>|[^<]*)/gi);
	var values = new Array();
	for (ans in answers_paragraph) {
		values.push(answers_paragraph[ans].match(/<!-- <simpleChoice identifier="([^"]*)"\s*(?:fixed="([^"]*)")?[^>]*>(?:[^<]*|<img[^>]*>)[^<]*(?:<feedbackInline[^>]*>([^<]*)<\/feedbackInline>)?[^<]*<\/simpleChoice>[^<]* --><br[^>]*><input id="choiceInteraction" name="simpleChoice" (checked="checked" )?type="checkbox">(<img[^>]*>|[^<]*)/i));
	}
	var i=0;
	while(values[i] != undefined) {
		ids.push(values[i][1]);
		answers.push(values[i][5]);
		if(values[i][4] == 'checked="checked" ') {
			points.push('1');
		} else {
			points.push('0');
		}
		fixed.push(values[i][2]);
		fdb[values[i][1]] = values[i][3];
		i++;
	}
	data.push(question[1]);
	data.push(answers);
	data.push(points);
	data.push(ids);
	data.push(identifier[1]);
	data.push(shuffle[1]);
	data.push(fixed);
	data.push(maxChoices[1]);
	data.push(fdb);
	
	var body = ed.selection.dom.doc.body.innerHTML;
	rg = new RegExp('<modalFeedback[^>]*senderIdentifier="' + identifier[1] + '"[^>]*identifier="([^"]*)"[^>]*sound="([^"]*)"[^>]*>','gi');
	var fdArr = body.match(rg);
	var fd = new Array;
	if(fdArr != undefined) {
		for (i in fdArr) {
			rg = new RegExp('<modalFeedback[^>]*senderIdentifier="' + identifier[1] + '"[^>]*identifier="([^"]*)"[^>]*sound="([^"]*)"[^>]*>','i');
			var arr = rg.exec(fdArr[i]);
			fd[arr[1]] = arr[2]
		}
	}
	data.push(fd);	
	
	tinyMCE.selectedNode = selectedNode;
	tinyMCE.execCommand('mceChoice', false, data);
	
}

// Order 
function runOrder(selectedNode) {			
	
	var ed = tinymce.EditorManager.activeEditor;
	var answers = new Array();
	var points = new Array();
	var ids = new Array();
	var fixed = new Array();
	var data = new Array();
	var fdb = '';
	
	var sectionDiv = selectedNode;
	while(sectionDiv.nodeName != 'DIV' || sectionDiv.id != 'orderInteraction') {
		sectionDiv = sectionDiv.parentNode;
	}
	var orderSectionHTML = sectionDiv.innerHTML;
	var question = orderSectionHTML.match(/<p id="choiceInteraction">([^<]*)<\/p>/i);
	if(sectionDiv.previousSibling.nodeName == "P") {
		var identifier = sectionDiv.previousSibling.innerHTML.match(/<orderInteraction responseIdentifier="([^"]+)"[^>]*>/i);
		var shuffle = sectionDiv.previousSibling.innerHTML.match(/<orderInteraction.*?shuffle="([^"]*)"[^>]*>/i);
	} else {
		var identifier = sectionDiv.previousSibling.data.match(/<orderInteraction responseIdentifier="([^"]+)"[^>]*>/i);
		var shuffle = sectionDiv.previousSibling.data.match(/<orderInteraction.*?shuffle="([^"]*)"[^>]*>/i);
	}
	
	var answers_paragraph = orderSectionHTML.match(/<!-- <simpleChoice identifier="[^"]*"[^>]*>([^<]*|<img[^>]*>)(?=<feedbackInline[^>]*>[^<]*<\/feedbackInline>)?<\/simpleChoice>[^-]*-->(?:<\/p>)?<div id="orderOption" name="([0-9]+)"[^>]*>(<img[^>]*>|[^<]*)<\/div>/gi);
	var values = new Array();
	for (ans in answers_paragraph) {
		values.push(answers_paragraph[ans].match(/<!-- <simpleChoice identifier="([^"]*)"\s*(?:fixed="([^"]*)")?[^>]*>(?:[^<]*|<img[^>]*>)[^<]*(?:<feedbackInline[^>]*>([^<]*)<\/feedbackInline>)?<\/simpleChoice>[^-]*-->(?:<\/p>)?<div id="orderOption" name="([0-9]+)"[^>]*>(<img[^>]*>|[^<]*)<\/div>/i));
	}
	var i=0;
	while(values[i] != undefined) {
		var point = values[i][4];
		points.push(point);
		point--;
		ids[point] = values[i][1];
		answers[point] = values[i][5];
		fixed[point] = values[i][2];
		i++;
	}
	
	var fd = orderSectionHTML.match(/<feedbackInline[^>]*>([^<]*)<\/feedbackInline>/i);
	if(fd != undefined) {
		fdb = fd[1];
	}
	
	data.push(question[1]);
	data.push(answers);
	data.push(points);
	data.push(ids);
	data.push(identifier[1]);
	data.push(shuffle[1]);
	data.push(fixed);
	data.push(fdb);
	
	tinyMCE.selectedNode = selectedNode;
	tinyMCE.execCommand('mceOrder', false, data);
	
}

// Match
function runMatch(selectedNode) {
			
	var ed = tinymce.EditorManager.activeEditor;
	var answers = new Array();
	var points = new Array();
	var ids = new Array();
	var fixed = new Array();
	var data = new Array();
	var fdb = new Array();
	
	var sectionDiv = selectedNode;
	while(sectionDiv.nodeName != 'DIV' || sectionDiv.id != 'matchInteraction') {
		sectionDiv = sectionDiv.parentNode;
	}
	
	var matchSectionHTML = sectionDiv.innerHTML;
	var question = matchSectionHTML.match(/<p id="matchInteraction">([^<]*)<\/p>/i);
	
	var identifier = sectionDiv.previousSibling.data.match(/<matchInteraction responseIdentifier="([^"]+)"[^>]*>/i);
	var shuffle = sectionDiv.previousSibling.data.match(/<matchInteraction.*?shuffle="([^"]*)"[^>]*>/i);
	
	//var leftSet = $('matchInteraction[responseIdentifier=\'' + identifier[1] + '\'] > simpleMatchSet:first').children();
	//var rightSet = $('matchInteraction[responseIdentifier=\'' + identifier[1] + '\'] > simpleMatchSet:last').children();
	
	var sets = sectionDiv.children[1].children[0].children[0].children;
	var leftSet = sets[0].children[0].children[0].children;
	var rightSet = sets[2].children[0].children[0].children;
	
	var leftSetAnswers = new Array;
	var leftSetIds = new Array;
	var leftSetFixed = new Array;
	var rightSetAnswers = new Array;
	var rightSetIds = new Array;
	var rightSetFixed = new Array;
	var responsePairs = new Array;
	
	for (el in leftSet) {
		if(leftSet[el].children != undefined) {
			leftSetAnswers.push(leftSet[el].children[0].children[2].innerHTML);
			leftSetIds.push(leftSet[el].children[0].children[0].innerHTML);
			leftSetFixed.push(leftSet[el].children[0].children[1].innerHTML);
		}
	}
	
	for (el in rightSet) {
		if(rightSet[el].children != undefined) {
			rightSetAnswers.push(rightSet[el].children[0].children[2].innerHTML);
			rightSetIds.push(rightSet[el].children[0].children[0].innerHTML);
			rightSetFixed.push(rightSet[el].children[0].children[1].innerHTML);
		}
	}
	
	var tinybody = ed.selection.getNode();
	while(tinybody.nodeName != 'BODY') {
		tinybody = tinybody.parentNode;
	}
	
	tinybody = tinybody.innerHTML;	
	var rg = new RegExp('<!-- <responseDeclaration identifier="' + identifier[1] + '" [^>]*>[^<]*<correctResponse>[^<]*((?:<value>[^<]*<\/value>[^<]*)*)[^<]*<\/correctResponse>','gi');
	var valuesStr = rg.exec(tinybody);
	valuesArr = valuesStr[1].match(/<value>([^<]*)<\/value>/gi);
	
	for (i in valuesArr) {
		responsePairs.push(valuesArr[i].match(/<value>([^<]*)<\/value>/i)[1]);
	}
	
	var rg = new RegExp('<feedbackInline[^>]*identifier="([^"]*)"[^>]*>([^<]*)<\/feedbackInline>',"gi");
	var fdbArr = matchSectionHTML.match(rg);
	for(i in fdbArr) {
		var val = rg.exec(fdbArr[i]);
		var val2 = fdbArr[i].match(rg); // lol?
		if(val != undefined) {
			fdb[val[1]] = val[2];
		}
	}
	
	data.push(question[1]);
	data.push(identifier[1]);
	data.push(shuffle[1]);
	data.push(leftSetAnswers);
	data.push(leftSetIds);
	data.push(rightSetAnswers);
	data.push(rightSetIds);
	data.push(leftSetFixed);
	data.push(rightSetFixed);
	data.push(responsePairs);
	data.push(fdb);
	
	var body = ed.selection.dom.doc.body.innerHTML;
	
	rg = new RegExp('<modalFeedback[^>]*senderIdentifier="' + identifier[1] + '"[^>]*identifier="([^"]*)"[^>]*sound="([^"]*)"[^>]*>','gi');
	var fdArr = body.match(rg);
	if(fdArr != undefined) {
		var fd = new Array;
		for (i in fdArr) {
			rg = new RegExp('<modalFeedback[^>]*senderIdentifier="' + identifier[1] + '"[^>]*identifier="([^"]*)"[^>]*sound="([^"]*)"[^>]*>','i');
			var arr = rg.exec(fdArr[i]);
			fd[arr[1]] = arr[2]
		}
		data.push(fd);
	}			
	
	tinyMCE.selectedNode = selectedNode;
	tinyMCE.execCommand('mceMatch', false, data);
	
}

function cutQTI(content) {
	
	content = content.replace(/<!-- \?(xml[^\?]*)\? -->/gi,'');
	
	content = content.replace(/<!-- (<assessmentItem [^>]*>) -->/gi,'');
	content = content.replace(/<!-- (<\/assessmentItem>) -->/gi,'');
	
	content = content.replace(/<!-- (<responseDeclaration[^>]*>)/gi,'');
	content = content.replace(/(<\/responseDeclaration>) -->/gi,'');
	
	content = content.replace(/<!-- (<itemBody>) -->/gi,'');
	content = content.replace(/<!-- (<\/itemBody>) -->/gi,'');
	
	content = content.replace(/<!-- (<gap[^>]*>[^<]*<\/gap>) --><span id="gap" class="mceNonEditable"[^>]*>([^<]*)<\/span>/gi, '');
	
	content = content.replace(/(?:<p>)?<!-- (<choiceInteraction[^>]*>) -->(?:<\/p>)?<div id="choiceInteraction" class="mceNonEditable"[^>]*>/gi, '');
	content = content.replace(/<p id="choiceInteraction">([^<]*)<\/p>/gi, '');
	content = content.replace(/<!-- (<simpleChoice[^>]*>([^<]*|[^<]*<img[^>]*>[^<]*)<\/simpleChoice>) --><br[^>]*><input id="choiceInteraction" [^>]*>(<img[^>]*>|[^<]*)/gi,'');
	content = content.replace(/<\/p><\/div><!-- end of choiceInteraction -->/gi,'');
	
	content = content.replace(/(?:<p>)?<!-- (<inlineChoiceInteraction[^>]*>) -->(?:<\/p>)?<span id="inlineChoiceInteraction" class="mceNonEditable"[^>]*>/gi, '');
	content = content.replace(/<!-- (<inlineChoice[^>]*>[^<]*<\/inlineChoice>) --><span id="inlineChoiceAnswer"[^>]*>[^<]*(?:<span[^>]*>[^<]*<\/span>)?<\/span>/gi,'');
	content = content.replace(/<\/span>[^<]*(?:<\/p>)?[^<]*<!-- end of inlineChoiceInteraction -->/gi,'');
	
	content = content.replace(/(?:<p>)?<!-- (<orderInteraction[^>]*>) -->(?:<\/p>)?<div id="orderInteraction"[^>]*>/gi, '');
	content = content.replace(/<!-- (<simpleChoice[^>]*>([^<]*|[^<]*<img[^>]*>[^<]*)<\/simpleChoice>) -->(?:<\/p>)?<div id="orderOption" [^>]*>(<img[^>]*>|[^<]*)<\/div>/gi,'');
	content = content.replace(/<\/div><!-- end of orderInteraction -->/gi,'');
	
	content = content.replace(/<!-- (<matchInteraction[^>]*>) --><div id="matchInteraction" class="mceNonEditable"[^>]*>/gi, '');
	content = content.replace(/<p id="matchInteraction">([^<]*)<\/p><table[^>]*><tbody><tr[^>]*>/gi, '');
	content = content.replace(/<td id="canvas_td"[^>]*><canvas[^>]*><\/canvas><\/td>/gi, '');
	content = content.replace(/<!-- (<simpleMatchSet>) --><td[^>]*><table[^>]*><tbody>/gi, '');
	content = content.replace(/(<tr id="canvas_tr"[^>]*><td[^>]*><canvas id="canvas"[^>]*><\/canvas><\/td><\/tr>)/gi,'');
	content = content.replace(/<!-- (<simpleAssociableChoice[^>]*>([^<]*|[^<]*<img[^>]*>[^<]*)<\/simpleAssociableChoice>) --><tr[^>]*><td[^>]*><span[^>]*>[^<]*<\/span><span[^>]*>[^<]*<\/span><span[^>]*>([^<]*|[^<]*<img[^>]*>[^<]*)<\/span><\/td><\/tr>/gi, '');
	content = content.replace(/<!-- (<\/simpleMatchSet>) --><\/tbody><\/table><\/td>/gi, '');
	content = content.replace(/<\/tr><\/tbody><\/table><\/div><!-- end of matchInteraction -->/gi, '');
	
	content = content.replace(/(<!-- (<modalFeedback [^>]*>[^<]*<\/modalFeedback>) -->)(?! -->)/gi, '');
	
	return content;
	
}
