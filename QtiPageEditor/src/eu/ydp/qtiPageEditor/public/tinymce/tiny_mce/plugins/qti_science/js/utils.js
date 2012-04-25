function lock(id) {
	var ed = tinymce.EditorManager.activeEditor;
	var zIndex = ed.windowManager.zIndex;
	
	//zIndex--;
	var elm = tinymce.DOM.create('div', {id : 'mcePopupLayer_'+id, style : 'background-color: gray;height: 100%;opacity: 0.3;position: fixed;top: 0;width: 100%;z-index:'+(zIndex-1)+';'}, '&nbsp;');
	$(elm).insertBefore(tinymce.DOM.get(id));
	//tinymce.DOM.insertAfter(elm, tinymce.DOM.get(id));
	//$(tinymce.DOM.get(id)).css("z-index", zIndex);
	return id;
}