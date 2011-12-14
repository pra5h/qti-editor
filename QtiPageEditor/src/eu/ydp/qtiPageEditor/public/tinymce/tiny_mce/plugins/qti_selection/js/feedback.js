tinyMCEPopup.requireLangPack();

var feedbackDialog = {
	windowId : null,
	
	init : function(ed) {
		document.body.setAttribute('onUnload',"tinymce.DOM.remove('mcePopupLayer_'+feedbackDialog.windowId);");
		document.body.setAttribute('onLoad',"feedbackDialog.windowId = lock(tinyMCEPopup.id);");
		var data = tinyMCEPopup.getWindowArg("data");
		
		$('#identifier').attr('value',data.identifier);
		$('#exerciseid').attr('value',data.exerciseid);
		
		if(data.feedback != undefined && data.feedback != '') {
			$('#feedback_onok').attr('value',data.feedback.onOk);
			$('#feedback_onwrong').attr('value',data.feedback.onWrong);
			//$('#fdb_sound_onok').attr('value',data.feedback.sound.onOk);
			//$('#fdb_sound_onwrong').attr('value',data.feedback.sound.onWrong);
		} 
		//else if(tinyMCE.feedback != undefined && tinyMCE.feedback[data.exerciseid] != undefined) {
			//console.log('znalazlem');
			//console.dir(tinyMCE.feedback);
		/*	$('#feedback_onok').attr('value',tinyMCE.feedback[data.identifier].onOk);
			$('#feedback_onwrong').attr('value',tinyMCE.feedback[data.identifier].onWrong);
			$('#fdb_sound_onok').attr('value',tinyMCE.feedback[data.identifier].onok_sound);
			$('#fdb_sound_onwrong').attr('value',tinyMCE.feedback[data.identifier].onwrong_sound);
			*/
		//}
	},

	prepareFeedback : function(form) {
		
		var formElements = form.elements;
		var identifier = '';
		var exerciseid = '';
		var feedback_onok = '';
		var feedback_onwrong = '';
		var fdb_sound_onok = '';
		var fdb_sound_onwrong = '';

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

		var textFdb = new Object()
		textFdb.onOk = feedback_onok;
		textFdb.onWrong = feedback_onwrong;

		/*var soundFdb = new Object()
		soundFdb.onOk = fdb_sound_onok;
		soundFdb.onWrong = fdb_sound_onwrong;
		*/
		
		if(tinyMCE.feedback[exerciseid] == undefined) {
			tinyMCE.feedback[exerciseid] = {text: new Object(), sound: new Object()};
		}
		
		tinyMCE.feedback[exerciseid].text[identifier] = textFdb;
		//tinyMCE.feedback[exerciseid].sound[identifier] = soundFdb;
		tinyMCEPopup.close();
		return true;
		
	}

};

tinyMCEPopup.onInit.add(feedbackDialog.init, feedbackDialog);

