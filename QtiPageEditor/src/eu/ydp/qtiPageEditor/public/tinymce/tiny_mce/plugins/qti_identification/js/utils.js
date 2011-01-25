function add_answer_row() {
	
	var randid = Math.random();
	randid = String(randid);
	var rg = new RegExp('0.([0-9]*)',"gi");
	exec = rg.exec(randid);
	var id = 'id_' + exec[1];

	var newDiv = document.createElement('div');
	newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
	newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="260px" style="padding-right: 5px;"><input type="text" id="" name="answers[]" style="width: 100%; margin-right: 5px;" /></td><input type="hidden" id="id_" name="ids[]" value="' + id + '"/><td width="50px" align="center"><input type="checkbox" name="points[]" style="margin: 0; padding: 0;" /></td><td width="50px" align="center"><input id="" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td width="50px" align="left"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
	document.getElementById('answer_list').appendChild(newDiv);
	
}

function remove_answer_row(row) {

	var table = row.parentNode.parentNode.parentNode.parentNode;
	table.parentNode.removeChild(table);
	
}

function feedback(row) {
	
	var tr = row;
	while(tr.nodeName != 'FORM') {
		tr = tr.parentNode;
	}
	var exerciseId = tr.identifier.value;
	tr = row.parentNode.parentNode;
	var inputs = tr.getElementsByTagName('input');
	for(i in inputs) {
		if(inputs[i].attributes != undefined && inputs[i].getAttribute('id').match(/id_/)) {
			var identifier = inputs[i].getAttribute('value');
			break;
		}
	}
	if(identifier != undefined && exerciseId != undefined) {
		if(tinyMCE.feedback != undefined && tinyMCE.feedback[exerciseId] != undefined) {
			tinyMCE.execCommand('mceFeedbackIdentification', false, {identifier: identifier, exerciseid: exerciseId, feedback: tinyMCE.feedback[exerciseId].text[identifier], feedback_sound: tinyMCE.feedback[exerciseId].sound[identifier]});
		} else {
			tinyMCE.execCommand('mceFeedbackIdentification', false, {identifier: identifier, exerciseid: exerciseId});
		}
	}
	
}

function validateExercise(form) {
	
	var i = 0;
	var res = false;
	while(form.elements[i] != undefined) {
		if(form.elements[i].getAttribute('name') == 'points[]') {
			if(form.elements[i].checked) {
				res = true;
			}
		}
		i++;
	}
	if(res === false) {
		$('#div_points').attr('style' , 'width: 100%; font-weight: bold; color: red;');
		$('#validator_errors').html('<ul><li>Select correct answer</li></ul>');
		tinyMCE.activeEditor.windowManager.resizeBy(0, 30, 'mce_0');
	}
	return res;
	
}


function assignSound(row) {
	
	tinyMCE.execCommand('mceAddFeedbackSound', false, {dest: row.previousSibling.previousSibling, src: row.previousSibling.previousSibling.value});
	
}