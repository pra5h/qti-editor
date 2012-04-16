var AMTcgiloc = "http://www.imathas.com/cgi-bin/mimetex.cgi";

tinyMCE.init({
	convert_urls: false,
	theme : "advanced",
	mode: "textareas",
	elements : "content",
	skin : "o2k7",
	//spellchecker, asciimath,asciimathcharmap,
	//qti_science,
	plugins : "safari,pagebreak,layer,table,save,advhr,advlink,emotions,iespell,inlinepopups,"
		+"insertdatetime,qti_empiriapreview,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,"
		+"visualchars,nonbreaking,xhtmlxtras,template,imagemanager,filemanager,asciisvg,"
		+"qti_pagetitle,qti_choice,qti_gapinlinechoice,qti_fileuploadlib,"
		+"qti_addvideo,qti_copyqti,qti_selection,qti_newline",
		
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
	theme_advanced_buttons3 : "newLineBefore,newLineAfter,pagetitle,insertgapinlinechoice,insertchoicesection,insertordersection,insertmatchsection,insertselectionsection,insertdraggablesection,insertidentificationsection,|,fileuploadlib_image,addvideo,playpause,|,insertcomment,|,tablecontrols,|,code",

	extended_valid_elements : "simpleText,group,canvas[id|style|width|height],gap[identifier],choiceInteraction[shuffle|maxChoices|responseIdentifier],"
		+"orderInteracion[shuffle|responseIdentifier],selectionInteracion[shuffle|responseIdentifier],item[identifier],matchInteraction[shuffle|maxAssociations|responseIdentifier],prompt,"
		+"simpleChoice[identifier|fixed],simpleAssociableChoice[identifier|fixed|matchMax],inlineChoiceInteraction,inlineChoice[score],"
		+"assessmentItem[xmlns|identifier|title|adaptive|timeDependent],responseDeclaration[identifier|cardinality|baseType],"
		+"correctResponse,value,itemBody,applink[lid|title],mapping[defaultValue],mapEntry[mapKey|mappedValue],"
		+"qy:comment[idref],feedbackInline[identifier|showHide|outcomeIdentifier|senderIdentifier|fadeEffect|mark],modalFeedback[outcomeIdentifier|identifier|showHide|sound|senderIdentifier|style],"
		+"math[title|xmlns],mstyle[mathsize|mathcolor|fontfamily|displaystyle],mfrac,mrow,mi,mo,mn,msup,mroot,munder,"
		+"mtable,mtr,mtd,mspace,changesTracking[state],styleDeclaration,link[href|userAgent],qy:tag[name],audioPlayer[data|id|class],dragDropInteraction[responseIdentifier],contents,slot,sourcelist,dragElement[identifier]"
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
			var toFocus = n.nextElementSibling;
			ed.selection.select(ed.dom.get(toFocus), true);
			ed.selection.collapse(false);
			ed.nodeChanged();
			ed.focus();
		},
		
		//sprawdza czy redaktor podomykał tagi htmlowe podczas wpisywania kontentu
		//w formularze edycyjne w naszych pluginach
		ed.validateHtml = function (text, fieldName) {
				var div = $('<div/>');
				div.html(text);
				
				if (text != div.html()) {
					tinymce.EditorManager.activeEditor.windowManager.alert('The '+fieldName+' field contains illegal HTML elements.');
					return false;
				}
				return true;
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
					//this.rootNode.node = $(xml.replace(/\<\?xml[^>]+>[^<]*/, '')).get(0).parentNode;
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
						text += this.prepareNodeBegin(node);
						text += node.innerHTML;
						text += this.prepareNodeEnd(node);
					}
					return text;
				}
		};
	}
});
