var AMTcgiloc = "http://www.imathas.com/cgi-bin/mimetex.cgi";

tinyMCE.init({
	convert_urls: false,
	theme : "advanced",
	mode: "textareas",
	elements : "content",
	skin : "o2k7",
	inGuestRole : 0,
	
	//spellchecker, asciimath,asciimathcharmap,
	//qti_science,
	plugins : "safari,pagebreak,layer,table,save,advhr,emotions,iespell,inlinepopups,"
		+"insertdatetime,qti_empiriapreview,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,"
		+"visualchars,nonbreaking,xhtmlxtras,template,imagemanager,filemanager,asciisvg,"
		+"qti_pagetitle,qti_choice,qti_gapinlinechoice,qti_fileuploadlib,"
		+"qti_addvideo,qti_copyqti,qti_selection,qti_newline,qti_science",
		
	/*
	plugins : "safari,spellchecker,pagebreak,style,layer,table,save,advhr,advlink,emotions,iespell,inlinepopups,"
		+"insertdatetime,qti_preview,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,"
		+"visualchars,nonbreaking,xhtmlxtras,template,imagemanager,filemanager,noneditable,asciimath,asciimathcharmap,asciisvg,"
		+"qti_pagetitle,qti_choice,qti_gapinlinechoice,qti_order,qti_match,qti_fileuploadlib,qti_comment,"
		+"qti_addvideo,qti_copyqti,qti_playpause,qti_selection,qti_draggable,qti_identification",
	*/

	theme_advanced_toolbar_location : "top",
	theme_advanced_toolbar_align : "left",
	theme_advanced_statusbar_location : "bottom",
	theme_advanced_resizing : true,
	//,formatselect   ,anchor,|
	//,justifyleft,justifycenter,justifyright,justifyfull,|
	theme_advanced_buttons1 : "save,newdocument,print,empiriapreview,|,fontselect,fontsizeselect,|,bold,italic,underline,strikethrough,|,help",
	//pastetext,pasteword,    ,spellchecker  ,asciimath,asciimathcharmap,|   |,outdent,indent,|,link,unlink,
	//,bullist,numlist,|
	//,science
	theme_advanced_buttons2 : "undo,redo,|,cut,copy,|,paste,|,search,replace,|,forecolor,backcolor,|,sub,sup,|,charmap",
	theme_advanced_buttons3 : "insertsciencesection,newLineBefore,newLineAfter,pagetitle,insertgapinlinechoice,insertchoicesection,insertordersection,insertmatchsection,insertselectionsection,insertdraggablesection,insertidentificationsection,|,fileuploadlib_image,addvideo,playpause,|,insertcomment,|,table,delete_table,delete_col,delete_row,col_after,col_before,row_after,row_before,split_cells,merge_cells,|,code",

	extended_valid_elements : "simpleText,group,canvas[id|style|width|height],gap[identifier],choiceInteraction[shuffle|maxChoices|responseIdentifier],"
		+"orderInteracion[shuffle|responseIdentifier],selectionInteracion[shuffle|responseIdentifier],item[identifier],matchInteraction[shuffle|maxAssociations|responseIdentifier],prompt,"
		+"simpleChoice[identifier|fixed],simpleAssociableChoice[identifier|fixed|matchMax],inlineChoiceInteraction,inlineChoice[score],"
		+"assessmentItem[xmlns|identifier|title|adaptive|timeDependent],responseDeclaration[identifier|cardinality|baseType],"
		+"correctResponse,value,itemBody,applink[lid|title],mapping[defaultValue],mapEntry[mapKey|mappedValue],"
		+"qy:comment[idref],feedbackInline[identifier|showHide|outcomeIdentifier|senderIdentifier|fadeEffect|mark],modalFeedback[outcomeIdentifier|identifier|showHide|sound|senderIdentifier|style],"
		+"math[title|xmlns],mstyle[mathsize|mathcolor|fontfamily|displaystyle],mfrac,mrow,mi,mo,mn,msup,mroot,munder,msubsup,msub,msup,munderover,munder,mover,msqrt,mroot,"
		+"mfenced[open|close],ms[lquote|rquote],mtext,"
		+"mtable,mtr,mtd,mspace[width],changesTracking[state],styleDeclaration,link[href|userAgent],qy:tag[name],audioPlayer[data|id|class],dragDropInteraction[responseIdentifier],contents,slot,sourcelist,dragElement[identifier]"
		+"identificationInteraction[responseIdentifier|shuffle|maxSelections|separator]",

	handle_event_callback : "actionOnQTI",
	convert_fonts_to_spans : true,
	removeformat_selector : 'b,strong,em,i,ins',
	noneditable_leave_contenteditable : true,
	remove_linebreaks : false,
	apply_source_formatting : false,
	entity_encoding : "numeric",
	dialog_type : "modal",
	height:"100%",
	width:"100%",
	object_resizing: false,
	spellchecker_rpc_url : "tools/qtitesteditor/tinymce/tiny_mce/plugins/spellchecker/rpc.php",
	spellchecker_languages : "+English=en,Polish=pl",

	paste_auto_cleanup_on_paste : true,
	paste_preprocess : function(pl, o) {
		o.content = cutQTI(o.content);
	},

	setup : function(ed) {
        ed.makeReadOnly = function(ro) {
            var t = this, s = t.settings, DOM = tinymce.DOM, d = t.getDoc();

            if(!s.readonly && ro) {
                if (!tinymce.isIE) {
                    try {
                        d.designMode = 'Off';
                    } catch (ex) {

                    }
                } else {
                    b = t.getBody();
                    DOM.hide(b);
                    b.contentEditable = false;
                    DOM.show(b);
                }
                s.readonly = true;
            } else if(s.readonly && !ro) {
                if (!tinymce.isIE) {
                    try {
                        d.designMode = 'On';
                        // Design mode must be set here once again to fix a bug where
                        // Ctrl+A/Delete/Backspace didn't work if the editor was added using mceAddControl then removed then added again
                        d.designMode = 'Off';
                        d.designMode = 'On';
                    } catch (ex) {

                    }
                } else {
                    b = t.getBody();
                    DOM.hide(b);
                    b.contentEditable = true;
                    DOM.show(b);
                }
                s.readonly = false;
            }
        };

		// Parse QTI to HTML (on editor first load)
		ed.onBeforeSetContent.add(function(ed, o){
			o.content = QTI2HTML(o.content);
		});
		
		// Parse QTI to HTML (on page load)
		ed.onSetContent.add(function(ed, o){
			o.content = QTI2HTML(o.content);
		});

		// Parse HTML to QTI (on page save)
		ed.onPostProcess.add(function(ed, o) {
            if (o.get) {
				o.content = HTML2QTI(o.content);
            }
        });
		
		ed.focusAfterInsert = function(id) {
			var toFocus = ed.dom.get(id).previousElementSibling;	
			ed.selection.select(toFocus, true);
			ed.selection.collapse(false);
			ed.dom.remove(id);
		},
		
		ed.focusAfterModify = function(n) {
			
			if (null == n.nextElementSibling || n.nextElementSibling.nodeType != 1 || n.nextElementSibling.tagName != 'P') {
				ed.selection.select(ed.dom.get(n), true);
				ed.execCommand('mceAddNewLineAfter');

			} else {
				var toFocus = n.nextElementSibling;
				ed.selection.select(ed.dom.get(toFocus), true);
				ed.selection.collapse(false);
				ed.nodeChanged();
				ed.focus();
			}
		},
		
		//sprawdza czy redaktor podomykał tagi htmlowe podczas wpisywania kontentu
		//w formularze edycyjne w naszych pluginach
		ed.validateHtml = function (text, fieldName, cancelAlert) {
				var showAlert = (cancelAlert)?false:true;
				var div = $('<div/>');
				div.html(text);

				if (text != div.html()) {
					
					if (showAlert) {
						tinymce.EditorManager.activeEditor.windowManager.alert('The '+fieldName+' field contains illegal HTML elements.');
						var wm = tinymce.EditorManager.activeEditor.windowManager;
						var alertWindowId = wm.lastId.replace('_wrapper','');
						$('#'+alertWindowId).append('<div style="z-index: -1;background-color:gray; position: fixed; left: 0px; top: 0px; opacity: 0.3; width: 100%; height:100%"></div>');
					}
					return false;
				}
				return true;
		};
		
		ed.decodeMath = function(s) {
			/*var tagsString = ed.settings.extended_valid_elements;
			tagsString = tagsString.replace(/\[[^\]]+\]/g, '');
			var tagsArray = tagsString.split(',');*/
			var reg = new RegExp(/(&lt;math&gt;)([.\S]*)(&lt;\/math&gt;)/g);
			s = s.replace(reg, function(a){
				return $('<div>').html(ed.dom.decode(a)).html();
				//console.log(d.html());
				//return a.replace(/&lt;/g, '<').replace(/&gt;/g,'>');
			});
			var reg = new RegExp(/(&lt;mathText&gt;)([.\S]*)(&lt;\/mathText&gt;)/g);
			s = s.replace(reg, function(a){
				return $('<div>').html(ed.dom.decode(a)).html();
				//return a.replace(/&lt;/g, '<').replace(/&gt;/g,'>');
			});
			return s;
		};
		
		ed.correctHtml = function (text, type) {
			if ('decode' == type) {
				return text.replace(/(open|close|lquote|rquote)=&quot;([\S]+)&quot; (open|close|lquote|rquote)=&quot;([\S]+)&quot;/g, "$1=\"$2\" $3=\"$4\"");
			}
			if ('encode' == type) {
				return text.replace(/(open|close|lquote|rquote)=\"([\S]+)\" (open|close|lquote|rquote)=\"([\S]+)\"/g, "$1=&quot;$2&quot; $3=&quot;$4&quot;");
			}
		};

		ed.XmlHelper = {
				rootNode: {attributes: new Array(), node: null},
				actualNode: {attributes: new Array(), node: null},
				correctResponses: new Array(),
				attributesMapper: {
					'useragent': 'userAgent',
					'basetype': 'baseType',
					'responseidentifier': 'responseIdentifier',
					'variableidentifier': 'variableIdentifier',
					'maxchoices': 'maxChoices',
					'fadeeffect': 'fadeEffect',
					'showhide': 'showHide',
					'expectedlength': 'expectedLength',
					'senderidentifier': 'senderIdentifier'
				},
				
				nodesMapper: {
					'assessmentitem': 'assessmentItem',
					'styledeclaration': 'styleDeclaration',
					'responsedeclaration': 'responseDeclaration',
					'correctresponse': 'correctResponse',
					'itembody': 'itemBody',
					'simpletext': 'p',
					'group': 'div',
					'div': 'group',
					'p': 'simpleText',
					'choiceinteraction': 'choiceInteraction',
					'selectioninteraction': 'selectionInteraction',
					'simplechoice': 'simpleChoice',
					'textinteraction': 'textInteraction',
					'textentryinteraction': 'textEntryInteraction',
					'inlinechoiceinteraction': 'inlineChoiceInteraction',
					'inlinechoice': 'inlineChoice',
					'feedbackinline': 'feedbackInline'
				},

				loadXML: function(xml) {
					this.actualNode.node = $(xml.replace(/\<\?xml[^>]+>[^<]*/, '')).get(0).parentNode;
					
					if (this.actualNode.node.nodeType == 11) {
						this.actualNode.node = this.actualNode.node.firstChild;
					}
					this._prepareCorrectResponses();
				},
				
				getCorrectResponseByIdentifier: function(id) {

					if ("undefined" != typeof this.correctResponses[id]) {
						return this.correctResponses[id];
					}
					return null;
				},
				
				_prepareCorrectResponses: function() {

					if ('ASSESSMENTITEM' == this.actualNode.node.nodeName) {
						var res = this.actualNode.node.getElementsByTagName('responseDeclaration');

						for (var i = 0; i < res.length; i++ ) {
							var values = res[i].getElementsByTagName('value');
							if (1 == values.length) {
								this.correctResponses[res[i].getAttribute('identifier')] = values[0].innerHTML;
							} else if (1 < values.length) {
								var arr = new Array();

								for (var j = 0; j < values.length; j++) {
									arr.push(values[j].innerHTML);
								}
								this.correctResponses[res[i].getAttribute('identifier')] = arr;
							} 
						}
					}
				},
				
				getCorrectResponseById: function(node, id) {
					
					var n = null;
					var correctResponses = new Array();
					for (var i = 0; i < node.childNodes.length; i++ ) {
						n = node.childNodes[i];
						
						if (n.nodeType == 8) {
							if (null != n.nodeValue.match(/responseDeclaration/i)) {
								var res = $(n.nodeValue).get(0);
								
								if (id == res.getAttribute('identifier')) {
									var values = res.getElementsByTagName('value');
									for (var v = 0; v < values.length; v++) {
										correctResponses.push(values[v].innerHTML);
									}
									return correctResponses;
								}
							}
						}
					}
					return correctResponses;
				},
				
				getCorrectResponseNodeId: function(node, id) {
					
					var n = null;
					var correctResponses = new Array();
					for (var i = 0; i < node.childNodes.length; i++ ) {
						n = node.childNodes[i];
						
						if (n.nodeType == 8) {
							if (null != n.nodeValue.match(/responseDeclaration/i)) {
								var res = $(n.nodeValue).get(0);
								
								if (id == res.getAttribute('identifier')) {
									return n;
								}
							}
						}
					}
					return null;
				},
				
				prepareAttributes: function(node) {
					var attr = new Array();
					var text = '';

					if (null != node && null != node.attributes) {
						var tmpAttr = new Array();
						for ( var index = 0; index < node.attributes.length; index++) {
							tmpAttr.push(node.attributes[index].name);
						}
						tmpAttr.sort();

						for (var a = 0; a < tmpAttr.length; a++) {
							if (undefined != this.attributesMapper[tmpAttr[a]]) {
								text += ' '+this.attributesMapper[tmpAttr[a]]+'="'+tinymce.EditorManager.activeEditor.dom.encode($(node).attr(tmpAttr[a]))+'"';
							} else {
								text += ' '+tmpAttr[a]+'="'+tinymce.EditorManager.activeEditor.dom.encode(node.getAttribute(tmpAttr[a]))+'"';
							}
						}
					}
					return text;
				},
				
				prepareNodeBegin: function(node) {
					var text = '';
					
					if (1 == node.nodeType) {
						if (undefined != this.nodesMapper[node.tagName.toLowerCase()]) {
							text += '<'+this.nodesMapper[node.tagName.toLowerCase()];
						} else {
							text += '<'+node.tagName.toLowerCase();
						}
						text += this.prepareAttributes(node)+'>';
					}
					return text;
				},
				
				prepareNodeEnd: function(node) {
					var text = '';
					
					if (1 == node.nodeType) {
						if (undefined != this.nodesMapper[node.tagName.toLowerCase()]) {
							text += '</'+this.nodesMapper[node.tagName.toLowerCase()]+'>';
						} else {
							text += '</'+node.tagName.toLowerCase()+'>';
						}
					}
					return text;
				},
				
				prepareEmptyNode: function(node) {
					var text = '';
					
					if (1 == node.nodeType) {
						if (undefined != this.nodesMapper[node.tagName.toLowerCase()]) {
							text += '<'+this.nodesMapper[node.tagName.toLowerCase()];
						} else {
							text += '<'+node.tagName.toLowerCase();
						}
						text += this.prepareAttributes(node)+' />';
					}
					return text;
				},
				
				prepareNode: function(node) {
					var text = '';
					if (1 == node.nodeType) {
						
						if ('math' == node.nodeName) {
							var a = new XMLSerializer();
							text += a.serializeToString(node);
							text = text.replace(/ xmlns="[^"]+"/,'');
						} else {
							text += this.prepareNodeBegin(node);
							text += node.innerHTML;
							text += this.prepareNodeEnd(node);
						}
					}
					return text;
				}
		};
		
		ed.QTIWindowHelper = {
			lockUI : function (id) {
				var ed = tinymce.EditorManager.activeEditor;
				var zIndex = ed.windowManager.zIndex;
				var elm = tinymce.DOM.create('div', {id : 'mcePopupLayer_'+id, style : 'background-color: gray;height: 100%;opacity: 0.3;position: fixed;top: 0;width: 100%;z-index:'+(zIndex-1)+';'}, '&nbsp;');
				$(elm).insertBefore(tinymce.DOM.get(id));
				return id;
			},
			
			getPopupWindowZIndex : function () {
				return tinymce.EditorManager.activeEditor.windowManager.zIndex;
			},
			
			correctGwtWindowZIndex : function (gwtDialogBox) {
				var zIndex = this.getPopupWindowZIndex();
				var box = gwtDialogBox;
				if (undefined == box) {
					box = $('.gwt-DialogBox'); 
				}
				if (box.length > 0) {
					box.zIndex(zIndex);
				}
			}
		};
	}
});
