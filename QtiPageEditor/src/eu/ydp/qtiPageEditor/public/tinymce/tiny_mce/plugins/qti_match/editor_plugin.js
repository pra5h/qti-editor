(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('match');

	tinymce.create('tinymce.plugins.matchPlugin', {
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
			ed.addCommand('mceMatch', function(ui, data) {
				
				if(data != undefined) {
					tinyMCE.feedback = new Array;
					tinyMCE.feedback[data[1]] = {text: new Array, sound: new Array};
					if(data[10] != undefined ) {
						tinyMCE.feedback[data[1]].text = data[10];
						tinyMCE.feedback[data[1]].sound = data[11];
					} else {
						tinyMCE.feedback[data[1]].text = new Array;
						tinyMCE.feedback[data[1]].sound = new Array;
					}
				}
				
				ed.windowManager.open({
					file : url + '/match.htm',
					width : 800,
					height : 450,
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					matchdata : data
				});
				
			});
			
			ed.addCommand('mceMatchRemove', function(ui, data) {
				
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
				var rg = new RegExp('<!-- <modalFeedback[^>]*senderIdentifier="' + responseId[1] + '"[^>]*>[^<]*<\/modalFeedback> -->', 'gi');
				body.innerHTML = body.innerHTML.replace(rg,'');
				
				return true;
				
			});
			
			ed.addCommand('mceMatchFeedbacks', function(ui,data) {
				
				ed.windowManager.open({
					file : url + '/feedback.htm',
					width : 600,
					height : 400,
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					data: data
				});
				
			});
			
			ed.addButton('insertmatchsection', {title : 'Insert match activity', cmd : 'mceMatch'});
			ed.onNodeChange.add(function(ed, cm, n) {
				cm.setDisabled('insertmatchsection', true);
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
				longname : 'Plugin for creating and managing match activities',
				author : '<a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('qti_match', tinymce.plugins.matchPlugin);
})();
