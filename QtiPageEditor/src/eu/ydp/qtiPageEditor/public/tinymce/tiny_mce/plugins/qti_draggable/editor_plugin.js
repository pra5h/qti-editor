(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('draggable');

	tinymce.create('tinymce.plugins.draggablePlugin', {
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
			ed.addCommand('mceDraggable', function(ui, data) {

				if(data != undefined) {
					tinyMCE.feedback = new Array;
					tinyMCE.feedback[data.identifier] = {text: new Array, sound: new Array}
					if(data.fdb != undefined ) {
						tinyMCE.feedback[data.identifier].text = data.fdb;
					}
					if(data.fd != undefined ) {
						tinyMCE.feedback[data.identifier].sound = data.fd;
					}
				}
				
				ed.windowManager.open({
					file : url + '/draggable.htm',
					width : 500,
					height : 450,
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					draggabledata : data
				});
				
			});
			
			ed.addCommand('mceDraggableRemove', function(ui, data) {
				
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
			
			ed.addCommand('mceFeedbackDraggable', function(ui,data) {
				
				ed.windowManager.open({
					file : url + '/feedback.htm',
					width : 400,
					height : 100,
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					data: {exerciseid: data.exerciseid, identifier: data.identifier, feedback: data.feedback, feedback_sound: data.feedback_sound}
				});
				
			});
			
			ed.addCommand('mceFeedbackDraggableRemove', function(ui,data) {
				
				var form = data;
				while(form.nodeName != 'FORM') {
					form = form.parentNode;
				}
				if(tinyMCE.feedback != undefined) {
					var tempArr = new Array;
					for(i in tinyMCE.feedback) {
						if(i != form.identifier.value) {
							tempArr[i] = tinyMCE.feedback[i];
						}
					}
					tinyMCE.feedback = tempArr;
				}
				
			});

			ed.addButton('insertdraggablesection', {title : 'Insert drag&drop activity', cmd : 'mceDraggable'});
			
		},


		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Plugin for creating and managing drag&drop activities',
				author : '<a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('qti_draggable', tinymce.plugins.draggablePlugin);
})();
