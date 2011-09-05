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

				if(data != undefined) {

					for (i in data.inlineRows) {
						var row = data.inlineRows[i];
						if ('gap' == row.type) {
							
							if(row.feedback != undefined) {
								var feedback = row.feedback;

								if((feedback.onOk != undefined && feedback.onOk != '') || (feedback.onWrong != undefined && feedback.onWrong != '')) {
									tinyMCE.feedback = new Array;
									tinyMCE.feedback[row.identifier] = {};
								}
								if(feedback.onOk != undefined && feedback.onOk != '') {
									tinyMCE.feedback[row.identifier].onOk = feedback.onOk;
								}
								if(feedback.onWrong != undefined && feedback.onWrong != '') {
									tinyMCE.feedback[row.identifier].onWrong = feedback.onWrong;
								}
								/*if(data.onok_sound != undefined && data.onok_sound != '') {
						tinyMCE.feedback[data.id].onok_sound = data.onok_sound;
						}

						if(data.onwrong_sound != undefined && data.onwrong_sound != '') {
							tinyMCE.feedback[data.id].onwrong_sound = data.onwrong_sound;
						}
								 */
							}
						}
					}
				}

				ed.windowManager.open({
					file : url + '/gapinlinechoice.htm',
					width : 470,
					height : 330,
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					gapInlineChoiceData : data
				});
				
			});
			
			ed.addCommand('mceGapInlineChoiceRemove', function(ui, data) {
				var node = null;
				
				if ("object" == typeof data) {
					node = tinyMCE.selectedNode; 
				} else {
					node = ed.selection.getNode();
				}
				
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
				ed.windowManager.open({
					file : url + '/gapfeedback.htm',
					width : 400,
					height : 100,
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					data: {identifier: data.identifier, feedback: data.feedback, type: 'gap'}
				});
			});

			ed.addCommand('mceFeedbackInlinechoice', function(ui,data) {

				ed.windowManager.open({
					file : url + '/inlinechoicefeedback.htm',
					width : 400,
					height : 100,
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					data: {identifier: data.identifier, feedback: data.feedback, feedback_sound: data.feedback_sound, exerciseid: data.exerciseid, type: 'inlineChoice'}
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
			
			ed.addCommand('mceFeedbackInlineChoiceRemove', function(ui,data) {

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
