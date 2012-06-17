(function() {

	tinymce.create('tinymce.plugins.newLinePlugin', {
		
		init : function(ed, url) {
			ed.addCommand('mceAddNewLineBefore', function(ui, data) {
				var n = ed.dom.getParent(ed.selection.getStart());
				var node = null;

				while (n.parentNode != null) {

					if (ed.dom.hasClass(n, "mceNonEditable")) {
						node = n;
					}
					n = n.parentNode;
				}

				/*W ćwiczeniach cały moduł rozpoczyna się węzłem typu komentarz
				 * a dopiero później jest <div> "opakowujący" moduł stąd nowa linię trzeba postawić przed
				 * węzłem typu #comment. Wyjątkiem są moduły mediowe gdzie #comment nie występuje
				 */
				if (null != node.previousSibling && 8 == node.previousSibling.nodeType) {
					node = node.previousSibling;
				}

				var newNode = ed.dom.create('p',null,'&nbsp;');
				node.parentNode.insertBefore(newNode,node);
				ed.selection.select(newNode, true);
				ed.selection.collapse(false);
				ed.focus();
			});
			
			ed.addCommand('mceAddNewLineAfter', function(ui, data) {
				var n = ed.dom.getParent(ed.selection.getStart());
				var node = null;

				while (n.parentNode != null) {

					if (ed.dom.hasClass(n, "mceNonEditable")) {
						node = n;
					}
					n = n.parentNode;
				}

				/*W ćwiczeniach cały moduł rozpoczyna się węzłem typu komentarz
				 * a dopiero później jest <div> "opakowujący". Podobnie jak wyżej najpierw następuje zamknięcie diva
				 * a dopiero później #comment, który kończy blok modułu stąd nowa linię trzeba postawić za
				 * węzłem typu #comment. Wyjątkiem są moduły mediowe gdzie #comment nie występuje
				 */
				if (null != node.nextSibling && 8 == node.nextSibling.nodeType) {
					node = node.nextSibling;
				}

				var newNode = ed.dom.create('p',null,'&nbsp;');
				ed.dom.insertAfter(newNode,node);
				ed.selection.select(newNode, true);
				ed.selection.collapse(false);
				ed.focus();
			});
			
			ed.addButton('newLineBefore', {title : 'Add new line before', cmd : 'mceAddNewLineBefore', image : url + '/img/beforeButton.png'});
			ed.addButton('newLineAfter', {title : 'Add new line after', cmd : 'mceAddNewLineAfter', image : url + '/img/afterButton.png'});	
		},

		getInfo : function() {
			return {
				longname : 'Plugin for inserting new line before and after no editing object',
				author : '<a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : "1.0"
			};
		}
	});

	tinymce.PluginManager.add('qti_newline', tinymce.plugins.newLinePlugin);
})();
