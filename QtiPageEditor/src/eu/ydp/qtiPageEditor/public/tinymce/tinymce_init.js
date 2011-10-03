var AMTcgiloc = "http://www.imathas.com/cgi-bin/mimetex.cgi";

tinyMCE.init({
	convert_urls: false,
	theme : "advanced",
	mode: "textareas",
	elements : "content",
	skin : "o2k7",
	plugins : "safari,spellchecker,pagebreak,style,layer,table,save,advhr,advlink,emotions,iespell,inlinepopups,"
		+"insertdatetime,qti_preview,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,"
		+"visualchars,nonbreaking,xhtmlxtras,template,imagemanager,filemanager,noneditable,asciimath,asciimathcharmap,asciisvg,"
		+"qti_pagetitle,qti_choice,qti_gapinlinechoice,qti_order,qti_match,qti_fileuploadlib,qti_comment,"
		+"qti_addvideo,qti_copyqti,qti_playpause,qti_selection,qti_draggable,qti_identification",

	theme_advanced_toolbar_location : "top",
	theme_advanced_toolbar_align : "left",
	theme_advanced_statusbar_location : "bottom",
	theme_advanced_resizing : true,
	theme_advanced_buttons1 : "save,newdocument,print,preview,|,formatselect,fontselect,fontsizeselect,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,anchor,|,help",
	theme_advanced_buttons2 : "undo,redo,|,cut,copy,|,paste,pastetext,pasteword,|,search,replace,|,forecolor,backcolor,|,bullist,numlist,|,outdent,indent,|,link,unlink,|,sub,sup,|,asciimath,asciimathcharmap,|,charmap,|,spellchecker",
	theme_advanced_buttons3 : "pagetitle,insertgapinlinechoice,insertchoicesection,insertordersection,insertmatchsection,insertselectionsection,insertdraggablesection,insertidentificationsection,|,fileuploadlib_image,addvideo,playpause,|,insertcomment,|,tablecontrols,|,code",

	extended_valid_elements : "canvas[id|style|width|height],gap[identifier],choiceInteraction[shuffle|maxChoices|responseIdentifier],"
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
	apply_source_formatting : true,
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

	}

});
