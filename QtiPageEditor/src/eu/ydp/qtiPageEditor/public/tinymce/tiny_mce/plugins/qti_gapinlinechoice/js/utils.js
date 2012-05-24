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
							+'<img id="imgfeedback{number}" alt="Set feedback" title="Set feedback" onclick="feedback({number});" src="img/feedback.png"/>'
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

	$('#'+newId+'_add').show();
	
	if (null != row) {
		$('#answer'+newId).attr('value', stringDecode(row.answer));
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

	$('#'+identifier+'_add').val('Del');
	$('#'+identifier+'_add').attr('onClick', 'removeTagFromContentData('+identifier+')');
}

function removeExternalRowData(removeElement) {
	
	var ed = tinymce.EditorManager.activeEditor;
	var xh = ed.XmlHelper;
	var tr = removeElement.parentNode.parentNode;
	var id = tr.id;
	var ch = $('#checkbox'+id);
	var contentNode = $('#exercise_content');
	var contentValue = contentNode.val();
	var c = null;
	
	if (true == ch.attr('checked')) {
		var pattern = new RegExp('\\[inlineChoice#'+id+'\\]', 'gi');
		contentValue = contentValue.replace(pattern, '');
		var distractorData = tinymce.util.JSON.parse($('#distractorData'+id).val());
		
		if (undefined != distractorData) {
			var identifier = distractorData['identifier'];
			c = xh.getCorrectResponseNodeId(ed.dom.doc.body, identifier);
		}
	} else if (false == ch.attr('checked')) {
		var pattern = new RegExp('\\[gap#'+id+'\\]', 'gi');
		contentValue = contentValue.replace(pattern, '');
		var identifier = $('#identifier'+id).val();
		c = xh.getCorrectResponseNodeId(ed.dom.doc.body, identifier);
	}
	contentNode.val(contentValue);

	if (c != null) {
		c.parentNode.removeChild(c);
	}
	
	tr.parentNode.removeChild(tr);
}

function removeTagFromContentData(id) {

	var ed = tinymce.EditorManager.activeEditor;
	var xh = ed.XmlHelper;
	var ch = $('#checkbox'+id);
	var contentNode = $('#exercise_content');
	var contentValue = contentNode.val();
	var c = null;
	
	if (true == ch.attr('checked')) {
		var pattern = new RegExp('\\[inlineChoice#'+id+'\\]', 'gi');
		contentValue = contentValue.replace(pattern, '');
		var content = $('#distractorData'+id).val();
		
		if ('' != content) {
			var distractorData = tinymce.util.JSON.parse(content);
			var identifier = distractorData['identifier'];
			c = xh.getCorrectResponseNodeId(ed.dom.doc.body, identifier);
		}
	} else if (false == ch.attr('checked')) {
		var pattern = new RegExp('\\[gap#'+id+'\\]', 'gi');
		contentValue = contentValue.replace(pattern, '');
		var identifier = $('#identifier'+id).val();
		c = xh.getCorrectResponseNodeId(ed.dom.doc.body, identifier);
	}
	contentNode.val(contentValue);

	if (c != null) {
		c.parentNode.removeChild(c);
	}
	$('#'+id+'_add').val('Add'); //attr('disabled', true);
	$('#'+id+'_add').attr('onClick', 'applyExternalRowData('+id+')');
}

function changeRowType(checkboxElement) {
	if (checkboxElement.checked) {
		$('#distractor' + checkboxElement.id.replace('checkbox','')).attr('disabled', false);
		$('#answer' + checkboxElement.id.replace('checkbox','')).attr('disabled', true);
		$('#feedback' + checkboxElement.id.replace('checkbox','')).attr('disabled', true);
		$('#exercise_content').val($('#exercise_content').val().replace('[gap#'+checkboxElement.id.replace('checkbox','')+']',''));
		$('#'+checkboxElement.id.replace('checkbox','')+'_add').val('Add'); //attr('disabled', true);
		$('#'+checkboxElement.id.replace('checkbox','')+'_add').attr('onClick', 'applyExternalRowData('+checkboxElement.id.replace('checkbox','')+')');
		$('#imgfeedback'+checkboxElement.id.replace('checkbox','')).css('opacity', 0.4);

	} else {
		$('#distractor' + checkboxElement.id.replace('checkbox','')).attr('disabled', true);
		$('#answer' + checkboxElement.id.replace('checkbox','')).attr('disabled', false);
		$('#feedback' + checkboxElement.id.replace('checkbox','')).attr('disabled', false);
		$('#exercise_content').val($('#exercise_content').val().replace('[inlineChoice#'+checkboxElement.id.replace('checkbox','')+']',''));
		$('#'+checkboxElement.id.replace('checkbox','')+'_add').val('Add'); //attr('disabled', true);
		$('#'+checkboxElement.id.replace('checkbox','')+'_add').attr('onClick', 'applyExternalRowData('+checkboxElement.id.replace('checkbox','')+')');
		$('#imgfeedback'+checkboxElement.id.replace('checkbox','')).css('opacity', 1);
	}
	
}

function add_answer_row() {
	
	var randid = Math.random();
	randid = String(randid);
	var rg = new RegExp('0.([0-9]*)',"gi");
	exec = rg.exec(randid);
	var id = 'id_' + exec[1];
	var answers = $("input[name=answers[]]");
	var ansId = answers.length;
	var newDiv = document.createElement('div');
	newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
	newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="260px" style="padding-right: 5px;"><input type="text" id="answer_'+ansId+'" name="answers[]" style="width: 100%; margin-right: 5px;" /></td><input type="hidden" id="id_" name="ids[]" value="' + id + '"/><td width="50px" align="center"><input type="radio" name="points[]" style="margin: 0; padding: 0;" /></td><td width="50px" align="center"><input id="" type="checkbox" name="fixed[]" style="margin: 0; padding: 0;" /></td><td width="80px"><input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" /></td><td width="50px" align="left"><img src="img/feedback.png" onclick="feedback(this);" title="Set feedback" alt="Set feedback"/></td></tr></table>';
	document.getElementById('answer_list').appendChild(newDiv);
	tagInsert.init('answer_'+ansId);
	InputHelper.init($('#answer_'+ansId));
}

function remove_answer_row(row) {

	var table = row.parentNode.parentNode.parentNode.parentNode;
	table.parentNode.removeChild(table);
	
}

function validateGapInlineChoiceExercise(object) {
	var message = '';
	$(".validateInputError").each(function(){
		$(this).removeClass("validateInputError");
	});
	$(".validateTrError").each(function(){
		$(this).removeClass("validateTrError");
	});

	if ('' == object.question) {
		$('#question').addClass('validateInputError');
		message += '<li>Fill question field please.</li>';
	}

	if ('' == object.content) {
		$('#exercise_content').addClass('validateInputError');
		message += '<li>Fill content field please.</li>';
	}

	var isDistractorDataFail = false;
	var isGapDataFail = false;
	var isDistractorInserted = true;
	var isGapInserted = true;

	for ( var i = 0; i < object.inlineRows.length; i++) {

		switch(object.inlineRows[i].type) {

			case "gap":
	
				if ('' == object.inlineRows[i].answer) {
					$('#answer'+object.inlineRows[i].id).addClass('validateInputError');
					isGapDataFail = true;

				} else {
					var gapRgx = new RegExp('\\[gap#'+object.inlineRows[i].id+'\\]','gi');
				
					if (object.tags.length < object.inlineRows.length && !object.content.match(gapRgx)) {
						$('#'+object.inlineRows[i].id).addClass('validateTrError');
						isGapInserted = false;
					}
				}
				break;
	
			case "inlineChoice":
	
				if ("undefined" == typeof(object.inlineRows[i].data)) {
					$('#distractor'+object.inlineRows[i].id).addClass('validateInputError');
					isDistractorDataFail = true;

				} else {
					var inChRgx = new RegExp('\\[inlineChoice#'+object.inlineRows[i].id+'\\]','gi');

					if (object.tags.length < object.inlineRows.length && !object.content.match(inChRgx)) {
						$('#'+object.inlineRows[i].id).addClass('validateTrError');
						isDistractorInserted = false;
					}
				}
				break;
		}

	}

	if (isGapDataFail) {
		message += '<li>Fill answer fields please.</li>';
	}
	if (!isGapInserted) {
		message += '<li>Verify gaps with exercise content please, probably one or more gaps isn\'t inserted in content.</li>';
	}
	if (isDistractorDataFail) {
		message += '<li>Define distractors please.</li>';
	}
	if (!isDistractorInserted) {
		message += '<li>Verify distractors with exercise content please, probably one or more distractors isn\'t inserted in content.</li>';
	}


	if ('' != message) {
		$('#validator_errors').html('<ul>'+message+'</ul>');
		window.scrollTo($('#scroll').offset().left,$('#scroll').offset().top);
		return false;
	}
	return true;
}

function validateInlineChoiceExercise(object) {
	var message = '';
	
	$(".validateInputError").each(function(){
		$(this).removeClass("validateInputError");
	});
	
	if (object.answers.length < 1 && object.points.length < 1) {
		message += '<li>Define at least one answer please.</li>';
	
	} else {

		if (object.answers.length != object.points.length) {
			message += '<li>Fill all defined answers please.</li>';
			var answers = $("input[name=answers[]]");

			for ( var i in answers) {

				if ('' == answers[i].value) {
					$('#'+answers[i].id).addClass('validateInputError');
				}
			} 
		}

		if (object.points.length > 0) {
			var isCorrectAnswer = false;
	
			for ( var i = 0; i < object.points.length; i++) {

				if (1 == object.points[i]) {
					isCorrectAnswer = true;
				}
			}

			if (!isCorrectAnswer) {
				message += '<li>Set correct answer please.</li>'
				$('#div_points').addClass('validateInputError');
			}
		}

	}

	if ('' != message) {
		$('#validator_errors').html('<ul>'+message+'</ul>');
		window.scrollTo($('#scroll').offset().left,$('#scroll').offset().top);
		return false;
	}

	return true;
}

function getObjectLength(object) {
	var count = 0;
	
	for (var key in object) {
		if (object.hasOwnProperty(key)) {
            count++;
        }
	}
	return count;
}

function stringEncode(text) {
	return text.replace(/"/g, "&quot;");
}

function stringDecode(text) {
	return text.replace(/&quot;/g, "\"");
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

