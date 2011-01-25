tinyMCEPopup.requireLangPack();

var previousDialog = {
	
	init : function(ed) {
	
		var data = tinyMCEPopup.getWindowArg("data");
		
		document.getElementById('correct').value = data.answer;
		
	}

};

tinyMCEPopup.onInit.add(previousDialog.init, previousDialog);
