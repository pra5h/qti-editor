function add_answer_row(form) {

	var randid = Math.random();
	randid = String(randid);
	var rg = new RegExp('0.([0-9]*)',"gi");
	exec = rg.exec(randid);
	var id = 'id_' + exec[1];
	var last = $('table.answer').length;
	
	while(form.nodeName != 'FORM') {
		form = form.parentNode;
	}

	var optionList = new Array();
	var htmlOptionsList = $("input[name=choices_ids[]]");

	for(var i = 0; i < htmlOptionsList.length; i++) {
		optionList.push(htmlOptionsList.get(i).value);
	}

	var newDiv = document.createElement('div');
	newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
	var newInnerHTML = '<table class="answer" cellpadding=0 cellspacing=0><tr>\n'
		+'<td width="260px" style="padding-right: 5px;">\n'
		+'<input type="text" id="answer_'+last+'" name="answers[]" style="width: 100%; margin-right: 5px;" value=""/>\n'
		+'</td>\n'
		+'<input type="hidden" id="id_'+last+'" name="ids[]" value="' + id + '"/>\n'
		+'<td width="400px" id="optionsSpans">';

	for(var i in optionList) {
		var lp = parseInt(i) + 1;
		newInnerHTML += '<span class="optionSpan">\n\
			<strong>' + lp + '.</strong>\n\
			<input id="point_' + i + '" type="radio" value="' + optionList[i] + '" name="points[' + id + ']" /></span>';
	}
		newInnerHTML += '</td>\n'
			+'<td width="50px"><input id="fixed_0" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td>\n'
			+'<td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td>\n'
			+'<td width="50px"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr>\n'
			+'</table>';

	newDiv.innerHTML = newInnerHTML;
	document.getElementById('answer_list').appendChild(newDiv);
	tagInsert.init('answer_' + last);
	InputHelper.init($('#answer_'+last));
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
	var last = document.getElementById('option_list').lastChild.childNodes[3].innerHTML;
	last = parseInt(last.replace('.',''));
	var next = last + 1;
	newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
	newDiv.innerHTML = '<br class="clr"/><strong>' + next + '.</strong>&nbsp;\n'
		+'<input type="hidden" name="choices_ids[]" value="' + id + '">\n'
		+'<input type="text" name="choices[]" value="" id="choice_' + last + '">&nbsp;\n'
		+'<input type="button" id="remove_option" name="remove_option" value="Remove" onclick="remove_option_row(this);" />';
	document.getElementById('option_list').appendChild(newDiv);
	tagInsert.init('choice_' + last);
	InputHelper.init($('#choice_'+last));

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
		//if (next%4 == 1 && next != 1)
		//{
			//els[i].parentNode.appendChild(document.createElement('hr'));
		//}
		var newSpan = document.createElement('span');
		
		newSpan.setAttribute('class','optionSpan');
		newSpan.innerHTML = '<strong>' + next + '.</strong>\n'
							+'<input id="point_' + last + '" type="radio" value="' + ids[i] + '" name="points[' + i + ']" />';
		
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
	fieldset.children('div').each(function(a,b){
		i++;
	});

	if (i > 1) {
		var div = row.parentNode;
		div.parentNode.removeChild(div);
		var removedId = $("input[name=choices_ids[]]", div).val(); 

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

function lock(id) {
	var ed = tinymce.EditorManager.activeEditor;
	var zIndex = ed.windowManager.zIndex;
	
	//zIndex--;
	var elm = tinymce.DOM.create('div', {id : 'mcePopupLayer_'+id, style : 'background-color: gray;height: 100%;opacity: 0.3;position: fixed;top: 0;width: 100%;z-index:'+(zIndex-1)+';'}, '&nbsp;');
	$(elm).insertBefore(tinymce.DOM.get(id));
	//tinymce.DOM.insertAfter(elm, tinymce.DOM.get(id));
	//$(tinymce.DOM.get(id)).css("z-index", zIndex);
	return id;
}