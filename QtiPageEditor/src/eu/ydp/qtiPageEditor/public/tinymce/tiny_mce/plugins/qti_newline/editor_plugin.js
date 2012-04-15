(function() {

	tinymce.create('tinymce.plugins.newLinePlugin', {
		
		init : function(ed, url) {
			ed.addCommand('mceAddNewLineBefore', function(ui, data) {
				var n = ed.dom.getParent(ed.selection.getStart());
				var node = null;

				while (n.parentNode != null) {
					n = n.parentNode;
					if (ed.dom.hasClass(n, "mceNonEditable")) {
						node = n;
					}
				}
				node.parentNode.insertBefore(ed.dom.create('p',null,'&nbsp;'),node);
			});
			
			ed.addCommand('mceAddNewLineAfter', function(ui, data) {
				var n = ed.dom.getParent(ed.selection.getStart());
				var node = null;

				while (n.parentNode != null) {
					n = n.parentNode;
					if (ed.dom.hasClass(n, "mceNonEditable")) {
						node = n;
					}
				}
				ed.dom.insertAfter(ed.dom.create('p',null,'&nbsp;'),node);
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
