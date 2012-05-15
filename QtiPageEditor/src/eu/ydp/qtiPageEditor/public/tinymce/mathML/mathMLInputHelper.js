var InputHelper = {
	startIndex: null,
	startTag: null,
	endIndex: null,
	endTag: null,
	input: null,
	cloud: null,
	tagInsert : null,
	buttonNew : null,
	control : null,

	init: function(obj) {
		this.input = obj;
		this.input.onmouseover = this.mouseOver;
		this.input.onmousemove = this.mouseMove;
		this.input.onmouseout = this.mouseOut;
		this.input.oncontextmenu = this.onContextMenu;
		this.input.onclick = this.onClick;
		/*$(this.input).focusin(function(){
			InputHelper.buttonNew.parentElement.style.opacity = '';
			InputHelper.buttonNew.style.opacity = '1.0';
		});*/
		this.input.onfocus = this.onFocus;
		this.input.onblur = this.onBlur;
		/*
		$(this.input).focusout(function(){	
			InputHelper.buttonNew.style.opacity = '0.3';
		});
	*/
		this.tagInsert = document.getElementById('taginsert_menu_'+this.input.id);
		this.createPopup();
		if (null != this.tagInsert) {
			this.insertCSSFile('/res/skins/default/qtipageeditor/tinymce/mathML/mathml.css');
			this.insertButtonNew();
		}
		//this.createLogger();
	},
	
	onClick: function(e){
		InputHelper.enableButtonNew();
	},
	
	createLogger: function() {
		this.logger = document.createElement('div');
		this.logger.className = 'mathLogger';
		document.body.appendChild(this.logger);
	},
	
	createPopup: function() {
		this.cloud = document.createElement('div');
		this.cloud.className = 'mathPopup';
		document.body.appendChild(this.cloud);
	},
	
	onFocus: function(e) {
		InputHelper.enableButtonNew();
	},
	
	enableButtonNew: function() {
		var carretPos = InputHelper.getCaretPosition(InputHelper.input);
		var st = InputHelper.getStart(InputHelper.input.value,carretPos);
		var ed = InputHelper.getEnd(InputHelper.input.value,carretPos);

		if (null == st && null == ed) {
			InputHelper.buttonNew.parentElement.style.opacity = '1.0';
			InputHelper.buttonNew.style.opacity = '1.0';
			InputHelper.buttonNew.onclick = InputHelper.insertNewMath;
		} else {
			InputHelper.disableButtonNew();
		}
	},
	
	disableButtonNew: function() {
		InputHelper.buttonNew.style.opacity = '0.3';
		InputHelper.buttonNew.onclick = null;//disabled = true;
	},
	
	onBlur: function(e) {
		var elm = e.explicitOriginalTarget||e.srcElement||document.activeElement;
		if ('taginsert_math' != elm.className) {
			InputHelper.disableButtonNew();
		}
	},
	
	insertButtonNew : function() {
		this.buttonNew = document.createElement('div');
		this.buttonNew.className = 'taginsert_math';
		this.buttonNew.onclick = this.insertNewMath;
		this.input.parentElement.insertBefore(this.buttonNew, this.input);	
	},
	
	insertCSSFile : function(url) {
        var cssnode = document.createElement('link');
        cssnode.type = 'text/css';
        cssnode.rel = 'stylesheet';
        cssnode.href = url;
        this.input.parentElement.insertBefore(cssnode, this.input);
    },

    insertNewMath : function(e) {
    	var ed = tinymce.EditorManager.activeEditor;
    	var data = new Object();

    	data['offset'] = InputHelper.getCaretPosition(InputHelper.input);
    	data['input'] = InputHelper.input;
    	tinyMCE.execCommand('mceScienceInputFormulaInsert',false, data);
    },
    
	getStart: function (str,i) {
		str = str.substr(0, i);
		var s = str.split( '' ).reverse().join( '' );
		//this.set('startString',s);
		var m = s.match(/(>[b|i|u|htam]+<)/);

		if (null != m && undefined != typeof m[0]) {
			this.startTag = m[0].split( '' ).reverse().join( '' );
			this.startTagName = this.startTag.match(/<([b|i|u|math]+)>/)[1];
		}
		this.startIndex = str.lastIndexOf(this.startTag);
		//this.set('start',this.startIndex);
		if (-1 == this.startIndex) {
			return null;
		}
		
		var checkIdx = str.lastIndexOf('</'+this.startTagName+'>');
		
		if (-1 < checkIdx && checkIdx > this.startIndex) {
			return null;
		}

		return this.startIndex;
	},

	getEnd: function (str,i) {

		str = str.substr(i, str.length-i);
		//var m = str.match(/(\<\/[b|i|u|htam]+\>)/);
		var m = str.match(/(\<\/[b|i|u|math]+\>)/);
		if (null != m && undefined != typeof m[0]) {
			this.endTag = m[0];
			//this.endTagName = this.endTag.match(/\<\/([b|i|u|htam]+)\>/)[1];
			this.endTagName = this.endTag.match(/\<\/([b|i|u|math]+)\>/)[1];

		}
		var checkIdx = null;		
		if (0 <= str.indexOf(this.endTag)) {
			this.endIndex = str.indexOf(this.endTag);
			this.endIndex += this.endTag.length+i;
			checkIdx = str.indexOf('<'+this.endTagName+'>');
		} else {
			return null;
		}
		
		if (-1 < checkIdx && (checkIdx+i) < this.endIndex) {
			return null;
		}

		return this.endIndex;
	},

	onContextMenu: function (e) {
		//console.dir(InputHelper);

		if ('' != InputHelper.cloud.innerHTML) {
			InputHelper.cloud.style.display = 'none';
			InputHelper.control = document.createElement('div');
			InputHelper.control.className = 'mathContextMenuControl';
			InputHelper.control.innerHTML = '<div>remove</div><div>modify</div>';
			InputHelper.control.style.left = e.pageX+'px';
			InputHelper.control.style.top = e.pageY+'px';
			document.body.onmousedown = function(e) {
				if (null != InputHelper.control) {
					InputHelper.control.parentNode.removeChild(InputHelper.control);
					InputHelper.control = null;
				}
			}
			InputHelper.control.firstElementChild.onmousedown = function(e) {
				
				var math = InputHelper.cloud.innerHTML;
				InputHelper.input.value = InputHelper.input.value.replace(math, '');
				InputHelper.control.parentNode.removeChild(InputHelper.control);
				InputHelper.control = null;
				e.preventDefault();
			}
			document.body.appendChild(InputHelper.control);
			e.preventDefault();
		}

		InputHelper.control.lastElementChild.onmousedown = function(e) {

			var ed = tinymce.EditorManager.activeEditor;
			var math = InputHelper.cloud.innerHTML;
			math = math.replace(/<math[^>]*>/,'');
			math = math.replace(/<\/math>/,'');
			var data = new Object();

			if ('' != InputHelper.cloud.innerHTML) {
				data['xml'] = math;
				data['input'] = InputHelper.input;
				tinyMCE.execCommand('mceScienceInputFormulaModify',false, data);
				e.preventDefault();
			}
		}
		document.body.appendChild(InputHelper.control);
		e.preventDefault();
	},

	
	mouseOver: function (e) {
		var div = InputHelper.cloud; //.lastElementChild;
		div.style.position = 'absolute';
		div.style.left = e.pageX+10+'px';
		div.style.top = e.pageY+1+'px';
		//div.style.background = 'yellow';
		div.style.display = 'block';
		//div.style.padding = '10px';
		
	},

	mouseMove: function (e) {
		if (null == InputHelper.control) {
			var div = InputHelper.cloud;
			div.style.left = e.pageX+10+'px';
			div.style.top = e.pageY+1+'px';
			var st = InputHelper.getStart(this.value,e.rangeOffset);
			var ed = InputHelper.getEnd(this.value,e.rangeOffset);
			//InputHelper.set('startTag', InputHelper.startTagName);
			//InputHelper.set('endTag', InputHelper.endTagName);
			
			if (null != st && null != ed && (InputHelper.startTagName == InputHelper.endTagName)) {
				//InputHelper.set('content',this.value.substr(st, ed-st));
				div.innerHTML = this.value.substr(st, ed-st);
				
				if ('' != div.innerHTML) {
					div.style.display = 'block';
				}
			} else {
//				div.innerHTML = '';
				div.style.display = 'none';
			}
		}
	},

	mouseOut: function (e) {
		var div = InputHelper.cloud;
		div.style.display = 'none';
	//	div.innerHTML = '';
		//InputHelper.clear();
	},

	set: function (id, t) {
		document.getElementById(id).textContent = t;
	},
	
	getCaretPosition : function (el) { 
		  if (el.selectionStart) { 
		    return el.selectionStart; 
		  } else if (document.selection) { 
		    el.focus(); 

		    var r = document.selection.createRange(); 
		    if (r == null) { 
		      return 0; 
		    } 

		    var re = el.createTextRange(), 
		        rc = re.duplicate(); 
		    re.moveToBookmark(r.getBookmark()); 
		    rc.setEndPoint('EndToStart', re); 

		    return rc.text.length; 
		  }  
		  return 0; 
		}

}