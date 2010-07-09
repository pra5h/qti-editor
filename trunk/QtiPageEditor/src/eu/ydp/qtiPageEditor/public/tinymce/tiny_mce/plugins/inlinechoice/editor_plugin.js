(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('inlinechoice');

	tinymce.create('tinymce.plugins.inlineChoicePlugin', {
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
			ed.addCommand('mceInlineChoice', function(ui, data) {
				
				if(data != undefined) {
					tinyMCE.feedback = new Array;
					tinyMCE.feedback[data[4]] = {text: new Array, sound: new Array}
					if(data[7] != undefined ) {
						tinyMCE.feedback[data[4]].text = data[7];
					}
					if(data[8] != undefined ) {
						tinyMCE.feedback[data[4]].sound = data[8];
					}
				}
				
				ed.windowManager.open({
					file : url + '/inlinechoice.htm',
					width : 500,
					height : 350,
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					choicedata : data
				});
			});
			
			ed.addCommand('mceInlineChoiceRemove', function(ui, data) {
				
				var node = ed.selection.getNode();
				while(node.id != 'inlineChoiceInteraction') {
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
			
			ed.addCommand('mceFeedbackInlinechoice', function(ui,data) {
				
				ed.windowManager.open({
					file : url + '/feedback.htm',
					width : 400,
					height : 100,
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					data: {identifier: data.identifier, feedback: data.feedback, feedback_sound: data.feedback_sound, exerciseid: data.exerciseid}
				});
				
			});
			
			ed.addCommand('mceFeedbackInlinechoiceRemove', function(ui,data) {
				
				var form = data;
				while(form.nodeName != 'FORM') {
					form = form.parentNode;
				}
				
				if(tinyMCE.feedback != undefined) {
					if(tinyMCE.feedback[form.exerciseid.value] != undefined) {
						var arr = new Array;
						for(i in tinyMCE.feedback[form.exerciseid.value]) {
							if(i != form.identifier.value) {
								arr[i] = tinyMCE.feedback[form.exerciseid.value][i];
							}
						}
						tinyMCE.feedback[form.exerciseid.value] = arr;
					}
				}
				
			});
			
			ed.addButton('insertinlinechoice', {title : 'Insert inline choice activity', cmd : 'mceInlineChoice'});
			
		},


		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Plugin for creating and managing QTI',
				author : 'Olaf Galazka',
				authorurl : '',
				infourl : '',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('inlinechoice', tinymce.plugins.inlineChoicePlugin);
})();