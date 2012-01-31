tinyMCEPopup.requireLangPack();

var feedbackDialog = {
	windowId : null,	
	init : function(ed) {
		document.body.setAttribute('onUnload',"tinymce.DOM.remove('mcePopupLayer_'+feedbackDialog.windowId);delete tinymce.EditorManager.activeEditor.windowManager.isFeedbackOpened;");
		document.body.setAttribute('onLoad',"feedbackDialog.windowId = lock(tinyMCEPopup.id);");
		
		var data = tinyMCEPopup.getWindowArg("data");
		document.getElementById('identifier').setAttribute('value',data.identifier);
		document.getElementById('exerciseid').setAttribute('value',data.exerciseid);
		if(data.feedback != undefined && data.feedback != '') {
			document.getElementById('feedback').setAttribute('value',stringDecode(data.feedback));
			document.getElementById('fdb_sound').setAttribute('value',data.feedback_sound);
		} else if(tinyMCE.feedback != undefined && tinyMCE.feedback[data.identifier] != undefined) {
			document.getElementById('feedback').setAttribute('value',stringDecode(tinyMCE.feedback[data.identifier].text));
			document.getElementById('fdb_sound').setAttribute('value',tinyMCE.feedback[data.identifier].sound);
		}
		$('#feedback').focus();
	},

	prepareFeedback : function(form) {
		
		var formElements = form.elements;
		var identifier = '';
		var exerciseid = '';
		var feedback = '';
		var feedback_sound = '';
		
		if(tinyMCE.feedback == undefined) {
			tinyMCE.feedback = new Array();
		}
		
		for(i in formElements) {
			if(formElements[i].attributes != undefined) {
				if(formElements[i].getAttribute('name') == 'identifier') {
					identifier = formElements[i].getAttribute('value');
				}
				if(formElements[i].getAttribute('name') == 'exerciseid') {
					exerciseid = formElements[i].getAttribute('value');
				}
				if(formElements[i].getAttribute('name') == 'feedback') {
					feedback = formElements[i].value;
				}
				if(formElements[i].getAttribute('name') == 'fdb_sound') {
					feedback_sound = formElements[i].value;
				}
			}
		}
		
		if(tinyMCE.feedback[exerciseid][identifier] == undefined) {
			tinyMCE.feedback[exerciseid][identifier] = {text: new Array, sound: new Array};
		}
		tinyMCE.feedback[exerciseid][identifier].text = stringEncode(feedback);
		tinyMCE.feedback[exerciseid][identifier].sound = feedback_sound;
		
		tinyMCEPopup.close();
		return true;
		
	}
};

tinyMCEPopup.onInit.add(feedbackDialog.init, feedbackDialog);

