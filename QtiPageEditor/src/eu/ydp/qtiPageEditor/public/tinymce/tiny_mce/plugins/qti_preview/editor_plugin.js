/**
 * $Id: editor_plugin_src.js 1056 2009-03-13 12:47:03Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright � 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	tinymce.create('tinymce.plugins.Preview', {
		init : function(ed, url) {

			ed.addCommand('mcePreview', function() {
				
				tinyMCE.gwtProxy.showPreview();
				
			});

			ed.addButton('preview', {title : 'preview.preview_desc', cmd : 'mcePreview'});
		},

		getInfo : function() {
			return {
				longname : 'Preview with QTI Player',
				author : '<a target="_blank" href="http://tinymce.moxiecode.com">Moxiecode Systems AB</a> / <a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('qti_preview', tinymce.plugins.Preview);
})();