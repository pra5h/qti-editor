(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('empiriapreview');
	
	tinymce.create('tinymce.plugins.empiriapreviewPlugin', {
		init : function(ed, url) {

			ed.addCommand('mceEmpiriaPreview', function() {
				ed.windowManager.open({
					file : url + '/preview.htm',
					width : 500,
					height : 250,
					inline : 1
				}, {
					plugin_url : url // Plugin absolute URL
				});
			});

			ed.addButton('empiriapreview', {title : 'Quick preview with Empiria', cmd : 'mceEmpiriaPreview'});
		},

		getInfo : function() {
			return {
				longname : 'Preview with Empiria Player',
				author : '<a target="_blank" href="http://tinymce.moxiecode.com">Moxiecode Systems AB</a> / <a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('qti_empiriapreview', tinymce.plugins.empiriapreviewPlugin);
})();