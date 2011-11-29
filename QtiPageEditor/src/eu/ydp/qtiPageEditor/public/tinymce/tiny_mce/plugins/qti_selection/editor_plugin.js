(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('selection');

	tinymce.create('tinymce.plugins.selectionPlugin', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {
			
			ed.onNodeChange.add(function(ed, cm, node) {

				var dom = ed.dom;

				tinymce.each(dom.select('table.selectionTable', node), function(n) {
					dom.removeClass(n, 'mceItemTable');
					ed.isNotDirty = true;
				});
			});
			
			// Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');
			ed.addCommand('mceSelection', function(ui, data) {

				/*
				if(data != undefined) {
					tinyMCE.feedback = new Array();
					tinyMCE.feedback[data.identifier] = {text: new Array(), sound: new Array()}

					if(data.fdb != undefined ) {
						tinyMCE.feedback[data.identifier].text = data.fdb;
					}
					
					if(data.fd != undefined ) {
						tinyMCE.feedback[data.identifier].sound = data.fd;
					}
				}
				*/
				ed.windowManager.open({
					file : url + '/selection.htm',
					width : 550,
					height : 430,
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					selectiondata : data
				});
				
			});
			
			ed.addCommand('mceSelectionRemove', function(ui, data) {
				
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
			
			ed.addCommand('mceFeedbackSelection', function(ui,data) {
				
				ed.windowManager.open({
					file : url + '/feedback.htm',
					width : 400,
					height : 120,
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					data: {exerciseid: data.exerciseid, identifier: data.identifier, feedback: data.feedback, feedback_sound: data.feedback_sound}
				});
				
			});
			
			ed.addCommand('mceFeedbackSelectionRemove', function(ui,data) {
				var form = data;
				while(form.nodeName != 'FORM') {
					form = form.parentNode;
				}
				
				if(tinyMCE.feedback != undefined) {
					if(tinyMCE.feedback[form.exerciseid.value] != undefined) {

						for(i in tinyMCE.feedback[form.exerciseid.value].text) {

							if(i == form.identifier.value) {
								delete tinyMCE.feedback[form.exerciseid.value].text[i];
							}
						}

						for(i in tinyMCE.feedback[form.exerciseid.value].sound) {

							if(i == form.identifier.value) {
								delete tinyMCE.feedback[form.exerciseid.value].sound[i];
							}
						}
					}
				}
				
			});

			ed.addButton('insertselectionsection', {title : 'Insert selection activity', cmd : 'mceSelection'});
			ed.onNodeChange.add(function(ed, cm, n) {

				if ('BODY' == ed.selection.getNode().nodeName) {
					cm.setDisabled('insertselectionsection', true);
				} else {
					cm.setDisabled('insertselectionsection', false);
				}
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
				longname : 'Plugin for creating and managing selection activities',
				author : '<a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : "1.2"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('qti_selection', tinymce.plugins.selectionPlugin);
})();
