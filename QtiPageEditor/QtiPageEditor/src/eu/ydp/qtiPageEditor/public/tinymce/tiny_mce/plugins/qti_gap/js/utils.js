function feedback(row) {
	
	var fieldset = row.parentNode.parentNode.parentNode.parentNode.parentNode;
	var inputs = fieldset.getElementsByTagName('input');
	for(i in inputs) {
		if(inputs[i].attributes != undefined && inputs[i].getAttribute('id') == 'identifier') {
			var identifier = inputs[i].getAttribute('value');
			break;
		}
	}
	if(identifier != undefined) {
		if(tinyMCE.feedback != undefined && tinyMCE.feedback[identifier] != undefined) {
			tinyMCE.execCommand('mceFeedbackGap', false, {identifier: identifier, feedback: tinyMCE.feedback[identifier]});
		} else {
			tinyMCE.execCommand('mceFeedbackGap', false, {identifier: identifier});
		}
	}
	
}

function assignSound(row) {
	
	tinyMCE.execCommand('mceAddFeedbackSound', false, {dest: row.previousSibling.previousSibling, src: row.previousSibling.previousSibling.value});
	
}

function validateExercise(form) {
	
	if(form.gap.value == undefined || form.gap.value == '') {
		$('#gap').attr('style' , 'width: 100%; border: 2px solid red;');
		$('#validator_errors').html('<ul><li>Set gap correct answer</li></ul>');
		tinyMCE.activeEditor.windowManager.resizeBy(0, 30, 'mce_0');
		return false
	}
	return true;
	
}

function previous(inputHiddenId) {

	var identifier = inputHiddenId.value;
	var archIdentifier = identifier.replace(/id_([0-9]*)/, 'arch_$1');
	
	tinyMCE.execCommand('mceShowPreviousVersion', false, {archIdentifier: archIdentifier});
	
}