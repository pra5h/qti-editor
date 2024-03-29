function add_answer_row(form) {

	var randid = Math.random();
	randid = String(randid);
	var rg = new RegExp('0.([0-9]*)',"gi");
	exec = rg.exec(randid);
	var id = 'id_' + exec[1];
	var list = document.getElementById('answer_list');
	var no = $("td.remove",list).length;

	while(form.nodeName != 'FORM') {
		form = form.parentNode;
	}
	
	if(form.multiple.checked == true) {
		var type = 'checkbox';
	} else {
		var type = 'radio';	
	}
	
	var newDiv = document.createElement('div');
	newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
	var html = '';
	
	if(form.images.checked == true) {
		html = '<table cellpadding=0 cellspacing=0><tr><td class="answer"><input type="hidden" id="id_'+no+'" name="ids[]" value="' + id + '"/><input type="hidden" id="answer_'+no+'" name="answers[]" style="width: 100%; margin-right: 5px;" /><div id="media_answer_'+no+'" class="exerciseMedia" style="width: 80px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;" onclick="tinyMCE.execCommand(\'mceAppendImageToExercise\', false, {src:null,div:this});"><img style="max-height: 40px; max-width: 80px;" src=""/></div></td><td class="correct"><input type="' + type + '" name="points[]" style="margin: 0; padding: 0;" /></td><td class="fixed"><input id="" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td><td class="remove"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td class="feedback"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
	} else {
		html = '<table cellpadding=0 cellspacing=0><tr><td class="answer"><input type="hidden" id="id_'+no+'" name="ids[]" value="' + id + '"/><input type="text" id="answer_'+no+'" name="answers[]" style="width: 100%; margin-right: 5px;" /></td><td class="correct"><input type="' + type + '" name="points[]" style="margin: 0; padding: 0;" /></td><td class="fixed"><input id="" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td><td class="remove"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td class="feedback"><img src="img/feedback.png" onclick="feedback(this);" /></td></tr></table>';
	}
	
	newDiv.innerHTML = html;
	list.appendChild(newDiv);
	tagInsert.init('answer_'+no);
	InputHelper.init($("#answer_"+no));
	
	if(form.images.checked == true) {
		document.getElementById("taginsert_menu_answer_"+no).style.display = 'none';
		$("#taginsert_math_answer_"+no).hide();
	}
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
				document.getElementById("taginsert_menu_"+inputs[i].id).style.display = 'none';
				$("#taginsert_math_"+inputs[i].id).hide();
				//src = inputs[i].value.split('/');
				//src = src[src.length - 1];
				if ($('#media_'+inputs[i].id).length == 0) {
					var div = document.createElement('div');
					div.setAttribute('id', 'media_'+inputs[i].id);
					div.setAttribute('style', 'width: 80px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;');
					div.setAttribute('onclick', 'tinyMCE.execCommand(\'mceAppendImageToExercise\', false, {src:\'\',div:this});');
					div.setAttribute('class', 'exerciseMedia');
					//div.setAttribute('onclick', 'tinyMCE.execCommand(\'mceAppendImageToExercise\', false, {src:\'' + src + '\',div:this});');
					//div.innerHTML = '<img style="max-height: 40px; max-width: 80px;" src="' + inputs[i].value + '"/>'
					div.innerHTML = '<img style="max-height: 40px; max-width: 80px;" src=""/>';
					inputs[i].parentNode.appendChild(div);
				} else {
					$('#media_'+inputs[i].id).show();
				}
			}
		}
	} else {
		var inputs = document.getElementsByName('answers[]');
		for (i in inputs) {
			if(inputs[i].type != undefined) {
				inputs[i].type = 'text';
				//inputs[i].parentNode.removeChild($('div.exerciseMedia', inputs[i].parentNode).get(0));
				$('#media_'+inputs[i].id).hide();
				document.getElementById("taginsert_menu_"+inputs[i].id).style.display = 'block';
				$("#taginsert_math_"+inputs[i].id).show();
				//inputs[i].value = '';
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
			var identifier = inputs[i].value;
			break;
		}
	}

	if(identifier != undefined && exerciseId != undefined) {
		if(tinyMCE.feedback != undefined && tinyMCE.feedback[exerciseId] != undefined && tinyMCE.feedback[exerciseId][identifier] != undefined) {
			tinyMCE.execCommand('mceFeedbackChoice', false, {exerciseid: exerciseId, identifier: identifier, feedback: tinyMCE.feedback[exerciseId][identifier].text, feedback_sound:  tinyMCE.feedback[exerciseId][identifier].sound});
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
	var selected_answers = false;
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
			if (!form.images.checked) {
				if(form.elements[i].value == '') {
					answers_contents.push(form.elements[i]);
				}
			}
		}
		if(form.elements[i].getAttribute('name') == 'points[]') {
			if(form.elements[i].checked) {
				selected_answers = true;
			}
		}
		i++;
	}
	if(selected_answers === false) {
		$('#div_points').attr('style' , 'width: 100%; font-weight: bold; color: red;');
		validator_errors.push('Set correct answers');
		tinyMCE.activeEditor.windowManager.resizeBy(0, 30, 'mce_0');
	}
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

	return selected_answers && question && (answers_contents.length == 0);
	
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