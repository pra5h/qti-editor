tinyMCEPopup.requireLangPack();

var applinkDialog = {
	init : function(ed) {
		
		var ed = ed;
		var f = document.forms[0]; 
		var applink_lid = tinyMCEPopup.getWindowArg("applink_lid");
		var applink_title = tinyMCEPopup.getWindowArg("applink_title");
		var applink_value = tinyMCEPopup.getWindowArg("applink_value");
		
		if(applink_lid != '' || applink_title != '') {
			
			f.lid_input.value = applink_lid;
			f.title_input.value = applink_title;
			f.value_input.value = applink_value;
		
		} else {
			
			document.getElementById('applink_metadata').innerHTML += '<input type="hidden" name="addnew" value="1">';
			
			f.value_input.value = applink_value;
			
			var removeButton = document.getElementById('remove_button');
			removeButton.parentNode.removeChild(removeButton);
			
			var insertButton = document.getElementById('insert');
			insertButton.setAttribute('value', 'Insert');
			
		}
		
	},

	insertApplink : function(form) {
		
		var ed = tinymce.EditorManager.activeEditor;
		var applink_lid = form.lid_input.value;
		var applink_title = form.title_input.value;
		var applink_value = form.value_input.value;
		
		if(applink_value != '' && applink_lid != '' && applink_title != '') {
			ed.selection.moveToBookmark(ed.selection.getBookmark());
			if(form.addnew != undefined && form.addnew.getAttribute('value') == '1') {
				var applinkTag = '<applink lid="' + applink_lid + '" title="' + applink_title + '">' + applink_value + '</applink>';
				tinyMCE.execCommand('mceInsertContent', false, applinkTag);
			} else {
				var applinkTag = ed.selection.getNode();
				applinkTag.innerHTML = applink_value;
				applinkTag.setAttribute('lid', applink_lid);
				applinkTag.setAttribute('title', applink_title);
			}
		}
		tinyMCEPopup.close();
		return true;
		
	}

};

tinyMCEPopup.onInit.add(applinkDialog.init, applinkDialog);

