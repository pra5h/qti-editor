(function() {
	tinymce.PluginManager.requireLangPack('copyqti');

	tinymce.create('tinymce.plugins.copyQTI', {
		
		init : function(ed, url) {
			
			ed.addCommand('mceCopyQTI', function(ui, data) {
				
				var selectedNode = ui;
				
				if(selectedNode.nodeName == 'SPAN' && selectedNode.id == 'gap') {
					tinyMCE.clipboard = {type: 'gap', comment: selectedNode.previousSibling.data, content: selectedNode.innerHTML};
				} else if (selectedNode.id == 'inlineChoiceInteraction' || selectedNode.id == 'inlineChoiceAnswer' || selectedNode.parentNode.id == 'inlineChoiceAnswer') {
					tinyMCE.clipboard = {type: 'inlinechoice', comment: selectedNode.previousSibling.data, content: selectedNode.innerHTML};
				} else if ((selectedNode.nodeName == 'P' && selectedNode.id == 'choiceInteraction' && selectedNode.parentNode.id == 'choiceInteraction') || (selectedNode.nodeName == 'DIV' && selectedNode.id == 'choiceInteraction')) {
					tinyMCE.clipboard = {type: 'multiplechoice', comment: selectedNode.previousSibling.data, content: selectedNode.innerHTML};
				} else if (selectedNode.id == 'orderOption' || (selectedNode.id == 'choiceInteraction' && selectedNode.parentNode.id == 'orderInteraction')) {
					tinyMCE.clipboard = {type: 'order', comment: selectedNode.previousSibling.data, content: selectedNode.innerHTML};
				} else if (selectedNode.id != undefined && (selectedNode.id == 'matchInteraction' || selectedNode.id.match(/canvas_/))) {
					console.log(selectedNode);
					tinyMCE.clipboard = {type: 'match', comment: selectedNode.previousSibling.data, content: selectedNode.innerHTML};
				}
				
			});
			
			ed.addCommand('mcePasteQTI', function(ui, data) {
				
				var activity = '';
				
				if(tinyMCE.clipboard.type == 'gap') {
					
					var comment = tinyMCE.clipboard.comment;
					comment = comment.replace(/responseIdentifier="([^"]*)"/, 'responseIdentifier="' + newRandId() + '"');
					activity += '<!--' + comment + '-->';
					activity += '<span id="gap" class="mceNonEditable" style="border: 1px solid blue; color: blue; background-color: #f0f0f0;">' + tinyMCE.clipboard.content + '</span>&nbsp;';
					
				} else if(tinyMCE.clipboard.type == 'inlinechoice') {
					
					var comment = tinyMCE.clipboard.comment;
					comment = comment.replace(/responseIdentifier="([^"]*)"/, 'responseIdentifier="' + newRandId() + '"');
					var content = tinyMCE.clipboard.content;
					content = content.replace(/identifier="([^"]*)"/g, 'identifier="' + newRandId() + '"');
					activity += '<!--' + comment + '-->';
					activity += '<span id="inlineChoiceInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; background-color: #f0f0f0;">' + content + '</span><!-- end of inlineChoiceInteraction -->&nbsp;';
					
				} else if(tinyMCE.clipboard.type == 'multiplechoice') {
					
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
					
				}
				
				tinyMCE.execCommand('mceInsertContent', false, activity);
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
