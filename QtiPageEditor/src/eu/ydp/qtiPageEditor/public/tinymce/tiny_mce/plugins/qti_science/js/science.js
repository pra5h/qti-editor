
var scienceDialog = {
	windowId : null,
	mathXml : null,
	mathEditor : null,
	actionType : null,
	type : null,
	input : null,
	offset : null,
	gwtDialogBox: null,
	
	init : function(ed) {
		document.body.setAttribute('onUnload',"tinymce.DOM.remove('mcePopupLayer_'+scienceDialog.windowId);");
		document.body.setAttribute('onLoad',"scienceDialog.windowId = lock(tinyMCEPopup.id);");
		this.mathXml = tinyMCEPopup.getWindowArg("mathXml");
		this.type = tinyMCEPopup.getWindowArg("type");

		if (1 == this.type) {
			this.input = tinyMCEPopup.getWindowArg("input");
			this.offset = tinyMCEPopup.getWindowArg("offset");
			this.gwtDialogBox = $('.gwt-DialogBox',this.input.ownerDocument.body);
		} else if (2 == this.type) {
			this.input = tinyMCEPopup.getWindowArg("input");
			this.gwtDialogBox = $('.gwt-DialogBox',this.input.ownerDocument.body);
		}
		
		if (null != this.gwtDialogBox) {
			this.gwtDialogBox.css('display', 'none');
		}

		ed.windowManager.onClose.add(this.close, this);
	},
	
	close: function() {
		if (null != this.gwtDialogBox) {
			this.gwtDialogBox.css('display', 'block');
		}
		var ed = tinymce.EditorManager.activeEditor;
		$(this.input).focus();
		ed.windowManager.onClose.remove(this.close);
		tinyMCEPopup.close();
	},
	
	initMathEditor: function(me) {
		this.mathEditor = me;
		if (undefined == this.mathXml) {
			this.mathXml = '<mrow></mrow>';
			this.actionType = 1;
		} else {
			$('#save_mathContent').val('Modify');
			this.actionType = 0;
		}
		this.mathEditor.setMathML(this.mathXml);
	},

	insertScienceSection : function() {
		var ed = tinymce.EditorManager.activeEditor;		
		var data = this.mathEditor.getMathML();
		//data = $('<div/>').html('<math>'+data+'</math>').html();
		data = $('<div/>').html(data).html();

		if (0 == this.type) {
			var dom = ed.dom;
			ed.execCommand('mceAddUndoLevel');


			if (this.actionType == 1) {

				var patt = '';
				ed.execCommand('mceInsertContent', false, '<br class="_mce_marker" />');

				tinymce.each('h1,h2,h3,h4,h5,h6,p'.split(','), function(n) {

					if (patt) {
						patt += ',';
					}
					patt += n + ' ._mce_marker';
				});

				tinymce.each(dom.select(patt), function(n) {
					ed.dom.split(ed.dom.getParent(n, 'h1,h2,h3,h4,h5,h6,p'), n);
				});

				dom.setOuterHTML(dom.select('._mce_marker')[0], '<p>&nbsp;</p><div id="mathML" class="mceNonEditable"><math xmlns="http://www.w3.org/1998/Math/MathML">'+data+'</math></div><p>&nbsp;</p><span id="focus">_</span>');
				ed.focusAfterInsert('focus');
			} else {
				var nd = tinyMCE.selectedNode;	

				while(nd.nodeName != 'DIV') {
					nd = nd.parentNode;
				}

				nd.innerHTML = '<math xmlns="http://www.w3.org/1998/Math/MathML">'+data+'</math>';
				ed.focusAfterModify(nd);
			}
			ed.execCommand('mceEndUndoLevel');
		} else if (1 == this.type) {
			//insert new
			var prefix = this.input.value.substr(0, this.offset);
			var suffix = this.input.value.substr(this.offset, this.input.value.length-this.offset);
			
			if ('<mrow></mrow>' != data) {
				this.input.value = prefix+'<math>'+data+'</math>'+suffix;
				this.input.focus();
			}
			
		} else if (2 == this.type) {
			this.input.value = this.input.value.replace(this.mathXml, data);
			this.input.focus();
		}
		//tinyMCEPopup.close();
		this.close();
		return true;
	},
	
	loadScript: function(url, callback) {
		var script = document.createElement("script")
		script.type = "text/javascript";

	    if (script.readyState){  //IE
	        script.onreadystatechange = function(){
	            if (script.readyState == "loaded" ||
	                    script.readyState == "complete"){
	                script.onreadystatechange = null;
	                callback();
	            }
	        };
	    } else {  //Others
	        script.onload = function(){
	            callback();
	        };
	    }

		script.src = url;
		document.getElementsByTagName("head")[0].appendChild(script);
	}
};

tinyMCEPopup.onInit.add(scienceDialog.init, scienceDialog);

