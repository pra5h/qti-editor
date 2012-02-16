function tagInsertClass(){

	this.modifyOpacity = function(aid){		
			var txtCurrent = $("#"+aid).getSelection().text;
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
		var btns = $("<div id='taginsert_menu_"+id+"' class='taginsert_menu'>");
		var bbtn = $("<div class='taginsert_bold' onmousedown='tagInsert.selectionMark(\""+id+"\",\"b\")'></div>");
		var ibtn = $("<div class='taginsert_italic' onmousedown='tagInsert.selectionMark(\""+id+"\",\"i\")'></div>");
		var ubtn = $("<div class='taginsert_underline' onmousedown='tagInsert.selectionMark(\""+id+"\",\"u\")'></div>");
		var subbtn = $("<div class='taginsert_sub' onmousedown='tagInsert.selectionMark(\""+id+"\",\"sub\")'></div>");
		var supbtn = $("<div class='taginsert_sup' onmousedown='tagInsert.selectionMark(\""+id+"\",\"sup\")'></div></div>");
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
			var txtCurrent = $("#"+id).getSelection().text;
			if (txtCurrent != undefined  &&  txtCurrent != ""){
				$("#"+id).surroundSelectedText("<"+tag+">", "</"+tag+">");
				this.opacityTo(id, 0.3);
			}
		}
	};
}

var tagInsert = new tagInsertClass();