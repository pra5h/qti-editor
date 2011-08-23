(function() {
	//GAPINLINECHOICE
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('gapinlinechoice');

	tinymce.create('tinymce.plugins.gapinlinechoicePlugin', {
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
			ed.addCommand('mceGapInlineChoice', function(ui, data) {
				/*
				if(data != undefined) {
					if((data.onok != undefined && data.onok != '') || (data.onwrong != undefined && data.onwrong != '')) {
						tinyMCE.feedback = new Array;
						tinyMCE.feedback[data.id] = {};
					}
					if(data.onok != undefined && data.onok != '') {
						tinyMCE.feedback[data.id].onok = data.onok;
					}
					if(data.onwrong != undefined && data.onwrong != '') {
						tinyMCE.feedback[data.id].onwrong = data.onwrong;
					}
					if(data.onok_sound != undefined && data.onok_sound != '') {
						tinyMCE.feedback[data.id].onok_sound = data.onok_sound;
					}
					if(data.onwrong_sound != undefined && data.onwrong_sound != '') {
						tinyMCE.feedback[data.id].onwrong_sound = data.onwrong_sound;
					}
				}
				*/
				ed.windowManager.open({
					file : url + '/gapinlinechoice.htm',
					width : 800, //470,
					height : 600, //330,
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					gapInlineChoiceData : data
				});
				
			});
			
			ed.addCommand('mceGapInlineChoiceRemove', function(ui, data) {
					
					var node = ed.selection.getNode();
					while(node.nodeName != 'DIV') {
						node = node.parentNode;
					}
					
					var body = node;
					while(body.nodeName != 'BODY') {
						body = body.parentNode;
					}
					
					var rg = new RegExp(/responseIdentifier="([^"]*)"/g);
					var elm = '';
					var ids = new Array();
					while (null != (elm = rg.exec(node.innerHTML))) {
						ids.push(elm[1]);
					}

					node.parentNode.removeChild(node.previousSibling);
					node.parentNode.removeChild(node.nextSibling);
					node.parentNode.removeChild(node);

					for (i in ids) {
						var rg = new RegExp('<!--[^<]*<responseDeclaration identifier="' + ids[i] + '"[^>]*>[^<]*<correctResponse>[^<]*(?:<value>[^<]*<\/value>[^<]*)*<\/correctResponse>[^<]*<\/responseDeclaration>[^-]*-->', 'gi');
						body.innerHTML = body.innerHTML.replace(rg,'');
					}
					return true;
			});
			
			ed.addCommand('mceFeedbackGap', function(ui,data) {
				alert('mceFeedbackGap');
				return true;
			});
			
			ed.addCommand('mceFeedbackGapRemove', function(ui,data) {
				alert('mceFeedbackGapRemove');
				return true;	
			});
			
			ed.addButton('insertgapinlinechoice', {title : 'Insert gapinlinechoice activity', cmd : 'mceGapInlineChoice'});

		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Plugin for creating and managing gap and inline choice activities',
				author : '<a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('qti_gapinlinechoice', tinymce.plugins.gapinlinechoicePlugin);
})();
