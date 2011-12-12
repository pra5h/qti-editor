tinyMCEPopup.requireLangPack();

var feedbackDialog = {
	
	init : function(ed) {
		this.layerId = hidePopup(tinyMCEPopup.id);
		
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
		
	},

	prepareFeedback : function(form) {
		
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
		
		if(tinyMCE.feedback[exerciseid] == undefined) {
			tinyMCE.feedback[exerciseid] = {text: new Array, sound: new Array};
		}
		tinyMCE.feedback[exerciseid].text[identifier] = stringEncode(feedback);
		tinyMCE.feedback[exerciseid].sound[identifier] = feedback_sound;
		
		this.close();
		return true;
		
	},
	close: function() {
		removeLayer(this.layerId);
		tinyMCEPopup.close();
	}
};

tinyMCEPopup.onInit.add(feedbackDialog.init, feedbackDialog);

