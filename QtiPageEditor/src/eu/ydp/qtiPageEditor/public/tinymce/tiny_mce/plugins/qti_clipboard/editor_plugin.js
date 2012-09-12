(function() {
	tinymce.PluginManager.requireLangPack('qti_clipboard');

	tinymce.create('tinymce.plugins.clipboardPlugin', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {
			tinymce.ScriptLoader.load(url+'/js/clipboarddao.js');
			tinymce.ScriptLoader.load(url+'/js/utils.js');
			ed.qtiClipboard = qtiClipboard;
			
			ed.addCommand('mceCopyQTI', function(ui, data) {
				
				var selectedNode = ui;
				ed.qtiClipboard.copy(selectedNode);
			});
			
			ed.addCommand('mcePasteQTI', function(ui, data) {
				
				var selectedNode = ui;
				ed.qtiClipboard.paste();
			});
			
			ed.addCommand('mceCutQTI', function(ui, data) {
				
				var selectedNode = ui;
				ed.qtiClipboard.cut(selectedNode);
			});
		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Plugin for qti clipboard',
				author : '<a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : "1.2"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('qti_clipboard', tinymce.plugins.clipboardPlugin);
})();
