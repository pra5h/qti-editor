(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('science');

	tinymce.create('tinymce.plugins.SciencePlugin', {

		init : function(ed, url) {

			ed.addCommand('mceScience', function(ui, data) {
				ed.windowManager.open({
					file : url + '/science.htm',
					width : 650,
					height : 386,
					inline : 1
				}, {
					plugin_url : url,
					mathXml : data,
					type: 0
				});
			});
			
			ed.addCommand('mceScienceInputFormulaInsert', function(ui, data) {

				ed.windowManager.open({
					file : url + '/science.htm',
					width : 650,
					height : 386,
					inline : 1
				}, {
					plugin_url : url,
					input : data['input'],
					offset: data['offset'],
					type: 1,
				});
				
			});
			
			ed.addCommand('mceScienceInputFormulaModify', function(ui, data) {

				ed.windowManager.open({
					file : url + '/science.htm',
					width : 650,
					height : 386,
					inline : 1
				}, {
					plugin_url : url,
					mathXml : data['xml'],
					input : data['input'],
					type: 2,
				});
				
			});

			// Register example button
			ed.addButton('science', {
				title : 'science.desc',
				cmd : 'mceScience',
				image : url + '/img/scienceButton.png'
			});
			
			

			// Add a node change handler, selects the button in the UI when a image is selected
			ed.onNodeChange.add(function(ed, cm, n) {
				//cm.setActive('example', n.nodeName == 'IMG');
			});
		},

		/**
		 * Creates control instances based in the incomming name. This method is normally not
		 * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
		 * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
		 * method can be used to create those.
		 *
		 * @param {String} n Name of the control to create.
		 * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
		 * @return {tinymce.ui.Control} New control instance or null if no control was created.
		 */
		createControl : function(n, cm) {
			return null;
		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Plugin for creating and managing math and science formula',
				author : '<a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : "1.1"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('qti_science', tinymce.plugins.SciencePlugin);
})();