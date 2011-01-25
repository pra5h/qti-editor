(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('order');

	tinymce.create('tinymce.plugins.orderPlugin', {
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
			ed.addCommand('mceOrder', function(ui, data) {
				
				ed.windowManager.open({
					file : url + '/order.htm',
					width : 500,
					height : 450,
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					orderdata : data
				});
				
			});
			
			ed.addCommand('mceOrderRemove', function(ui, data) {
				
				var node = ed.selection.getNode();
				while(node.nodeName != 'DIV') {
					node = node.parentNode;
				}
				
				var body = node;
				while(body.nodeName != 'BODY') {
					body = body.parentNode;
				}
				
				var responseId = node.previousSibling.data.match(/responseIdentifier="([^"]*)"/);
				node.parentNode.removeChild(node.previousSibling);
				node.parentNode.removeChild(node.nextSibling);
				node.parentNode.removeChild(node);
				
				var rg = new RegExp('<!--[^<]*<responseDeclaration identifier="' + responseId[1] + '"[^>]*>[^<]*<correctResponse>[^<]*(?:<value>[^<]*<\/value>[^<]*)*<\/correctResponse>[^<]*<\/responseDeclaration>[^-]*-->', 'gi');
				body.innerHTML = body.innerHTML.replace(rg,'');
				
				return true;
				
			});

			ed.addButton('insertordersection', {title : 'Insert order activity', cmd : 'mceOrder'});
			
		},


		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Plugin for creating and managing order activities',
				author : '<a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('qti_order', tinymce.plugins.orderPlugin);
})();
