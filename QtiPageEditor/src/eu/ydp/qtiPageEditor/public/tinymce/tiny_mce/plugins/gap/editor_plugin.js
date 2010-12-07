(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('gap');

	tinymce.create('tinymce.plugins.gapPlugin', {
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
			ed.addCommand('mceGap', function(ui, data) {
				
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
				
				ed.windowManager.open({
					file : url + '/gap.htm',
					width : 400,
					height : 130,
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					gapdata : data
				});
				
			});
			
			ed.addCommand('mceGapRemove', function(ui, data) {
				
				var selectedNode = tinyMCE.selectedNode;
				
				if(selectedNode.nodeName == 'SPAN' && selectedNode.id == 'gap') {
					var gapComment = selectedNode.previousSibling;
					var gapId = /<textEntryInteraction[^>]*responseIdentifier="([^"]*)"[^>]*>/i.exec(gapComment.data);
					gapId = gapId[1];
					var rg_fdb = new RegExp('<!-- <modalFeedback[^>]*outcomeIdentifier="' + gapId + '"[^>]*>[^<]*<\/modalFeedback> -->','gi');
					var rg_rdec = new RegExp('<!--[^<]*<responseDeclaration identifier="' + gapId + '"[^>]*>[^<]*<correctResponse>[^<]*(?:<value>[^<]*<\/value>[^<]*)*<\/correctResponse>[^<]*<\/responseDeclaration>[^-]*-->', 'gi');
					
					var gapContent = selectedNode.innerHTML;
					selectedNode.parentNode.removeChild(selectedNode.previousSibling);
					selectedNode.parentNode.removeChild(selectedNode);
					tinyMCE.execCommand('mceInsertContent', false, gapContent);
					tinyMCE.activeEditor.selection.dom.doc.body.innerHTML = tinyMCE.activeEditor.selection.dom.doc.body.innerHTML.replace(rg_fdb,'');
					tinyMCE.activeEditor.selection.dom.doc.body.innerHTML = tinyMCE.activeEditor.selection.dom.doc.body.innerHTML.replace(rg_rdec,'');
				}
				return true;
			
			});
			
			ed.addCommand('mceFeedbackGap', function(ui,data) {
				
				ed.windowManager.open({
					file : url + '/feedback.htm',
					width : 400,
					height : 130,
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					data: {identifier: data.identifier, feedback: data.feedback}
				});
				
			});
			
			ed.addCommand('mceFeedbackGapRemove', function(ui,data) {
				
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
			
			ed.addCommand('mceShowPreviousVersion', function(ui,data) {

				var rg = new RegExp('<!-- <responseDeclaration identifier="' + data.archIdentifier + '"[^>]*>[^<]*<correctResponse>[^<]*(?:<value>([^<]*)<\/value>)*[^<]*<\/correctResponse>[^<]*<\/responseDeclaration> -->','gi');
				var archResponseDeclaration = rg.exec(ed.selection.dom.doc.body.innerHTML);

				if(archResponseDeclaration) {

					var archAnswer = archResponseDeclaration[1];

					ed.windowManager.open({
						file : url + '/previous.htm',
						width : 400,
						height : 130,
						inline : 1
					}, {
						plugin_url : url, // Plugin absolute URL
						data: {archIdentifier: data.archIdentifier, answer: archResponseDeclaration[1]}
					});

				} else {

					ed.windowManager.alert('No previous version of this activity');

				}

			});
			
			ed.addButton('insertgap', {title : 'Insert gap activity', cmd : 'mceGap'});

		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Plugin for creating and managing gap activities',
				author : '<a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('gap', tinymce.plugins.gapPlugin);
})();
