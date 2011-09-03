var gapRowTemplate = '<tr id="{number}">'
						+'<td style="width: 190px;">'
							+'<input type="hidden" id="identifier{number}" name="identifier" value="{identifier}"/>'
							+'<input type="hidden" id="distractorData{number}" name="distractorData" value=""/>'
							+'<input class="answer" type="text" id="answer{number}" name="answer"/>'
						+'</td>'
						+'<td>'
							+'<input type="checkbox" id="checkbox{number}" name="checkbox" onChange="changeRowType(this);"/>'
						+'</td>'
						+'<td>'
							+'<input type="button" id="distractor{number}" name="distractor" value="'+tinyMCE.i18n['en.gapinlinechoice_dlg.gap_distractor']+'" disabled="disabled" onClick="gapInlineChoiceDialog.openInlineChoice({number});" />'
						+'</td>'
						+'<td>'
							+'<input type="button" id="{number}_add" name="add" value="'+tinyMCE.i18n['en.gapinlinechoice_dlg.gap_add']+'" onClick="applyExternalRowData(\'{number}\')"/>'
						+'</td>'
						+'<td>'
							+'<input type="button" id="{number}_remove" name="remove" value="'+tinyMCE.i18n['en.gapinlinechoice_dlg.gap_remove']+'" onClick="removeExternalRowData(this);" />'
						+'</td>'
						+'<td>'
							+'<input type="hidden" id="feedback{number}" name="feedback" />'
							+'<img id="feedback{number}" alt="Set feedback" title="Set feedback" onclick="feedback({number});" src="img/feedback.png"/>'
						+'</td>'
					+'</tr>';

function feedback(obj) {

	//sekcja dla gap
	if ('number' == typeof obj) {  
		var identifier = $('#identifier'+obj).val();
		var chboxElm = $('#checkbox' + obj);

		if (false == chboxElm.attr('checked')) {
	
			if(identifier != undefined) {

				if(tinyMCE.feedback != undefined && tinyMCE.feedback[identifier] != undefined) {
					tinyMCE.execCommand('mceFeedbackGap', false, {identifier: identifier, feedback: tinyMCE.feedback[identifier]});
				} else {
					tinyMCE.execCommand('mceFeedbackGap', false, {identifier: identifier});
				}
			}
		}

	} else if ('object' == typeof obj) {
		//sekcja dla inlineChoice
		var tr = obj;
		while(tr.nodeName != 'FORM') {
			tr = tr.parentNode;
		}
		var exerciseId = tr.identifier.value;
		tr = obj.parentNode.parentNode;
		var inputs = tr.getElementsByTagName('input');
		for(i in inputs) {
			if(inputs[i].attributes != undefined && inputs[i].getAttribute('id').match(/id_/)) {
				var identifier = inputs[i].getAttribute('value');
				break;
			}
		}
		if(identifier != undefined && exerciseId != undefined) {
			if(tinyMCE.feedback != undefined && tinyMCE.feedback[exerciseId] != undefined) {
				tinyMCE.execCommand('mceFeedbackInlinechoice', false, {identifier: identifier, exerciseid: exerciseId, feedback: tinyMCE.feedback[exerciseId].text[identifier], feedback_sound: tinyMCE.feedback[exerciseId].sound[identifier]});
			} else {
				tinyMCE.execCommand('mceFeedbackInlinechoice', false, {identifier: identifier, exerciseid: exerciseId});
			}
		}
	}
}

function assignSound(row) {
	
	tinyMCE.execCommand('mceAddFeedbackSound', false, {dest: row.previousSibling.previousSibling, src: row.previousSibling.previousSibling.value});
	
}

function addNewRow(row) {
	var lastId;
	var newId;
	var gapId = $('#gaps tbody tr').last().attr('id');
	var id;
	
	if (null != row) {
		newId = row.id;
		id = row.identifier;
	} else {
		
		if ("undefined" == typeof(gapId)) {
			newId = "0";
		} else {
			lastId = gapId.replace(/[a-z]+/i,'');
			newId = parseInt(lastId) + 1;
		}
		
		randid = String(Math.random());
		var rg = new RegExp('0.([0-9]*)',"gi");
		exec = rg.exec(randid);
		id = 'id_' + exec[1];
	}
	var newRow = gapRowTemplate.replace(/{number}/g, newId);
	

	
	newRow = newRow.replace(/{identifier}/, id);
	
	$('#gaps').last().append(newRow);
	
	if (null != row) {
		$('#answer'+newId).attr('value', row.answer);
		$('#identifier'+newId).attr('value', row.identifier);
	}

}

function applyExternalRowData(identifier) {
	
	var lp = identifier;
	var chboxElm = $('#checkbox' + lp);
	var type;

	if (false == chboxElm.attr('checked')) {
		type = 'gap';
	} else {
		type = 'inlineChoice';
	}

	var contents = document.getElementById('exercise_content');
	var before = contents.value.substring(0,contents.selectionStart);
	var after = contents.value.substring(contents.selectionEnd);
	contents.value = before + '['+type+'#' + lp + ']' + after;
}

function removeExternalRowData(removeElement) {
	
	var tr = removeElement.parentNode.parentNode;
	var id = tr.id;
	var ch = $('#checkbox'+id);
	var contentNode = $('#exercise_content');
	var contentValue = contentNode.val();
	if (true == ch.attr('checked')) {
		var pattern = new RegExp('\\[inlineChoice#'+id+'\\]', 'gi');
		contentValue = contentValue.replace(pattern, '');
	} else if (false == ch.attr('checked')) {
		var pattern = new RegExp('\\[gap#'+id+'\\]', 'gi');
		contentValue = contentValue.replace(pattern, '');
	}
	contentNode.val(contentValue);
	tr.parentNode.removeChild(tr);
}

function changeRowType(checkboxElement) {
	if (checkboxElement.checked) {
		$('#distractor' + checkboxElement.id.replace('checkbox','')).attr('disabled', false);
		$('#answer' + checkboxElement.id.replace('checkbox','')).attr('disabled', true);
		$('#feedback' + checkboxElement.id.replace('checkbox','')).attr('disabled', true);

	} else {
		$('#distractor' + checkboxElement.id.replace('checkbox','')).attr('disabled', true);
		$('#answer' + checkboxElement.id.replace('checkbox','')).attr('disabled', false);
		$('#feedback' + checkboxElement.id.replace('checkbox','')).attr('disabled', false);
	}
	
}

function add_answer_row() {
	
	var randid = Math.random();
	randid = String(randid);
	var rg = new RegExp('0.([0-9]*)',"gi");
	exec = rg.exec(randid);
	var id = 'id_' + exec[1];

	var newDiv = document.createElement('div');
	newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
	newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="260px" style="padding-right: 5px;"><input type="text" id="" name="answers[]" style="width: 100%; margin-right: 5px;" /></td><input type="hidden" id="id_" name="ids[]" value="' + id + '"/><td width="50px" align="center"><input type="radio" name="points[]" style="margin: 0; padding: 0;" /></td><td width="50px" align="center"><input id="" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td width="50px" align="left"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
	document.getElementById('answer_list').appendChild(newDiv);
	
}

function remove_answer_row(row) {

	var table = row.parentNode.parentNode.parentNode.parentNode;
	table.parentNode.removeChild(table);
	
}