function add_answer_row(form) {

	var randid = Math.random();
	randid = String(randid);
	var rg = new RegExp('0.([0-9]*)',"gi");
	exec = rg.exec(randid);
	var id = 'id_' + exec[1];

	while(form.nodeName != 'FORM') {
		form = form.parentNode;
	}

	var optionList = new Array();
	var optionsDiv = document.getElementById('option_list');
	for(var i in optionsDiv.children) {
		if(optionsDiv.children[i] != undefined && optionsDiv.children[i].nodeName == 'DIV') {
			optionList.push(optionsDiv.children[i].children[1].value);
		}
	}

	var newDiv = document.createElement('div');
	newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
	var newInnerHTML = '<table cellpadding=0 cellspacing=0><tr>\n'
		+'<td width="260px" style="padding-right: 5px;">\n'
		+'<input type="text" id="answer_0" name="answers[]" style="width: 100%; margin-right: 5px;" value=""/>\n'
		+'</td>\n'
		+'<input type="hidden" id="id_0" name="ids[]" value="' + id + '"/>\n'
		+'<td width="400px" id="optionsSpans">';
	for(var i in optionList) {
		var lp = parseInt(i) + 1;
		newInnerHTML += '<span class="optionSpan" style="margin-left: 10px; margin-right: 10px;">\n'
			+'<strong>' + lp + '.</strong>&nbsp;\n'
			+'<input id="point_' + i + '" type="radio" value="' + optionList[i] + '" name="points[' + id + ']" style="margin: 0; padding: 0;"/>\n'
			+'</span>\n';
	}
		newInnerHTML += '</td>\n'
			+'<td width="50px"><input id="fixed_0" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td>\n'
			+'<td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td>\n'
			+'<td width="50px"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr>\n'
			+'</table>';
	newDiv.innerHTML = newInnerHTML;
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
	newDiv.innerHTML = '<strong>' + next + '.</strong>&nbsp;\n'
		+'<input type="hidden" name="choices_ids[]" value="' + id + '">\n'
		+'<input type="text" name="choices[]" value="" id="choice_' + last + '">&nbsp;\n'
		+'<input type="button" id="remove_option" name="remove_option" value="Remove" onclick="remove_option_row(this);" />';
	document.getElementById('option_list').appendChild(newDiv);

	var optionSpans = document.getElementsByClassName('optionSpan');
	var ids = new Array();
	var els = new Array();
	
	for(i in optionSpans) {
	
		if('undefined' != typeof optionSpans[i] && optionSpans[i].children != undefined) {
			var name = optionSpans[i].children[1].getAttribute('name');
			name = name.match(/points\[([^\]]*)\]/);
			name = name[1];
			if(ids[name] == undefined) {
				ids[name] = id;
				els[name] = optionSpans[i];
			}
		}
	}

	for(i in els) {
		var newSpan = document.createElement('span');
		newSpan.setAttribute('class','optionSpan');
		newSpan.setAttribute('style','margin-left: 10px; margin-right: 10px;');
		newSpan.innerHTML = '<strong>' + next + '.</strong>&nbsp;\n'
							+'<input id="point_' + last + '" type="radio" value="' + ids[i] + '" name="points[' + i + ']" style="margin: 0; padding: 0;" />';
		els[i].parentNode.appendChild(newSpan);
	}
}


function remove_answer_row(row) {

	var table = row.parentNode.parentNode.parentNode.parentNode;
	table.parentNode.removeChild(table);
	
}

function remove_option_row(row) {
	var i = 0;
	var fieldset = $(row).parent().parent();

	$("div", fieldset).each(function(a,b){
		i++;
	});

	if (i > 1) {
		var div = row.parentNode;
		div.parentNode.removeChild(div);

		var removedId = div.children[1].getAttribute('value');

		var optionSpans = document.getElementsByClassName('optionSpan');
		for(i in optionSpans) {
			if(optionSpans[i] != undefined && optionSpans[i].children != undefined) {
				var val = optionSpans[i].children[1].getAttribute('value');
				if(val == removedId) {
					optionSpans[i].parentNode.removeChild(optionSpans[i]);
				}
			}
		}
	} else {
		$('#validator_errors').html("<ul><li>The last option cannot be removed.</li></ul>");
	}
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
//		if(inputs[i].attributes != undefined && inputs[i].id == 'id') {
		if(inputs[i].attributes != undefined && inputs[i].getAttribute('id').match(/^id_/i)) {
			var identifier = inputs[i].getAttribute('value');
			break;
		}
	}

	if(identifier != undefined && exerciseId != undefined) {
		if(tinyMCE.feedback != undefined && tinyMCE.feedback[exerciseId] != undefined) {
			tinyMCE.execCommand('mceFeedbackSelection', false, {exerciseid: exerciseId, identifier: identifier, feedback: tinyMCE.feedback[exerciseId].text[identifier]});
		} else {
			tinyMCE.execCommand('mceFeedbackSelection', false, {exerciseid: exerciseId, identifier: identifier});
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
	var points = new Array;
	var ids = new Array;
	var validOptions = true;
	var options = new Array();
	var validCorrectAnswers = true;
	
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
		if(form.elements[i].getAttribute('name') == 'ids[]') {
			ids.push(form.elements[i].value);
		}
		
		if(form.elements[i].getAttribute('name') == 'choices[]') {
			options.push(form.elements[i].value);
		}

		if(0 === strpos(form.elements[i].getAttribute('name'), 'points')) { // == 'points[]'
			var id = form.elements[i].name;
			id = id.replace('points\[','');
			id = id.replace('\]','');

			if ("undefined" == typeof points[id] || false == points[id]) {
				points[id] = form.elements[i].checked;
			}
		}
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

	if(options.length === 0) {
		validator_errors.push('Add minimum one option field.');
		tinyMCE.activeEditor.windowManager.resizeBy(0, 30, 'mce_0');
		validOptions = false;
	} else {
		
		for(i in options) {
			
			if (options[i] == '') {
				$('#choice_'+i).attr('style' , 'border: 2px solid red;');
				validator_errors.push('Fill the option field');
				tinyMCE.activeEditor.windowManager.resizeBy(0, 30, 'mce_0');
				validOptions = false;
				break;
			}
		}
	}
	
	for(i in ids) {

		if (false == points[ids[i]]) {
			validator_errors.push('Select the correct answer');
			tinyMCE.activeEditor.windowManager.resizeBy(0, 30, 'mce_0');
			validCorrectAnswers = false;
			break;
		}
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

	return /* selected_answers && */ question && (answers_contents.length == 0) && validOptions && validCorrectAnswers;
	
}

function strpos(haystack, needle, offset) {
	  var i = (haystack+'').indexOf(needle, (offset || 0));
	  return i === -1 ? false : i;
}

