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
	
	var answerImg = '';
	if (form.images.checked) {
		answerImg = '<div style="width: 80px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;" onclick="tinyMCE.execCommand(\'mceAppendImageToExercise\', false, {src:\'\',div:this});"><img style="max-height: 40px; max-width: 80px;" src="" /></div>';
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
		+answerImg+'</td>\n'
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
	if (form.images.checked) {
		$('#answer_'+last).hide();
		$("#taginsert_menu_answer_"+last).hide();
		$("#taginsert_math_answer_"+last).hide();
	}
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

	var optionImg = '';
	if (form.images.checked) {
		optionImg = '<div style="width: 80px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;" onclick="tinyMCE.execCommand(\'mceAppendImageToExercise\', false, {src:\'\',div:this});"><img style="max-height: 40px; max-width: 80px;" src="" /></div>';
	}
	var newDiv = document.createElement('div');
	var last = $('#option_list strong:last').text(); //.childNodes[3].innerHTML;
	last = parseInt(last.replace('.',''));
	var next = last + 1;
	newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
	newDiv.innerHTML = '<table><tr><td><br class="clr"/><strong>' + next + '.</strong>&nbsp;\n'
		+'<input type="hidden" name="choices_ids[]" value="' + id + '">\n'
		+'<input type="text" name="choices[]" value="" id="choice_' + last + '">&nbsp;'+optionImg+'</td>\n'
		+'<td><input type="button" id="remove_option" name="remove_option" value="Remove" onclick="remove_option_row(this);" /></td></tr></table>';
	document.getElementById('option_list').appendChild(newDiv);
	tagInsert.init('choice_' + last);
	InputHelper.init($('#choice_'+last));
	
	if (form.images.checked) {
		$('#choice_'+last).hide();
		$("#taginsert_menu_choice_"+last).hide();
		$("#taginsert_math_choice_"+last).hide();
	}

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
	//var fieldset = $(row).parent().parent();
	var i = $("input[name=remove_option]").length;
/*	fieldset.children('div').each(function(a,b){
		i++;
	});
*/
	if (i > 1) {
		var div = $(row).closest("div");
		//var div = row.parentNode;
		var removedId = $("input[name=choices_ids[]]", div).val();
		div.remove();

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
				var div = document.createElement('div');
				div.setAttribute('style', 'width: 80px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;');
				//div.setAttribute('onclick', 'tinyMCE.execCommand(\'mceAppendImageToExercise\', false, {src:\'' + src + '\',div:this});');
				div.setAttribute('onclick', 'tinyMCE.execCommand(\'mceAppendImageToExercise\', false, {src:\'\',div:this});');
				//div.innerHTML = '<img style="max-height: 40px; max-width: 80px;" src="' + inputs[i].value + '"/>'
				div.innerHTML = '<img style="max-height: 40px; max-width: 80px;" src=""/>'
				inputs[i].parentNode.appendChild(div);
			}
		}
		
		var choices = document.getElementsByName('choices[]');
		for (i in choices) {
			if(choices[i].type != undefined) {
				choices[i].type = 'hidden';
				document.getElementById("taginsert_menu_"+choices[i].id).style.display = 'none';
				$("#taginsert_math_"+choices[i].id).hide();
				/*src = choices[i].value.split('/');
				src = src[src.length - 1];*/
				var div = document.createElement('div');
				div.setAttribute('style', 'width: 80px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;');
				//div.setAttribute('onclick', 'tinyMCE.execCommand(\'mceAppendImageToExercise\', false, {src:\'' + src + '\',div:this});');
				div.setAttribute('onclick', 'tinyMCE.execCommand(\'mceAppendImageToExercise\', false, {src:\'\',div:this});');
				//div.innerHTML = '<img style="max-height: 40px; max-width: 80px;" src="' + choices[i].value + '"/>'
				div.innerHTML = '<img style="max-height: 40px; max-width: 80px;" src=""/>'
				choices[i].parentNode.appendChild(div);
			}
		}
	} else {
		var inputs = document.getElementsByName('answers[]');
		for (i in inputs) {
			if(inputs[i].type != undefined) {
				inputs[i].type = 'text';
				inputs[i].parentNode.removeChild(inputs[i].nextElementSibling);
				document.getElementById("taginsert_menu_"+inputs[i].id).style.display = 'block';
				$("#taginsert_math_"+inputs[i].id).show();
				//$(inputs[i]).show();
				inputs[i].value = '';
			}
		}
		
		var choices = document.getElementsByName('choices[]');
		for (i in choices) {
			if(choices[i].type != undefined) {
				choices[i].type = 'text';
				choices[i].parentNode.removeChild(choices[i].nextElementSibling);
				document.getElementById("taginsert_menu_"+choices[i].id).style.display = 'block';
				$("#taginsert_math_"+choices[i].id).show();
				//$(choices[i]).show();
				choices[i].value = '';
			}
		}
	}
	
	return true;
	
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
	$("input[name='answers[]']").attr('style' , 'width: 100%; margin-right: 5px; display:'+$("input[name='answers[]']").css('display'));
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
				answers_contents[i].setAttribute('style' , 'width: 100%; margin-right: 5px; border: 2px solid red; display:'+answers_contents[i].style.display);
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
				$('#choice_'+i).attr('style' , 'border: 2px solid red; display:'+$('#choice_'+i).css('display'));
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