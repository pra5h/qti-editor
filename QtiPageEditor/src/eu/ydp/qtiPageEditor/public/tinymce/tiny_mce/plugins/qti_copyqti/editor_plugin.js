(function() {
	tinymce.PluginManager.requireLangPack('copyqti');

	tinymce.create('tinymce.plugins.copyQTI', {
		
		init : function(ed, url) {
			
			ed.addCommand('mceCopyQTI', function(ui, data) {
				
				var selectedNode = ui;
				
				if(selectedNode.nodeName == 'DIV' && selectedNode.id == 'gapInlineChoiceInteraction') {
					tinyMCE.clipboard = {type: 'gapInlineChoiceInteraction', comment: selectedNode.previousSibling.data, content: selectedNode.innerHTML};
				} else if ((selectedNode.nodeName == 'P' && selectedNode.id == 'choiceInteraction' && selectedNode.parentNode.id == 'choiceInteraction') || (selectedNode.nodeName == 'DIV' && selectedNode.id == 'choiceInteraction')) {
					tinyMCE.clipboard = {type: 'multiplechoice', comment: selectedNode.previousSibling.data, content: selectedNode.innerHTML};
				} else if (selectedNode.id == 'orderOption' || (selectedNode.id == 'choiceInteraction' && selectedNode.parentNode.id == 'orderInteraction')) {
					tinyMCE.clipboard = {type: 'order', comment: selectedNode.previousSibling.data, content: selectedNode.innerHTML};
				} else if (selectedNode.id != undefined && (selectedNode.id == 'matchInteraction' || selectedNode.id.match(/canvas_/))) {
					tinyMCE.clipboard = {type: 'match', comment: selectedNode.previousSibling.data, content: selectedNode.innerHTML};
				} else if ((selectedNode.nodeName == 'DIV' && selectedNode.id == 'selectionInteraction') || (selectedNode.nodeName == 'P' && selectedNode.id == 'choiceInteraction' && selectedNode.parentNode.id == 'selectionInteraction')  || (selectedNode.nodeName == 'INPUT' && selectedNode.id == 'selectionInteraction' && selectedNode.parentNode.id == 'selectionInteraction')) {
					tinyMCE.clipboard = {type: 'selection', comment: selectedNode.previousSibling.data, content: selectedNode.innerHTML};
				} else if ((selectedNode.nodeName == 'DIV' && selectedNode.id == 'dragDropInteraction') || (selectedNode.nodeName == 'P' && selectedNode.id == 'dragDropInteraction' && selectedNode.parentNode.id == 'dragDropInteraction')  || (selectedNode.nodeName == 'INPUT' && selectedNode.id == 'dragDropInteraction' && selectedNode.parentNode.id == 'selectionInteraction')) {
					tinyMCE.clipboard = {type: 'draggable', comment: selectedNode.previousSibling.data, content: selectedNode.innerHTML};
				} else if ((selectedNode.nodeName == 'DIV' && selectedNode.id == 'identificationInteraction') || (selectedNode.nodeName == 'P' && selectedNode.id == 'identificationInteraction' && selectedNode.parentNode.id == 'identificationInteraction')  || (selectedNode.nodeName == 'INPUT' && selectedNode.id == 'identificationInteraction' && selectedNode.parentNode.id == 'identificationInteraction')) {
					tinyMCE.clipboard = {type: 'identification', comment: selectedNode.previousSibling.data, content: selectedNode.innerHTML};
				}
				
			});
			
			ed.addCommand('mcePasteQTI', function(ui, data) {
				
				var activity = '';
				var correctResp = '';

				if(tinyMCE.clipboard.type == 'multiplechoice') {
					
					var comment = tinyMCE.clipboard.comment;
					comment = comment.replace(/responseIdentifier="([^"]*)"/, 'responseIdentifier="' + newRandId() + '"');
					var content = tinyMCE.clipboard.content;
					content = content.replace(/identifier="([^"]*)"/g, 'identifier="' + newRandId() + '"');
					activity += '<p>&nbsp;</p><!--' + comment + '-->';
					activity += '<div id="choiceInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">' + content + '</div><!-- end of choiceInteraction --><p>&nbsp;</p>';
					
				} else if(tinyMCE.clipboard.type == 'order') {
					
					var comment = tinyMCE.clipboard.comment;
					comment = comment.replace(/responseIdentifier="([^"]*)"/, 'responseIdentifier="' + newRandId() + '"');
					var content = tinyMCE.clipboard.content;
					content = content.replace(/identifier="([^"]*)"/g, 'identifier="' + newRandId() + '"');
					activity += '<p>&nbsp;</p><!--' + comment + '-->';
					activity += '<div id="orderInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">' + content + '</div><!-- end of orderInteraction --><p>&nbsp;</p>';
					
				} else if(tinyMCE.clipboard.type == 'match') {
					
					var comment = tinyMCE.clipboard.comment;
					comment = comment.replace(/responseIdentifier="([^"]*)"/, 'responseIdentifier="' + newRandId() + '"');
					var content = tinyMCE.clipboard.content;
					content = content.replace(/identifier="([^"]*)"/g, 'identifier="' + newRandId() + '"');
					activity += '<p>&nbsp;</p><!--' + comment + '-->';
					activity += '<div id="matchInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">' + content + '</div><!-- end of matchInteraction --><p>&nbsp;</p>';
					
				} else if(tinyMCE.clipboard.type == 'selection') {

					var comment = tinyMCE.clipboard.comment;
					comment = comment.replace(/responseIdentifier="([^"]*)"/, 'responseIdentifier="' + newRandId() + '"');
					var content = tinyMCE.clipboard.content;
					content = content.replace(/identifier="([^"]*)"/g, 'identifier="' + newRandId() + '"');
					activity += '<p>&nbsp;</p><!--' + comment + '-->';
					activity += '<div id="selectionInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">' + content + '</div><!-- end of selectionInteraction --><p>&nbsp;</p>';

				} else if(tinyMCE.clipboard.type == 'draggable') {

					var comment = tinyMCE.clipboard.comment;
					comment = comment.replace(/responseIdentifier="([^"]*)"/, 'responseIdentifier="' + newRandId() + '"');
					var content = tinyMCE.clipboard.content;
					content = content.replace(/identifier="([^"]*)"/g, 'identifier="' + newRandId() + '"');
					activity += '<p>&nbsp;</p><!--' + comment + '-->';
					activity += '<div id="dragDropInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">' + content + '</div><!-- end of dragDropInteraction --><p>&nbsp;</p>';

				} else if(tinyMCE.clipboard.type == 'identification') {

					var comment = tinyMCE.clipboard.comment;
					comment = comment.replace(/responseIdentifier="([^"]*)"/, 'responseIdentifier="' + newRandId() + '"');
					var content = tinyMCE.clipboard.content;
					content = content.replace(/identifier="([^"]*)"/g, 'identifier="' + newRandId() + '"');
					activity += '<p>&nbsp;</p><!--' + comment + '-->';
					activity += '<div id="identificationInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">' + content + '</div><!-- end of identificationInteraction --><p>&nbsp;</p>';

				} else if(tinyMCE.clipboard.type == 'gapInlineChoiceInteraction') {

					var comment = tinyMCE.clipboard.comment;
					var content = tinyMCE.clipboard.content;
					var rg = new RegExp(/<([a-zA-Z]+) responseIdentifier="([^"]*)"/g);
					var inlElmAns = '';
					var randId = null;
					var tmpContent = content;
									
					var replacedIdentifier = new Array();
					
					while(null != (inlElmAns = rg.exec(tmpContent))) {
						randId = newRandId();
						var correctAnswerRgx = new RegExp('<!-- <responseDeclaration identifier="' + inlElmAns[2] + '"[^>]*>[^<]*<correctResponse>[^<]*<value>([^<]*)?<\/value>[^<]*<\/correctResponse>[^<]*<\/responseDeclaration> -->','gi');
						var correctAnswerRgxRes = correctAnswerRgx.exec(ed.dom.doc.body.innerHTML); 
						var oldCorrectResp = correctAnswerRgxRes[0];
						
						if ('textEntryInteraction' == inlElmAns[1]) {
							oldCorrectResp = oldCorrectResp.replace(/identifier="([^"]*)"/gi, 'identifier="' + randId + '"');
							correctResp += oldCorrectResp; 
						}
						
						if ('inlineChoiceInteraction' == inlElmAns[1]) {
							var inlineChoiceNewId = newRandId();
							oldCorrectResp = oldCorrectResp.replace(/identifier="([^"]*)"/gi, 'identifier="' + randId + '"');
							oldCorrectResp = oldCorrectResp.replace(/<value>([^<]*)<\/value>/gi, '<value>' + inlineChoiceNewId + '<\/value>');
							content = content.replace('identifier="'+correctAnswerRgxRes[1]+'"', 'identifier="' + inlineChoiceNewId + '"');
							replacedIdentifier.push(inlineChoiceNewId); //zapamiętuje jakie identifiery już zamieniłem
							correctResp += oldCorrectResp;
						}
						content = content.replace('responseIdentifier="'+inlElmAns[2]+'"', 'responseIdentifier="' + randId + '"');
						content = content.replace('id="'+inlElmAns[2]+'"', 'id="' + randId + '"');
					}

					var inlChElmRgx = new RegExp('<!-- (<inlineChoice identifier="([^"]+)")','gi');
					var inlChElmRgxRes = '';
					tmpContent = content;
					while (null != (inlChElmRgxRes = inlChElmRgx.exec(tmpContent))) {
						
						if (replacedIdentifier.indexOf(inlChElmRgxRes[2]) === -1) {
							randId = newRandId();
							content = content.replace(inlChElmRgxRes[2], randId);
						}
					}
					activity += '<p>&nbsp;</p><!--' + comment + '-->';
					activity += '<div id="gapInlineChoiceInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue;padding: 5px; background-color: rgb(240, 240, 240);">' + content + '</div><!-- end of </gapInlineChoiceInteraction> --><p>&nbsp;</p>';

				}
				
				tinyMCE.execCommand('mceInsertContent', false, activity);
				
				if ('' != correctResp) {
					var regexp = new RegExp('(<!-- <itemBody> -->)','gi');
					ed.dom.doc.body.innerHTML = ed.dom.doc.body.innerHTML.replace(regexp, correctResp + '$1');
				}
				delete(tinyMCE.clipboard);
				
			});
		
		},
		
		getInfo : function() {
			return {
				longname : 'Plugin for making copies of QTI activities',
				author : '<a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : "1.0"
			};
		}
	});
	
	tinymce.PluginManager.add('qti_copyqti', tinymce.plugins.copyQTI);
})();

function newRandId() {
			
	var randid = Math.random();
	randid = String(randid);
	var rg = new RegExp('0.([0-9]*)',"gi");
	exec = rg.exec(randid);
	return 'id_' + exec[1];
					
}
