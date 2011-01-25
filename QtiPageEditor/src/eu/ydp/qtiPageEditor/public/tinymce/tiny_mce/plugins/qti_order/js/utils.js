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
	newDiv.setAttribute('style', 'width: 100%; margin: 3px; background-image:url(img/move.png); padding-left: 20px; background-repeat: no-repeat;');
	if(form.images.checked == true) {
		newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="260px" style="padding-right: 5px;"><input type="hidden" id="" name="answers[]" style="width: 100%; margin-right: 5px;" /><div style="width: 80px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;" onclick="tinyMCE.execCommand(\'mceAppendImageToExercise\', false, {src:null,div:this});"><img style="max-height: 40px; max-width: 80px;" src=""/></div></td><input type="hidden" id="" name="ids[]" value="' + id + '"/><td width="50px"><input id="" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td></tr></table>';
	} else {
		newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="260px" style="padding-right: 5px;"><input type="text" id="" name="answers[]" style="width: 100%; margin-right: 5px;" /></td><input type="hidden" id="" name="ids[]" value="' + id + '"/><td width="50px"><input id="" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td></tr></table>';
	}
	document.getElementById('answer_list_sortable').appendChild(newDiv);
	
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


function validateExercise(form) {
	
	var i = 0;
	var question = false;
	var answers_contents = new Array;
	var validator_errors = new Array;
	
	$("input[name='answers[]']").attr('style' , 'width: 100%; margin-right: 5px;');
	$('#question').attr('style' , 'width: 100%;');
	
	while(form.elements[i] != undefined) {
		if(form.elements[i].getAttribute('name') == 'answers[]') {
			if(form.elements[i].value == '') {
				answers_contents.push(form.elements[i]);
			}
		}
		if(form.elements[i].getAttribute('name') == 'question') {
			if(form.elements[i].value != '') {
				question = true;
			}
		}
		i++;
	}
	
	if(question === false) {
		$('#question').attr('style' , 'width: 100%; border: 2px solid red;');
		validator_errors.push('Fill the question field');
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
	
	var errInf = '';
	if(validator_errors.length > 0) {
		errInf = '<ul>';
		for(i in validator_errors) {
			errInf += '<li>' + validator_errors[i] + '</li>';
		}
		errInf += '</ul>';
	}
	$('#validator_errors').html(errInf);
	
	return  question && (answers_contents.length == 0);
	
}