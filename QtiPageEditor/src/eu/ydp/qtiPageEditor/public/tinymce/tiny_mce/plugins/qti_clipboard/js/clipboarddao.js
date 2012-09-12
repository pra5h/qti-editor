qtiClipboard = {

		copy: function(object){
			var beginCommentNode = object.previousSibling;
			var endCommentNode = object.nextSibling;
			
			if (8 == beginCommentNode.nodeType && 8 == endCommentNode.nodeType) {
				var identifier = getModuleIdentifier(beginCommentNode);
				var moduleData = replaceModuleHtml(object);
				var mappingTab = getIdsMappingArray(moduleData.module);
				var reg = null;
				for ( var key in mappingTab) {
					reg = new RegExp(key,'gi');
					moduleData.module = moduleData.module.replace(reg, mappingTab[key]);
					moduleData.responseDeclaration = moduleData.responseDeclaration.replace(reg, mappingTab[key]);
				}
				localStorage.setItem('qtiClipboard', JSON.stringify(moduleData));
			}
		},
		
		paste: function(){

			if (!this.isEmpty()) {
				var ed = tinymce.EditorManager.activeEditor;
				ed.execCommand('mceBeginUndoLevel');
				var dom = ed.dom;
				var patt = '';
				insertContentWithoutUndoLevel('<br class="_mce_marker" />');
				tinymce.each('h1,h2,h3,h4,h5,h6,p'.split(','), function(n) {

					if (patt) {
						patt += ',';
					}
					patt += n + ' ._mce_marker';
				});

				tinymce.each(dom.select(patt), function(n) {
					ed.dom.split(ed.dom.getParent(n, 'h1,h2,h3,h4,h5,h6,p'), n);
				});
				var moduleData = JSON.parse(localStorage.qtiClipboard);
				dom.setOuterHTML(dom.select('._mce_marker')[0], moduleData.module);
				
				var itemBody = null;
				itemBody = $(ed.dom.doc.body).contents().filter(function() {
						if (this.nodeType == 8 && this.nodeValue == ' <itemBody> ') {
							return this;
						}
				});
				itemBody.get(0).parentNode.insertBefore(document.createComment(moduleData.responseDeclaration),itemBody.get(0));
				this.clear();
				ed.focusAfterInsert('focus');
				ed.execCommand('mceEndUndoLevel');
			}
		},
		
		cut: function(object){
			this.copy(object);
			removeModule(object);
		},
		
		isEmpty: function() {
			return (null != localStorage['qtiClipboard']?false:true);
		},
		
		clear: function clear() {
			localStorage.removeItem('qtiClipboard');
		}
}