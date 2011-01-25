(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('applink');

	tinymce.create('tinymce.plugins.applinkPlugin', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {
			// Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');
			ed.addCommand('mceApplink', function(ui,data) {
				
				var applink_lid = '';
				var applink_title = '';
				var applink_value = '';
				if (ed.selection.getNode().nodeName == 'APPLINK') {
					var applinkNode = ed.selection.getNode();
					applink_lid = applinkNode.getAttribute('lid');
					applink_title = applinkNode.getAttribute('title');
					applink_value = applinkNode.innerHTML;
				} else {
					applink_value = ed.selection.getContent();
				}
				
				ed.windowManager.open({
					file : url + '/applink.htm',
					width : 400,
					height : 150,
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					applink_lid : applink_lid,
					applink_title : applink_title,
					applink_value : applink_value
				});
				
			});
			
			ed.addCommand('mceApplinkRemove', function(ui, data) {
				
				var selectedNode = ed.selection.getNode();
				if(selectedNode.nodeName == 'APPLINK') {
					var applinkContent = selectedNode.innerHTML;
					selectedNode.parentNode.removeChild(selectedNode);
					tinyMCE.execCommand('mceInsertContent', false, applinkContent);
				}
				return true;
			
			});

			ed.addButton('applink', {
				title : 'Insert / modify applink',
				cmd : 'mceApplink',
				image : url + '/img/applink_add.png'
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
				longname : 'Plugin for creating and managing Applinks',
				author : '<a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('qti_applink', tinymce.plugins.applinkPlugin);
})();
