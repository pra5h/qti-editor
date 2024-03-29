function getInternetExplorerVersion()
{
   var rv = -1; // Return value assumes failure.
   if (navigator.appName == 'Microsoft Internet Explorer')
   {
      var ua = navigator.userAgent;
      var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) != null)
         rv = parseFloat( RegExp.$1 );
   }
   return rv;
}

function tagInsertClass(){

	this.modifyOpacity = function(aid){		
			var txtCurrent = this.getSelection(aid);
			if (txtCurrent != undefined  &&  txtCurrent != ""){
				this.opacityTo(aid, 1);
			} else {
				this.opacityTo(aid, 0.3);
			}
		};
		
	this.opacityTo = function(aid, value){
		$("#taginsert_menu_"+aid).children().css({ opacity: value });
	};

	this.init = function(id){
		var currId = id;
		var btns = $("<div id='taginsert_menu_"+id+"' class='taginsert_menu'/>");
		var bbtn = $("<div class='taginsert_bold' onmousedown='return tagInsert.selectionMark(\""+id+"\",\"b\")'></div>");
		var ibtn = $("<div class='taginsert_italic' onmousedown='return tagInsert.selectionMark(\""+id+"\",\"i\")'></div>");
		var ubtn = $("<div class='taginsert_underline' onmousedown='return tagInsert.selectionMark(\""+id+"\",\"u\")'></div>");
		var subbtn = $("<div class='taginsert_sub' onmousedown='return tagInsert.selectionMark(\""+id+"\",\"sub\")'></div>");
		var supbtn = $("<div class='taginsert_sup' onmousedown='return tagInsert.selectionMark(\""+id+"\",\"sup\")'></div>");
		var btnsArr = [bbtn, ibtn, ubtn, subbtn, supbtn];
		for (var i = 0 ; i < btnsArr.length ; i ++){
			btnsArr[i].css({ opacity: 0.3 });
			btns.append(btnsArr[i]);
		}
		$("#"+id).parent().prepend(btns);
		
		var instance = this;
		
		$("#"+id).select(function(){	
			instance.modifyOpacity(currId);
		});
		$("#"+id).focusin(function(){	
			instance.modifyOpacity(currId);
		});
		$("#"+id).focusout(function(){	
			instance.opacityTo(currId, 0.3);
		});
		$("#"+id).click(function(){	
			instance.modifyOpacity(currId);
		});
		$("#"+id).keyup(function(){	
			instance.modifyOpacity(currId);
		});
	};

	this.selectionMark = function(id, tag){
		var elem = $("#"+id).get();
		if (elem[0] === document.activeElement){
			var txtCurrent = this.getSelection(id);
			var oldLength = $('#'+id).val().length;
			var start = this.getSelectionStart(id);
			if (txtCurrent != undefined  &&  txtCurrent != ""){
				var scrollTop = document.activeElement.scrollTop;
				this.replaceSelection(id, tag);
				this.opacityTo(id, 0.3);
				document.activeElement.scrollTop = scrollTop;
			}
			
			var newLength = $('#'+id).val().length;
			var offset = tag.length+2;
			var res = Math.abs(oldLength-(newLength-(2*tag.length+5)));
			var begin = 0;
			var end = 0;
			if (0 != res) {
				begin = $('#'+id).val().indexOf(txtCurrent);
				end = begin+txtCurrent.length;
			} else {
				begin = start+offset;
				end = start+txtCurrent.length+offset;
			}
			this.setSelection(id, begin, end);
			return false;
		}
	};
	
	this.replaceSelection = function(id, tag){
		if (getInternetExplorerVersion() != -1){
			var ieSelection = document.selection.createRange();
			var selectionText = this.processSelection(ieSelection.text, tag);
			ieSelection.text = selectionText ;
		} else {
			var el = document.getElementById(id);
			var s = el.selectionStart;
			var e = el.selectionEnd;
			var selectionText = this.processSelection(el.value.substr(s,e-s), tag);
			el.value = el.value.substr(0, s) + selectionText +  el.value.substr(e);
		}
		this.removeTagsFromSubSup(id);
		this.removeSubSupFromParentTags(id);
	};
	
	this.processSelection = function(text, tag){
		if (text.indexOf("<sub>") == -1  &&  text.indexOf("<sup>") == -1  &&
			text.indexOf("</sub>") == -1  &&  text.indexOf("</sup>") == -1)
			return "<" + tag + ">" + text + "</" + tag + ">";
		return text;
	};
	
	this.removeTagsFromSubSup = function(id){
		var el = document.getElementById(id);
		var text = el.value;		
		var specialTags = ["sub", "sup"];
		for (var t = 0 ; t < specialTags.length ; t ++){
			var startSearchFrom = 0;
			var currOpenTag = "<"+specialTags[t]+">";
			var currCloseTag = "</"+specialTags[t]+">";
			while (text.indexOf(currOpenTag, startSearchFrom) != -1){
				var openTagPos = text.indexOf(currOpenTag, startSearchFrom);
				var closeTagPos = text.indexOf(currCloseTag, openTagPos);
				if (closeTagPos == -1)
					break;
				var secondOpenTagPos = text.indexOf(currOpenTag, openTagPos+1);
				if (secondOpenTagPos != -1  &&  secondOpenTagPos < closeTagPos){
					secondCloseTagPos = text.indexOf(currCloseTag, closeTagPos+1);
					if (secondCloseTagPos != -1){
						closeTagPos = secondCloseTagPos;
					}
				}
				var value = text.substring(openTagPos+currOpenTag.length, closeTagPos);
				value = value.replace(new RegExp(/<[^>]+>/g), "");
				text = text.substring(0, openTagPos+currOpenTag.length) + 
					value + 
					text.substring(closeTagPos);
				startSearchFrom = closeTagPos+currCloseTag.length;
			}
		}
		el.value = text;
	}
		
	this.removeSubSupFromParentTags = function(id){
		var el = document.getElementById(id);
		var text = el.value;
		var specialTags = ["sub", "sup"];
		var allowedTags = ["b", "u", "i"];
		var specialAreas = [];
		var specialAreas2 = [];
		for (var t = 0 ; t < specialTags.length ; t ++){
			var currOpenTag = "<"+specialTags[t]+">";
			var currCloseTag = "</"+specialTags[t]+">";
			var startSearchFrom = 0;
			while (text.indexOf(currOpenTag, startSearchFrom) != -1){
				var openTagPos = text.indexOf(currOpenTag, startSearchFrom);
				var closeTagPos = text.indexOf(currCloseTag, openTagPos);
				if (closeTagPos == -1)
					break;
				var currArea = {from: openTagPos, to:closeTagPos+currCloseTag.length};
				specialAreas.push(currArea);
				startSearchFrom = closeTagPos;
			}
		}
		// merge areas
		for (var a = 0 ; a < specialAreas.length-1 ; a ++){
			for (var b = a+1 ; b < specialAreas.length ; b ++){
				if (specialAreas[a] != null  &&  specialAreas[b] != null  &&  specialAreas[a].to == specialAreas[b].from){
					specialAreas[a].to = specialAreas[b].to;
					specialAreas[b] = null;
				}
			}
		}
		// remove dead entries
		for (var a = 0 ; a < specialAreas.length ; a ++){
			if (specialAreas[a] != null){
				specialAreas2.push(specialAreas[a]);
			}
		}
		
		for (var a = 0 ; a < allowedTags.length ; a ++ ){
			var currTag = allowedTags[a];
			var currOpenTag = "<"+currTag+">";
			var currCloseTag = "</"+currTag+">";
			var startSearchFrom = 0;
			while (text.indexOf(currOpenTag, startSearchFrom) != -1){
				var openTagPos = text.indexOf(currOpenTag, startSearchFrom);
				var closeTagPos = text.indexOf(currCloseTag, openTagPos);
				if (closeTagPos == -1)
					break;
				for (var s = 0 ; s < specialAreas2.length ; s ++){
					if (specialAreas2[s].from > openTagPos  &&  specialAreas2[s].to <= closeTagPos){
						text = text.substring(0, openTagPos) + 
							text.substring(openTagPos+currOpenTag.length,closeTagPos) +
							text.substring(closeTagPos+currCloseTag.length);
						break;
					}
				}
				startSearchFrom = closeTagPos;
			}
		}
		el.value = text;		
	}
	
	this.getSelection = function(id){
		if (getInternetExplorerVersion() != -1){
			var ieSelection = document.selection.createRange();
			return ieSelection.text;
		} else {
			var el = document.getElementById(id);
			var s = el.selectionStart;
			var e = el.selectionEnd;
			return el.value.substr(s,e-s);
		}
		return "";
	};
	
	this.getSelectionStart = function(id) {
		
		if (getInternetExplorerVersion() == -1){
			var el = document.getElementById(id);
			return el.selectionStart;
		}
		return 0;
	};
	
	this.setSelection = function(id, start, end) {
		if ($('#'+id).get(0).setSelectionRange) {
			$('#'+id).get(0).focus();
			$('#'+id).get(0).setSelectionRange(start, end);
		} else if ($('#'+id).get(0).createTextRange) {
			var range = $('#'+id).get(0).createTextRange();
			range.collapse(true);
			range.moveEnd('character', end);
			range.moveStart('character', start);
			range.select();
		}
		this.modifyOpacity(id);
	};
}

var tagInsert = new tagInsertClass();
