tinyMCEPopup.requireLangPack();
var clearContentDialog = {
	windowId : null,
	
	init : function(ed) {
		document.body.setAttribute('onUnload',"tinymce.DOM.remove('mcePopupLayer_'+clearContentDialog.windowId);");
		document.body.setAttribute('onLoad',"clearContentDialog.windowId = tinymce.EditorManager.activeEditor.QTIWindowHelper.lockUI(tinyMCEPopup.id);");
		$("img.tpl").mouseover(function(){
			$(this).parent().addClass('selected');
		});
		
		$("img.tpl").mouseout(function(){
			$(this).parent().removeClass('selected');
		});
		
		$("img.tpl").click(function(){
			var tplType = $(this).attr('id');
			ed.windowManager.confirm(ed.getLang('clearcontent_dlg.confirm_text'), function(s) {
				
				if (s) {
					var content = ed.getContent();
					var template = templateFactory.getTemplate(tplType);
					content = content.replace(/(<\/styleDeclaration>)[.\s\S]*(<itemBody>)/gi,"$1$2");
					content = content.replace(/(<itemBody>)[.\s\S]*(<\/itemBody>)/gi,"$1"+template+'$2');
					ed.execCommand('mceBeginUndoLevel');
					ed.setContent(content);
					ed.execCommand('mceEndUndoLevel');
				}
				tinyMCEPopup.close();
			});
		});
	}
};

tinyMCEPopup.onInit.add(clearContentDialog.init, clearContentDialog);
