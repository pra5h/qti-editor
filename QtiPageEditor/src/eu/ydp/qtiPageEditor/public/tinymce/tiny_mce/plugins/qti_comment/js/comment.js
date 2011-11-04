tinyMCEPopup.requireLangPack();

var commentDialog = {
	init : function(ed) {
		
		var ed = ed;
		var f = document.forms[0]; 
		
		var comment_content = tinyMCEPopup.params.comment_content;
		var commented_text = tinyMCEPopup.params.commented_text;
		var comment_id = tinyMCEPopup.params.comment_id;
		
		if(commented_text == '' || commented_text == undefined) {
			tinyMCEPopup.close();
			return false;
		}
		
		if(comment_content == '' || comment_id == '') { // dodawanie
			
			var randid = Math.random();
			randid = String(randid);
			var rg = new RegExp('0.([0-9]*)',"gi");
			exec = rg.exec(randid);
			
			$('#comment_id').attr('value', exec[1]);
			$('#commented_text_div').html(commented_text);
			$('#commented_text').attr('value', commented_text);
			
			$('#comment_fieldset').append('<input type="hidden" name="addnew" value="1">');
			
			var removeButton = document.getElementById('remove_button');
			removeButton.parentNode.removeChild(removeButton);
			
			var insertButton = document.getElementById('insert');
			insertButton.setAttribute('value', 'Insert');
			
		} else {
			
			$('#commented_text_div').html(commented_text);
			$('#commented_text').attr('value', commented_text);
			$('#comment_id').attr('value', comment_id);
			$('#comment_content').attr('value', comment_content);
			
		}
		$('.focusedComment').focus();
	},

	insertComment : function(form) {
		
		var ed = tinyMCE.activeEditor;
		
		var comment_id = form.comment_id.value;
		var comment_content = form.comment_content.value;
		var commented_text = form.commented_text.value;
		comment_content = comment_content.replace(/([a-zA-Z0-9]{20})/gi,'$1 ');
		
		if(form.addnew != undefined) {
			
			ed.selection.moveToBookmark(ed.selection.getBookmark());
			commentTags = '<div id="ref_' + comment_id + '" class="mceNonEditable qy_comment" style="float: right; clear: both; border: 1px solid red; background-color: #f0f0f0; max-width: 20%;">' + comment_content + '</div>';
			commentTags += '<span id="' + comment_id + '" class="qy_comment" style="color: red; background-color: #f0f0f0">' + commented_text + '</span>';
			
			tinyMCE.execCommand('mceInsertContent', false, commentTags);
			
		} else {
			
			ed.selection.getNode().innerHTML = comment_content;
			
		}
		
		tinyMCEPopup.close();
		return true;
		
	}

};

tinyMCEPopup.onInit.add(commentDialog.init, commentDialog);

