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
		var bbtn = $("<div class='taginsert_bold' onmousedown='tagInsert.selectionMark(\""+id+"\",\"b\")'></div>");
		var ibtn = $("<div class='taginsert_italic' onmousedown='tagInsert.selectionMark(\""+id+"\",\"i\")'></div>");
		var ubtn = $("<div class='taginsert_underline' onmousedown='tagInsert.selectionMark(\""+id+"\",\"u\")'></div>");
		var subbtn = $("<div class='taginsert_sub' onmousedown='tagInsert.selectionMark(\""+id+"\",\"sub\")'></div>");
		var supbtn = $("<div class='taginsert_sup' onmousedown='tagInsert.selectionMark(\""+id+"\",\"sup\")'></div>");
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
			if (txtCurrent != undefined  &&  txtCurrent != ""){
				this.replaceSelection(id, tag);
				this.opacityTo(id, 0.3);
			}
		}
	};
	
	this.replaceSelection = function(id, tag){
		if (getInternetExplorerVersion() != -1){
			var ieSelection = document.selection.createRange();
			ieSelection.text = "<"+tag+">" + ieSelection.text + "</"+tag+">";
		} else {
			var el = document.getElementById(id);
			var s = el.selectionStart;
			var e = el.selectionEnd;
			el.value = el.value.substr(0, s) + "<"+tag+">" + el.value.substr(s,e-s) + "</"+tag+">" + el.value.substr(e);
		}
	};
	
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
}

var tagInsert = new tagInsertClass();
