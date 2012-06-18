function apply_slot(lp) {
	
	var contents = document.getElementById('contents');
	var before = contents.value.substring(0,contents.selectionStart);
	var after = contents.value.substring(contents.selectionEnd);
	contents.value = before + '[slot #' + lp + ']' + after;

}

function add_slot_row(form) {

	var randid = Math.random();
	randid = String(randid);
	var rg = new RegExp('0.([0-9]*)',"gi");
	exec = rg.exec(randid);
	var id = 'id_' + exec[1];

	while(form.nodeName != 'FORM') {
		form = form.parentNode;
	}
	
	var apply_slots = document.getElementsByClassName('apply_slot');
	if(apply_slots.length > 0) {
		var lastIdx = apply_slots.length - 1;
		var lp = apply_slots[lastIdx].id;
		lp = lp.split('_');
		lp = parseInt(lp[2]) + 1;
	} else {
		lp = 1;
	}

	var newDiv = document.createElement('div');
	newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
	newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="200px" style="padding-right: 5px;"><input type="text" id="" name="slots[]" style="width: 100%; margin-right: 5px;" /></td><input type="hidden" id="id_" name="ids[]" value="' + id + '"/><td width="50px"><input id="" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td><td width="80px"><input type="button" id="add_slot_' + lp + '" class="apply_slot" name="add_slot" value="Add" onclick="apply_slot(' + lp + ');" /></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td width="50px"><img src="img/feedback.png" onclick="feedback(this);"/></td></tr></table>';
	document.getElementById('slots_list').appendChild(newDiv);
	
}

function remove_answer_row(row) {

	var table = row.parentNode.parentNode.parentNode.parentNode;
	table.parentNode.removeChild(table);
	
}

function switch_multiple_single(checkbox) {
	
	form = checkbox;
	while(form.nodeName != 'FORM') {
		form = form.parentNode;
	}
	
	if(checkbox.checked == true) {
		var inputs = document.getElementsByName('points[]');
		for (i in inputs) {
			inputs[i].type = 'checkbox';
		}
	} else {
		var inputs = document.getElementsByName('points[]');
		for (i in inputs) {
			inputs[i].type = 'radio';
		}
	}
	
	return true;
	
}

function switch_text_images(checkbox) {
	
	form = checkbox;
	while(form.nodeName != 'FORM') {
		form = form.parentNode;
	}
	
	if(checkbox.checked == true) {
		var inputs = document.getElementsByName('answers[]');
		for (i in inputs) {
			if(inputs[i].type != undefined) {
				inputs[i].type = 'hidden';
				src = inputs[i].value.split('/');
				src = src[src.length - 1];
				var div = document.createElement('div');
				div.setAttribute('style', 'width: 80px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;');
				div.setAttribute('onclick', 'tinyMCE.execCommand(\'mceAppendImageToExercise\', false, {src:\'' + src + '\',div:this});');
				div.innerHTML = '<img style="max-height: 40px; max-width: 80px;" src="' + inputs[i].value + '"/>'
				inputs[i].parentNode.appendChild(div);
			}
		}
	} else {
		var inputs = document.getElementsByName('answers[]');
		for (i in inputs) {
			if(inputs[i].type != undefined) {
				inputs[i].type = 'text';
				inputs[i].parentNode.removeChild(inputs[i].nextSibling);
			}
		}
	}
	
	return true;
	
}

function feedback(row) {
	
	var tr = row;
	while(tr.nodeName != 'FORM') {
		tr = tr.parentNode;
	}
	var exerciseId = tr.identifier.value;
	var tr = row.parentNode.parentNode;
	var inputs = tr.getElementsByTagName('input');
	for(i in inputs) {
		if(inputs[i].attributes != undefined && inputs[i].getAttribute('id').match(/^id_/i)) {
			var identifier = inputs[i].getAttribute('value');
			break;
		}
	}
	if(identifier != undefined && exerciseId != undefined) {
		if(tinyMCE.feedback != undefined && tinyMCE.feedback[exerciseId] != undefined) {
			tinyMCE.execCommand('mceFeedbackChoice', false, {exerciseid: exerciseId, identifier: identifier, feedback: tinyMCE.feedback[exerciseId].text[identifier], feedback_sound:  tinyMCE.feedback[exerciseId].sound[identifier]});
		} else {
			tinyMCE.execCommand('mceFeedbackChoice', false, {exerciseid: exerciseId, identifier: identifier});
		}
	}
	
}

function assignSound(row) {
	
	tinyMCE.execCommand('mceAddFeedbackSound', false, {dest: row.previousSibling.previousSibling, src: row.previousSibling.previousSibling.value});
	
}

function validateExercise(form) {
	
	var i = 0;
	var selected_slots = false;
	var contents = false;
	var slots_contents = new Array;
	var validator_errors = new Array;
	
	$('#div_points').attr('style' , 'width: 100%; font-weight: bold;');
	$("input[name='slots[]']").attr('style' , 'width: 100%; margin-right: 5px;');
	$('#question').attr('style' , 'width: 100%;');

	while(form.elements[i] != undefined) {
		if(form.elements[i].getAttribute('name') == 'contents') {
			if(form.elements[i].value != '') {
				contents = true;
			}
		}
		if(form.elements[i].getAttribute('name') == 'slots[]') {
			if(form.elements[i].value == '') {
				slots_contents.push(form.elements[i]);
			}
		}
//		if(form.elements[i].getAttribute('name') == 'points[]') {
//			if(form.elements[i].checked) {
//				selected_slots = true;
//			}
//		}
		i++;
	}
//	if(selected_slots === false) {
//		$('#div_points').attr('style' , 'width: 100%; font-weight: bold; color: red;');
//		validator_errors.push('Set correct slots');
//		tinyMCE.activeEditor.windowManager.resizeBy(0, 30, 'mce_0');
//	}
	if(slots_contents.length > 0) {
		for (i in slots_contents) {
			if(slots_contents[i].attributes != undefined) {
				slots_contents[i].setAttribute('style' , 'width: 100%; margin-right: 5px; border: 2px solid red;');
			}
		}
		validator_errors.push('Fill the slots fields');
		tinyMCE.activeEditor.windowManager.resizeBy(0, 30, 'mce_0');
	}
	if(contents === false) {
		$('#contents').attr('style' , 'width: 100%; border: 2px solid red;');
		validator_errors.push('Fill the contents field');
		tinyMCE.activeEditor.windowManager.resizeBy(0, 30, 'mce_0');
	}
	
	var errInf = '';
	if(validator_errors.length > 0) {
		errInf = '<ul>';
		for(i in validator_errors) {
			errInf += '<li>' + validator_errors[i] + '</li>';
		}
		errInf += '</ul>';
	}
	$('#validator_errors').html(errInf);
	
	return /*selected_slots && */ contents && (slots_contents.length == 0);
	
}
