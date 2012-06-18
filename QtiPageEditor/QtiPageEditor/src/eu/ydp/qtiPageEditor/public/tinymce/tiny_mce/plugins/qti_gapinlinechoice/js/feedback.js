tinyMCEPopup.requireLangPack();

var feedbackDialog = {
		windowId : null,
		
		init : function(ed) {
			document.body.setAttribute('onUnload',"tinymce.DOM.remove('mcePopupLayer_'+feedbackDialog.windowId);delete tinymce.EditorManager.activeEditor.windowManager.isFeedbackOpened;");
			document.body.setAttribute('onLoad',"feedbackDialog.windowId = lock(tinyMCEPopup.id);");
			var data = tinyMCEPopup.getWindowArg("data");

			if ('gap' == data.type) {
				document.getElementById('identifier').setAttribute('value',data.identifier);
				if(data.feedback != undefined && data.feedback != '') {
					$('#feedback_onok').attr('value',data.feedback.onOk);
					$('#feedback_onwrong').attr('value',data.feedback.onWrong);
					document.getElementById('fdb_sound_onok').setAttribute('value',data.feedback.onok_sound);
					document.getElementById('fdb_sound_onwrong').setAttribute('value',data.feedback.onwrong_sound);
				} else if(tinyMCE.feedback != undefined && tinyMCE.feedback[data.identifier] != undefined) {
					document.getElementById('feedback_onok').setAttribute('value',stringDecode(tinyMCE.feedback[data.identifier].onOk));
					document.getElementById('feedback_onwrong').setAttribute('value',stringDecode(tinyMCE.feedback[data.identifier].onWrong));
					document.getElementById('fdb_sound_onok').setAttribute('value',tinyMCE.feedback[data.identifier].onok_sound);
					document.getElementById('fdb_sound_onwrong').setAttribute('value',tinyMCE.feedback[data.identifier].onwrong_sound);
				}
				tagInsert.init("feedback_onok");
				InputHelper.init($("#feedback_onok"));
				tagInsert.init("feedback_onwrong");
				InputHelper.init($("#feedback_onwrong"));
				$('#feedback_onok').focus();
			} 

			if ('inlineChoice' == data.type) {
				var data = tinyMCEPopup.getWindowArg("data");
				document.getElementById('identifier').setAttribute('value',data.identifier);
				document.getElementById('exerciseid').setAttribute('value',data.exerciseid);
				if(data.feedback != undefined && data.feedback != '') {
					document.getElementById('feedback').setAttribute('value',stringDecode(data.feedback));
					document.getElementById('fdb_sound').setAttribute('value',data.feedback_sound);
				} else if(tinyMCE.feedback != undefined && tinyMCE.feedback[data.identifier] != undefined) {
					document.getElementById('feedback').setAttribute('value',stringDecode(tinyMCE.feedback[data.exerciseid].text[data.identifier]));
					document.getElementById('fdb_sound').setAttribute('value',tinyMCE.feedback[data.exerciseid].sound[data.identifier]);
				}
				tagInsert.init("feedback");
				InputHelper.init($("#feedback"));
				$('#feedback').focus();
			}

		},

		prepareGapFeedback : function(form) {

			var ed = tinymce.EditorManager.activeEditor;
			var formElements = form.elements;
			var identifier = '';
			var feedback_onok = '';
			var feedback_onwrong = '';
			var fdb_sound_onok = '';
			var fdb_sound_onwrong = '';

			if(tinyMCE.feedback == undefined) {
				tinyMCE.feedback = new Array;
			}

			for(i in formElements) {
				if(formElements[i].attributes != undefined) {
					if(formElements[i].getAttribute('name') == 'identifier') {
						identifier = formElements[i].getAttribute('value');
					}
					if(formElements[i].getAttribute('name') == 'feedback_onok') {
						feedback_onok = formElements[i].value;
					}
					if(formElements[i].getAttribute('name') == 'fdb_sound_onok') {
						fdb_sound_onok = formElements[i].value;
					}
					if(formElements[i].getAttribute('name') == 'feedback_onwrong') {
						feedback_onwrong = formElements[i].value;
					}
					if(formElements[i].getAttribute('name') == 'fdb_sound_onwrong') {
						fdb_sound_onwrong = formElements[i].value;
					}
				}
			}
			
			if (!ed.validateHtml(feedback_onok, 'feedback')) {
				return false;
			}
			
			if (!ed.validateHtml(feedback_onwrong, 'feedback')) {
				return false;
			}
			tinyMCE.feedback[identifier] = {};
			tinyMCE.feedback[identifier].onOk = stringEncode(feedback_onok);
			tinyMCE.feedback[identifier].sound_onOk = fdb_sound_onok;
			tinyMCE.feedback[identifier].onWrong = stringEncode(feedback_onwrong);
			tinyMCE.feedback[identifier].sound_onWrong = fdb_sound_onwrong;

			tinyMCEPopup.close();
			return true;

		},

		prepareInlineChoiceFeedback : function(form) {

			var ed = tinymce.EditorManager.activeEditor;
			var formElements = form.elements;
			var identifier = '';
			var exerciseid = '';
			var feedback = '';
			var feedback_sound = '';
			if(tinyMCE.feedback == undefined) {
				tinyMCE.feedback = new Array;
			}
			for(i in formElements) {
				if(formElements[i].attributes != undefined) {
					if(formElements[i].getAttribute('name') == 'identifier') {
						identifier = formElements[i].getAttribute('value');
					}
					if(formElements[i].getAttribute('name') == 'exerciseid') {
						exerciseid = formElements[i].value;
					}
					if(formElements[i].getAttribute('name') == 'feedback') {
						feedback = formElements[i].value;
					}
					if(formElements[i].getAttribute('name') == 'fdb_sound') {
						feedback_sound = formElements[i].value;
					}
				}
			}
			
			if (!ed.validateHtml(feedback, 'feedback')) {
				return false;
			}

			if(tinyMCE.feedback[exerciseid] == undefined) {
				tinyMCE.feedback[exerciseid] = {text: new Array, sound: new Array};
			}
			tinyMCE.feedback[exerciseid].text[identifier] = stringEncode(feedback);
			tinyMCE.feedback[exerciseid].sound[identifier] = feedback_sound;

			tinyMCEPopup.close();
			return true;

		}

};

tinyMCEPopup.onInit.add(feedbackDialog.init, feedbackDialog);
