var preview = null;
var mathPreview = null;

function createMathPreview() {
	mathPreview = $('<div>');
	mathPreview.addClass('mathPreview');
	mathPreview.appendTo(document.body);
	mathPreview.hide();
};

function createPreview() {
	var html = '<div id="inputPreviewContener">'
				+'<div id="inputPreviewLayer"></div>'
				+'<div id="inputPreview">'
					+'<div id="inputPreviewBody">'
						+'<div id="inputPreviewClose"></div>'
						+'<div id="inputPreviewContent"></div>'
					+'</div>'
				+'</div>'
				+'</div>';
	preview = $(html);
	preview.appendTo(document.body);
	preview.hide();
	$('#inputPreviewClose', preview).click(function(e){preview.close();});
	preview.setHtml = function(html,x,y) {
		html = html.replace(/\n/g,'<br/>');
		this.css('top', y-20+'px');
		$('#inputPreviewContent', this).html(html);
		this.show();
	};
	
	preview.close = function() {
		$('#inputPreviewContent', this).html('');
		this.hide();
	}
};

function getCaretPosition(el) { 
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
};


function setCaretPosition(object, pos) {
	if ($(object).get(0).setSelectionRange) {
		$(object).get(0).setSelectionRange(pos, pos);
	} else if ($(object).get(0).createTextRange) {
		var range = $(object).get(0).createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
};

function mathInputHelperClass() {
	/*
	this.id = null;
	this.startTag = null;
	this.startTagName = null;
	
	this.endTag = null;
	this.endTagName = null;
	this.control = null;
	this.buttonNew = null;
	this.input = null;
	*/
	this.init = function(obj) {
		var instance = this;
		instance.id = Math.random();
		instance.input = $(obj);
		
		if (null == mathPreview) {
			createMathPreview();
		}
		if (null == preview) {
			createPreview();
		}
		instance.input.mouseover(instance.mouseOver);
		instance.input.mouseout(instance.mouseOut);
		instance.input.bind('mousemove',instance, instance.mouseMove);
		instance.insertButtonNew();
		//Media button
		if ('mediaHelper' == instance.buttonNew.next().attr('id')) {
			instance.buttonMedia = instance.buttonNew.next();
		}
		
		instance.input.bind('contextmenu',{input: instance.input, media: instance.buttonMedia}, function(e){
			instance.onContextMenu(e);
		});
		instance.input.bind('focus', {math: instance.buttonNew, media: instance.buttonMedia}, function(e){
			//var button = e.data.math;
			instance.enableMenuButtons(e.target, e.data.math, e.data.media);
		});
		instance.input.bind('blur', {math: instance.buttonNew, media: instance.buttonMedia}, function(e) {
			
			var elm = e.originalEvent.explicitOriginalTarget; //||e.srcElement||document.activeElement;
			
			if (!$(elm).hasClass('taginsert_math') && !$(elm).hasClass('mediahelper')) {
				//var button = e.data.math;
				instance.disableMenuButtons(e.data.math, e.data.media);
			}
		});
		instance.input.bind('click', {math: instance.buttonNew, media: instance.buttonMedia}, function(e){
			//var button = e.data;
			instance.enableMenuButtons(e.target, e.data.math, e.data.media);
		});
		
		instance.input.keypress(function(e) {

			if (e.shiftKey && 60 == e.which) {
				var pos = getCaretPosition(this);
				this.value = this.value.substr(0, pos)+'&lt;'+this.value.substr(pos);
				setCaretPosition(this, pos+4);
				e.preventDefault();
			} else if (e.shiftKey && 62 == e.which) {
				var pos = getCaretPosition(this);
				this.value = this.value.substr(0, pos)+'&gt;'+this.value.substr(pos);
				setCaretPosition(this, pos+4);
				e.preventDefault();
			}
		});
	};
	
	this.onContextMenu = function (e) {
		var input = e.data.input;
		
		if ('block' == preview.css('display')) {
			e.preventDefault();
			return;
		}
		var control = $('<div>');
		control.attr('id', 'mathContextMenuControl');
		control.addClass('mathContextMenuControl');
		control.html('<div>preview</div>');
		control.css('left', e.pageX+'px');
		control.css('top', e.pageY+'px');
		
		$(document.body).mousedown(function(e) {

			if (null != control) {
				control.remove();
			}
		});
		
		if ('' != mathPreview.html()) {
			mathPreview.hide();
			control.html('<div>remove</div><div>modify</div><div>preview</div>');

			$('div:first-child', control).mousedown(function(e) {
				var math = mathPreview.html();
				input.val(input.val().replace(math, ''));
				control.remove();
				e.preventDefault();
			});
			
			$('div:nth-child(2)', control).mousedown(function(e) {
				var ed = tinymce.EditorManager.activeEditor;
				var math = mathPreview.html();
				math = math.replace(/<math[^>]*>/,'');
				math = math.replace(/<\/math>/,'');
				var data = new Object();

				if ('' != mathPreview.html()) {
					data['xml'] = math;
					data['input'] = input.get(0);
					tinyMCE.execCommand('mceScienceInputFormulaModify',false, data);
					e.preventDefault();
				}
			});
			
			$('div:last-child', control).mousedown(function(e) {
				preview.setHtml(input.val(), e.pageX, e.pageY);
				e.preventDefault();
			});
			$(document.body).append(control);
			e.preventDefault();
		} else {

			if ('' != input.val()) {
				control.html('<div>preview</div>');
				
				var start = this.getStartIndexOfMediaPhrase(input, e.originalEvent.rangeOffset);
				var mediaPhrase = this.getMediaPhrase(input, e.originalEvent.rangeOffset);
				
				//if (null != mediaPhrase && buttonMedia.length > 0) {
				if (null != mediaPhrase && undefined != e.data.media) {
					control.html(control.html()+'<div>modify media</div><div>remove media</div>');
					
					$('div:nth-child(2)', control).mousedown(function(e) {
						var data = new Object();
						data['media'] = mediaPhrase;
						data['input'] = input.get(0);
						data['type'] = 'modify';
						data['src'] = mediaPhrase.match(/src="([^"]*)"/)[1];
						data['title'] = mediaPhrase.match(/alt="([^"]*)"/)[1];
						tinyMCE.execCommand('mceAppendImageToInput',false, data);
						e.preventDefault();
					});
					
					$('div:last-child', control).mousedown(function(e) {
						input.val(input.val().replace(mediaPhrase, ''));
						control.remove();
						setCaretPosition(input, start);
						e.preventDefault();
					});
				}
				
				$('div:first-child', control).mousedown(function(e) {
					preview.setHtml(input.val(), e.pageX, e.pageY);
				});

				$(document.body).append(control);
				e.preventDefault();
			}
		};
	};
	
	this.getMediaPhrase = function(input, offset) {
		var start = this.getStartIndexOfMediaPhrase(input, offset);

		if (null != start) {
			var tmpString = input.val().substr(start);
			var res = tmpString.match(/<img[^>]+>/g);
			var phraseLength = res[0].length;

			if ((start+phraseLength) > offset) {
				return res[0];
			}
		}
		return null;
	};
	
	this.getStartIndexOfMediaPhrase = function(input, offset) {
		var str = input.val().substr(0, offset+3);
		var start = str.lastIndexOf("<img");

		if (start > 0 && start<offset) {
			return start;
		}
		return null;
	};
	
	this.insertButtonNew = function() {
		this.buttonNew = $('<div>');
		this.buttonNew.addClass('taginsert_math');
		this.buttonNew.css('opacity', '0.3');
		var panel = $('#taginsert_menu_'+this.input.attr('id'));
		//this.buttonNew.insertBefore(this.input);
		this.buttonNew.insertAfter(panel);
		
		this.buttonNew.bind('click', this.input, this.insertNewMath);
	};
	
	this.insertNewMath = function(e) {
		var o = e.data;
		if($(this).data('active')) {
			var ed = tinymce.EditorManager.activeEditor;
			var data = new Object();

			data['offset'] = getCaretPosition(o.get(0));
			data['input'] = o.get(0);
			tinyMCE.execCommand('mceScienceInputFormulaInsert',false, data);
		}
    },

	this.mouseOver = function (e) {
    	
    	if (null == $('#mathContextMenuControl').get(0)) {
    		if ('' != mathPreview.html()) {
    			mathPreview.css('position','absolute');
    			mathPreview.css('left', e.pageX-mathPreview.width()-25+'px');
    			mathPreview.css('top', e.pageY+'px');
    			mathPreview.show();
    			mathPreview.html('');
    		}
    	}
	};
	
	this.mouseMove = function (e) {
		var object = e.data;
		if (null == $('#mathContextMenuControl').get(0)) {
			
			var st = object.getStart(this.value, e.originalEvent.rangeOffset);
			var ed = object.getEnd(this.value, e.originalEvent.rangeOffset);

			if (null != st && null != ed && (object.startTagName == object.endTagName)) {
				mathPreview.html(this.value.substr(st, ed-st));

				if ('' != mathPreview.html()) {
					mathPreview.css('left', e.pageX-mathPreview.width()-25+'px');
					mathPreview.css('top', e.pageY+'px');
					mathPreview.css('width', $(mathPreview).children(':first-child').get(0).scrollWidth+'px');
					mathPreview.show();
				}
			} else {
				mathPreview.hide();
			}
		}
	};
	
	this.mouseOut = function (e) {
		mathPreview.hide();
	};
	
	this.getStart = function (str,i) {
		str = str.substr(0, i);
		var s = str.split( '' ).reverse().join( '' );
		var m = s.match(/(>(htam)+<)/);

		if (null != m && undefined != typeof m[0]) {
			this.startTag = m[0].split( '' ).reverse().join( '' );
			this.startTagName = this.startTag.match(/<((math)+)>/)[1];
		}
		this.startIndex = str.lastIndexOf(this.startTag);

		if (-1 == this.startIndex) {
			return null;
		}
		
		var checkIdx = str.lastIndexOf('</'+this.startTagName+'>');
		
		if (-1 < checkIdx && checkIdx > this.startIndex) {
			return null;
		}

		return this.startIndex;
	};
	
	this.getEnd = function (str,i) {

		str = str.substr(i, str.length-i);
		var m = str.match(/(\<\/(math)+\>)/);

		if (null != m && undefined != typeof m[0]) {
			this.endTag = m[0];
			this.endTagName = this.endTag.match(/\<\/((math)+)\>/)[1];
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
	};
	
	this.enableMenuButtons = function(input, buttonMath, buttonMedia) {
		var carretPos = getCaretPosition(input);
		var st = this.getStart(input.value,carretPos);
		var ed = this.getEnd(input.value,carretPos);
		var mediaPhrase = this.getMediaPhrase($(input), carretPos);
		
		if (null == st && null == ed && null == mediaPhrase) {
			buttonMath.css('opacity', '1.0');
			buttonMath.data('active', true);//('click', input, this.insertNewMath);
		
			if (undefined != buttonMedia) {
				buttonMedia.css('opacity', '1.0');
				buttonMedia.data('active', true);
			}

		} else {
			this.disableMenuButtons(buttonMath, buttonMedia);
		}
	};
	
	this.disableMenuButtons = function(buttonMath, buttonMedia) {
		buttonMath.css('opacity', '0.3');
		//button.unbind('click');
		buttonMath.data('active', false);
		
		if (undefined != buttonMedia) {
			buttonMedia.css('opacity', '0.3');
			buttonMedia.data('active', false);
		}
	};
}

function insertCSSFile(url) {
    var cssnode = document.createElement('link');
    cssnode.type = 'text/css';
    cssnode.rel = 'stylesheet';
    cssnode.href = url;
    $(document.head).append(cssnode);
}

var InputHelper = new mathInputHelperClass();
insertCSSFile('/res/skins/default/qtipageeditor/tinymce/mathML/mathml.css');