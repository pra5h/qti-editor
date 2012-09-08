(function() {
	tinymce.PluginManager.requireLangPack('qti_clearcontent');

	tinymce.create('tinymce.plugins.clearContentPlugin', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {

			ed.addCommand('mceClearContent', function(ui, data) {
				ed.windowManager.open({
					file : url + '/template_choice.htm',
					width : 550,
					height : 355,
					inline : 1
				}, {
					plugin_url : url // Plugin absolute URL
				});
			});

			ed.addButton('clearcontent', {title : ed.getLang('clearcontent.plugin_button_desc'), cmd : 'mceClearContent'});			
		},


		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Plugin for clear tinymce content',
				author : '<a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : "1.2"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('qti_clearcontent', tinymce.plugins.clearContentPlugin);
})();
