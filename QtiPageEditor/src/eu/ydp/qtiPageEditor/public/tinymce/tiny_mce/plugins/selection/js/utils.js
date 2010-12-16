function add_answer_row(form) {

	var randid = Math.random();
	randid = String(randid);
	var rg = new RegExp('0.([0-9]*)',"gi");
	exec = rg.exec(randid);
	var id = 'id_' + exec[1];

	while(form.nodeName != 'FORM') {
		form = form.parentNode;
	}
	
	var newDiv = document.createElement('div');
	newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
	newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr>\n\
		<td width="260px" style="padding-right: 5px;">\n\
		<input type="text" id="answer" name="answers[]" style="width: 100%; margin-right: 5px;" value=""/>\n\
		</td>\n\
		<input type="hidden" id="id" name="ids[]" value="' + id + '"/>\n\
		<td width="400px" id="optionsSpans">\n\
		<span name="optionSpan" style="margin-left: 10px; margin-right: 10px;">\n\
		<strong>1.</strong>&nbsp;\n\
		<input id="point_0" type="radio" value="0" name="points[' + id + ']" style="margin: 0; padding: 0;"/>\n\
		</span>\n\
		<span name="optionSpan" style="margin-left: 10px; margin-right: 10px;">\n\
		<strong>2.</strong>&nbsp;\n\
		<input id="point_0" type="radio" value="1" name="points[' + id + ']" style="margin: 0; padding: 0;"/>\n\
		</span>\n\
		</td>\n\
		<td width="50px"><input id="fixed_0" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td>\n\
		<td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td>\n\
		<td width="50px"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr>\n\
		</table>';
	document.getElementById('answer_list').appendChild(newDiv);
}

function add_option_row(form) {

	var randid = Math.random();
	randid = String(randid);
	var rg = new RegExp('0.([0-9]*)',"gi");
	exec = rg.exec(randid);
	var id = 'id_' + exec[1];

	while(form.nodeName != 'FORM') {
		form = form.parentNode;
	}

	var newDiv = document.createElement('div');
	var last = document.getElementById('option_list').lastChild.firstChild.innerHTML;
	last = parseInt(last.replace('.',''));
	var next = last + 1;
	newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
	newDiv.innerHTML = '<strong>' + next + '.</strong>&nbsp;<input type="hidden" name="choices_ids[]" value="' + id + '"><input type="text" name="choices[]" value="" id="choice_' + last + '">&nbsp;<input type="button" id="remove_option" name="remove_option" value="Remove" onclick="remove_option_row(this);" />';
	document.getElementById('option_list').appendChild(newDiv);
	
}


function remove_answer_row(row) {

	var table = row.parentNode.parentNode.parentNode.parentNode;
	table.parentNode.removeChild(table);
	
}

function remove_option_row(row) {

	var div = row.parentNode;
	div.parentNode.removeChild(div);

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
	var selected_answers = true;
	var question = false;
	var answers_contents = new Array;
	var validator_errors = new Array;
	
	$('#div_points').attr('style' , 'width: 100%; font-weight: bold;');
	$("input[name='answers[]']").attr('style' , 'width: 100%; margin-right: 5px;');
	$('#question').attr('style' , 'width: 100%;');
	
	while(form.elements[i] != undefined) {
		if(form.elements[i].getAttribute('name') == 'question') {
			if(form.elements[i].value != '') {
				question = true;
			}
		}
		if(form.elements[i].getAttribute('name') == 'answers[]') {
			if(form.elements[i].value == '') {
				answers_contents.push(form.elements[i]);
			}
		}
//		if(form.elements[i].getAttribute('name') == 'points[]') {
//			if(form.elements[i].checked) {
//				selected_answers = true;
//			}
//		}
		i++;
	}
//	if(selected_answers === false) {
//		$('#div_points').attr('style' , 'width: 100%; font-weight: bold; color: red;');
//		validator_errors.push('Set correct answers');
//		tinyMCE.activeEditor.windowManager.resizeBy(0, 30, 'mce_0');
//	}
	if(answers_contents.length > 0) {
		for (i in answers_contents) {
			if(answers_contents[i].attributes != undefined) {
				answers_contents[i].setAttribute('style' , 'width: 100%; margin-right: 5px; border: 2px solid red;');
			}
		}
		validator_errors.push('Fill the answers fields');
		tinyMCE.activeEditor.windowManager.resizeBy(0, 30, 'mce_0');
	}
	if(question === false) {
		$('#question').attr('style' , 'width: 100%; border: 2px solid red;');
		validator_errors.push('Fill the question field');
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

	return /* selected_answers && */ question && (answers_contents.length == 0);
	
}
