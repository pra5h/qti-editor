tinyMCEPopup.requireLangPack();

var pagetitleDialog = {
	init : function(ed) {
		var title = tinyMCEPopup.getWindowArg("title");
		$('#pagetitle').val(ed.dom.decode(title));
		
		if ('' != title) {
			$('#insert').val(tinyMCEPopup.getLang("pagetitle_dlg.modify"));
		}
		$('.focusedPageTitle').focus();
	},

	insertPageTitle: function(form) {
		var ed = tinymce.EditorManager.activeEditor;
		var title = ed.dom.encode(form.pagetitle.value);
		ed.dom.doc.body.innerHTML = ed.dom.doc.body.innerHTML.replace(/(<assessmentItem.*title=")([^"]*)(".*>)/gi,"$1"+title+"$3");
		tinyMCEPopup.close();
		return true;
	}

};

tinyMCEPopup.onInit.add(pagetitleDialog.init, pagetitleDialog);
