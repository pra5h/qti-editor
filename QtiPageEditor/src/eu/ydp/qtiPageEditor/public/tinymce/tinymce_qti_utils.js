var baseTags = new Array('p','div');
baseTags.sort();
function qti2htmlParse(tree) {
	var text = '';
	var xh = tinymce.EditorManager.activeEditor.XmlHelper;
	if (tree.nodeType == 1) {
		if ('ASSESSMENTITEM' == tree.tagName) {
			text += '<!-- <assessmentItem'+xh.prepareAttributes(tree)+'> -->';
		} else if ('STYLEDECLARATION' == tree.tagName) {
			text += '<!-- <styleDeclaration>';
		} else if ('LINK' == tree.tagName) {
			text += '<link'+xh.prepareAttributes(tree)+' />';
		} else if ('RESPONSEDECLARATION' == tree.tagName) {
			text += '<!-- <responseDeclaration'+xh.prepareAttributes(tree)+'>';
		} else if ('CORRECTRESPONSE' == tree.tagName) {
			text += '<correctResponse>';
		} else if ('VALUE' == tree.tagName) {
			text += '<'+tree.tagName.toLowerCase()+'>';
		} else if ('ITEMBODY' == tree.tagName) {
			text += '<!-- <itemBody> -->';
		} else if ('CHOICEINTERACTION' == tree.tagName) {
			text += choiceInteractionToHTML(tree);
		} else if ('SELECTIONINTERACTION' == tree.tagName) {
			text += selectionInteractionToHTML(tree);
		} else if ('TEXTINTERACTIONSGROUP' == tree.tagName) {
			text += textInteractionsGroupToHTML(tree);
		} else if (-1 != baseTags.indexOf(tree.tagName.toLowerCase())) {
			if ('p' == tree.tagName.toLowerCase() && tree.textContent == '') {
				text +='<p><br>';
			} else {
				text += '<'+tree.tagName.toLowerCase()+xh.prepareAttributes(tree)+'>';
			}
		}
	}
	if(tree.hasChildNodes()) {
		var nodes=tree.childNodes.length;
		for(var i=0; i<tree.childNodes.length; i++) {
			text += qti2htmlParse(tree.childNodes[i]);
		}

	} else {

		if (tree.nodeType == 3) {
			text += tree.nodeValue;
		}
	}
	if (tree.nodeType == 1) {
		if ('ASSESSMENTITEM' == tree.tagName) {
			text += '<!-- </assessmentItem> -->';
		} else if ('STYLEDECLARATION' == tree.tagName) {
			text += '</styleDeclaration> -->';
		} else if ('RESPONSEDECLARATION' == tree.tagName) {
			text += '</responseDeclaration> -->';
		} else if ('CORRECTRESPONSE' == tree.tagName) {
			text += '</correctResponse>';
		} else if ('VALUE' == tree.tagName) {
			text += '</'+tree.tagName.toLowerCase()+'>';
		} else if ('ITEMBODY' == tree.tagName) {
			text += '<!-- </itemBody> -->';
		} else if (-1 != baseTags.indexOf(tree.tagName.toLowerCase())) {
			text += '</'+tree.tagName.toLowerCase()+'>';
		}
	}
	return text;
}
function html2qtiParse(tree) {
    var text = '';
   var xh = tinymce.EditorManager.activeEditor.XmlHelper;
    if (tree.nodeType == 1) {
            if ('ASSESSMENTITEM' == tree.tagName) {
                    text += '<assessmentItem'+xh.prepareAttributes(tree)+'>';
            } else if ('STYLEDECLARATION' == tree.tagName) {
                    text += '<styleDeclaration>';
            } else if ('LINK' == tree.tagName) {
                    text += '<link'+xh.prepareAttributes(tree)+' />';
            } else if ('RESPONSEDECLARATION' == tree.tagName) {
                    text += '<responseDeclaration'+xh.prepareAttributes(tree)+'>';
            } else if ('CORRECTRESPONSE' == tree.tagName) {
                    text += '<correctResponse>';
            } else if ('VALUE' == tree.tagName) {
                    text += '<'+tree.tagName.toLowerCase()+'>';
            } else if ('ITEMBODY' == tree.tagName) {
                    text += '<itemBody>';
            } else if (-1 != baseTags.indexOf(tree.tagName.toLowerCase())) {
                    if ('p' == tree.tagName.toLowerCase() && $.trim(tree.textContent) == '') {
                            text +='<qy:tag name="text"><p>';
                    } else {
                            text += '<'+tree.tagName.toLowerCase()+xh.prepareAttributes(tree)+'>';
                    }
            }
    }
    
    if(tree.hasChildNodes()) {
            var nodes=tree.childNodes.length;
            for(var i=0; i<tree.childNodes.length; i++) {
            	if (8 == tree.childNodes[i].nodeType) {

            		if ('<textInteractionsGroup>' == $.trim(tree.childNodes[i].nodeValue)) {
            			text += textInteractionsGroupToQTI(tree.childNodes[i]);
            			i += 2;
            		} else if ('<selectionInteraction' == $.trim(tree.childNodes[i].nodeValue).substr(0, 21)){
            			text += selectionInteractionToQTI(tree.childNodes[i]);
            			i += 2;
            		} else if ('<choiceInteraction' == $.trim(tree.childNodes[i].nodeValue).substr(0, 18)){
            			text += choiceInteractionToQTI(tree.childNodes[i]);
            			i += 2;
            		} else {
            			var node = $(tree.childNodes[i].nodeValue).get(0);

            			if (null != node) {
            				text += html2qtiParse(node);
            			} else {

            				if (tree.childNodes[i].nodeValue.match(/\?(xml[^\?]*)\?/gi)) {
            					text += tree.childNodes[i].nodeValue.replace(/\?(xml[^\?]*)\?/gi,'<?$1?>');
            				} else {
            					text += tree.childNodes[i].nodeValue;
            				}
            			}
            		}
            	} else {
            		text += html2qtiParse(tree.childNodes[i]);
            	}
            }

    } else {

            if (tree.nodeType == 3) {
                    text += tree.nodeValue;
            }
    }
    
    if (tree.nodeType == 1) {
    	if ('STYLEDECLARATION' == tree.tagName) {
    		text += '</styleDeclaration>';
    	} else if ('RESPONSEDECLARATION' == tree.tagName) {
    		text += '</responseDeclaration>';
    	} else if ('CORRECTRESPONSE' == tree.tagName) {
    		text += '</correctResponse>';
    	} else if ('VALUE' == tree.tagName) {
    		text += '</'+tree.tagName.toLowerCase()+'>';
    	} else if (-1 != baseTags.indexOf(tree.tagName.toLowerCase())) {
    		if ('p' == tree.tagName.toLowerCase() && $.trim(tree.textContent) == '') {
                text +='</p></qy:tag>';
    		} else {
    			text += '</'+tree.tagName.toLowerCase()+'>';
        	}
    	}
    } 

    return text;
}

function textInteractionsGroupToQTI(tig) {
	var text = '';
	text += '<qy:tag name="exercise"><textInteractionsGroup>';
	var gic = tig.nextSibling;
	text += '<prompt>'+gic.firstElementChild.innerHTML+'</prompt>';
	var content = gic.firstElementChild.nextElementSibling;
	var n = null;
	for (var i = 0; i < content.childNodes.length; i++) {
		
		n = content.childNodes[i];
		if (3 == n.nodeType) {
			text += n.nodeValue;
		} else if (8 == n.nodeType) {

			if ('textEntryInteraction' == $.trim(n.nodeValue).substr(1, 20)) {
				text += $.trim(n.nodeValue);
			} else if ('inlineChoiceInteraction' == $.trim(n.nodeValue).substr(1, 23)) {
				text += $.trim(n.nodeValue);
				for (j = 0; j < n.nextSibling.childNodes.length; j++) {
					var ic = n.nextSibling.childNodes[j];
					if (8 == ic.nodeType) {
						if ('inlineChoice' == $.trim(ic.nodeValue).substr(1, 12)) {
							text += $.trim(ic.nodeValue);
							n.nextSibling.removeChild(n.nextSibling.childNodes[j]);
						}
					}
				}
				text += '</inlineChoiceInteraction>';
				//content.removeChild(content.childNodes[i]);
			}
			
		} else {
			if ('SPAN' != n.tagName) {
				var xh = tinymce.EditorManager.activeEditor.XmlHelper;
				text += '<'+n.tagName.toLowerCase()+xh.prepareAttributes(n)+'>'
				text += n.innerHTML;
				text += '</'+n.tagName.toLowerCase()+'>';
			}
		}
	}
	text += '</textInteractionsGroup></qy:tag>';
	//gic.parentNode.removeChild(gic.previousElementSibling);
	//gic.parentNode.removeChild(gic.nextElementSibling);
	//gic.parentNode.removeChild(gic);
	return text;
}

function choiceInteractionToHTML(ci) {

	var xh = tinymce.EditorManager.activeEditor.XmlHelper;
	var correctResponses = xh.getCorrectResponseByIdentifier(ci.getAttribute('responseIdentifier'));
	var text = '';
	text += '<!-- <choiceInteraction'+xh.prepareAttributes(ci)+'> -->';
	text += '<div id="choiceInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;" mce_style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">';
	var checked = '';
	
	for (var k = 0; k < ci.childNodes.length; k++) {
		if (1 == ci.childNodes[k].nodeType) {
			if ('PROMPT' == ci.childNodes[k].tagName) {
				text += '<p id="choiceInteraction">'+ci.childNodes[k].innerHTML+'</p>';
			} else if ('SIMPLECHOICE' == ci.childNodes[k].tagName) {
				text += '<!-- <simpleChoice'+xh.prepareAttributes(ci.childNodes[k])+'>';
				var innerHtml = '';
				for (var i = 0; i < ci.childNodes[k].childNodes.length; i++) {
					var scChild = ci.childNodes[k].childNodes[i];
					
					if (1 == scChild.nodeType) {
						if ('FEEDBACKINLINE' == scChild.tagName) {
							text += '<feedbackInline'+xh.prepareAttributes(scChild)+'>'+scChild.innerHTML+'</feedbackInline>';
						} else if ('IMG' == scChild.tagName) {
							text += '<img'+xh.prepareAttributes(scChild)+' />';
							innerHtml = '<img'+xh.prepareAttributes(scChild)+' />';
						} else {
							text += scChild.nodeValue;
							innerHtml = scChild.nodeValue;
						}
					} else {
						text += scChild.nodeValue;
						innerHtml = scChild.nodeValue;
					}
				}
				text += '</simpleChoice> -->';
				text += '<br/>'
				if (-1 != correctResponses.indexOf(ci.childNodes[k].getAttribute('identifier'))) {
					checked = 'checked="checked" ';
				}
				text += '<input id="choiceInteraction" '+checked+'name="simpleChoice" type="checkbox"/>'+innerHtml;
				checked = '';
				innerHtml = '';
			}
		}
	}
	/*
	var prompts = ci.getElementsByTagName('prompt');
	text += '<p id="choiceInteraction">'+prompts[0].innerHTML+'</p>';
	var simpleChoices = ci.getElementsByTagName('simpleChoice');
	var feedback = null;
	var feedbackText = '';
	var sc = null;
	var checked = '';
*/
	/*
	for (var i = 0; i < simpleChoices.length; i++) {
		sc = simpleChoices[i];
		text += '<!-- <simpleChoice'+xh.prepareAttributes(sc)+'>';
		feedback = sc.firstElementChild;

		if (null != feedback) {
			feedbackText += '<feedbackInline'+xh.prepareAttributes(feedback)+'>'+feedback.innerHTML+'</feedbackInline>';
			sc.removeChild(feedback);
		}
		text += sc.innerHTML;
		text += feedbackText;
		text += '</simpleChoice> -->';
		text += '<br/>'
			
		if (-1 != correctResponses.indexOf(sc.getAttribute('identifier'))) {
			checked = 'checked="checked" ';
		}
		text += '<input id="choiceInteraction" '+checked+'name="simpleChoice" type="checkbox">'+sc.innerHTML;
		checked = '';
		feedback = null;
		feedbackText = '';
	}*/
	text += '</div><!-- </choiceInteraction> -->';
	//usuniecie childeow zeby rekurencja juz tam nie wpadla
	while(ci.hasChildNodes()){
		ci.removeChild(ci.lastChild);
	}
	return text;
}

function selectionInteractionToQTI (si) {
	var text = '';
	var xh = tinymce.EditorManager.activeEditor.XmlHelper;
	var sINode = si.nextSibling;
	text += '<qy:tag name="exercise"><selectionInteraction'+xh.prepareAttributes($(si.nodeValue).get(0))+'>';
	text += '<prompt>'+sINode.firstElementChild.innerHTML+'</prompt>';
	var table = sINode.firstElementChild.nextElementSibling;
	var tr = null;
	
	for (var i = 0; i < table.firstChild.childNodes.length; i++) {
		tr = table.firstChild.childNodes[i];
			for (var j = 0; j < tr.childNodes.length; j++) { // for tr
				for (var k = 0; k < tr.childNodes[j].childNodes.length; k++) { //for td
					if (8 == tr.childNodes[j].childNodes[k].nodeType) {
						text += $.trim(tr.childNodes[j].childNodes[k].nodeValue);
					}
				}
			}
	}
	text += '</selectionInteraction></qy:tag>';
	
	//sINode.parentNode.removeChild(si);
	//sINode.parentNode.removeChild(sINode.nextSibling);
	//sINode.parentNode.removeChild(sINode);
	return text;
}

function choiceInteractionToQTI(ci) {
	var text = '';
	var xh = tinymce.EditorManager.activeEditor.XmlHelper;
	var cINode = ci.nextSibling;
	text += '<qy:tag name="exercise"><choiceInteraction'+xh.prepareAttributes($(ci.nodeValue).get(0))+'>';
	text += '<prompt>'+cINode.firstElementChild.innerHTML+'</prompt>';
	for (var i = 0; i < cINode.childNodes.length; i++) {
		if (8 == cINode.childNodes[i].nodeType) {
			text += cINode.childNodes[i].nodeValue;
		}
	}
	text += '</choiceInteraction></qy:tag>';
	
	//obejscie po to aby rekurencja nie poszla w wezly nalezace do tego cwiczenia, bo one juz byly sparsowane
	//zamkniecie choiceInteraction ustawiam jako puste - to jest wezel typu komentarz
	//cINode.nextSibling.nodeValue = '';
//	cINode.parentNode.removeChild(cINode);
	return text;
}

function selectionInteractionToHTML(si) {
	var xh = tinymce.EditorManager.activeEditor.XmlHelper;
	var correctResponses = xh.getCorrectResponseByIdentifier(si.getAttribute('responseIdentifier'));
	var text = '';
	text += '<!-- <selectionInteraction'+xh.prepareAttributes(si)+'> -->';
	text += '<div id="selectionInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;" mce_style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">';

	var prompts = si.getElementsByTagName('prompt');
	text += '<p id="selectionInteraction">'+prompts[0].innerHTML+'</p>';
	var options = si.getElementsByTagName('simpleChoice');
	
	text += '<table class="selectionTable"><tbody><tr><td>&nbsp;</td>';
	for (var i = 0; i < options.length; i++) {
		text += '<td><!-- <simpleChoice identifier="'+options[i].getAttribute('identifier')+'">'+options[i].innerHTML+'</simpleChoice> -->'+options[i].innerHTML+'</td>';
	}
	text += '</tr>';
	
	var items = si.getElementsByTagName('item');
	var feedbacks = new Array();
	var feedbacksText = '';
	var item = null;
	var feedback = null;

	for (var i = 0; i < items.length; i++) {
		item = items[i];
		text += '<tr><td><!-- <item'+xh.prepareAttributes(item)+'>';

		for (var j = item.childNodes.length-1; j > 0; j--) {

			if (item.childNodes[j].tagName == 'FEEDBACKINLINE') {
				feedback = item.childNodes[j];
				feedbacksText += '<feedbackInline'+xh.prepareAttributes(feedback)+'>'+feedback.innerHTML+'</feedbackInline>';
				item.removeChild(feedback);
			}
		}
		text += item.innerHTML;
		text += feedbacksText;
		text += '</item> -->'+item.innerHTML+'</td>';
		feedbacksText = '';
		
		for (var j = 0; j < options.length; j++) {
			var checked = '';
			
			if (correctResponses.indexOf(item.getAttribute('identifier')+' '+options[j].getAttribute('identifier')) != -1) {
				checked = 'checked="checked" ';
			}
			text += '<td><input id="selectionInteraction" '+checked+'name="simpleChoice" type="checkbox"/></td>';
			checked = '';
		}
		text += '</tr>';
	}
	text += '</tbody></table></div><!-- end of selectionInteraction -->';
	//usuniecie childeow zeby rekurencja juz tam nie wpadla
	while(si.hasChildNodes()){
		si.removeChild(si.lastChild);
	}
	return text;
}

function textInteractionsGroupToHTML(ti) {
	var xh = tinymce.EditorManager.activeEditor.XmlHelper;
	var text = '';
	text += '<!-- <textInteractionsGroup> -->';
	text += '<div id="gapInlineChoiceInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;" mce_style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">';
	
	for (var i = 0; i < ti.childNodes.length; i++) {
		
		if (3 == ti.childNodes[i].nodeType) {
			text += ti.childNodes[i].nodeValue;
		} else {
			
			if ('PROMPT' == ti.childNodes[i].tagName) {
				text += '<!-- <prompt> --><p id="gapInlineChoiceInteractionQuestion">'+ti.childNodes[i].innerHTML+'</p><!-- </prompt> -->';
				text += '<p id="gapInlineChoiceInteractionContent">';
			} else if ('TEXTENTRYINTERACTION' == ti.childNodes[i].tagName) {
				text += '<!-- <textEntryInteraction'+xh.prepareAttributes(ti.childNodes[i])+'>';
				
				if (null != ti.childNodes[i].childNodes) {
					var feedbacksText = '';
					
					for (var j = ti.childNodes[i].childNodes.length-1; j >= 0; j--) {

						if (ti.childNodes[i].childNodes[j].tagName == 'FEEDBACKINLINE') {
							var feedback = ti.childNodes[i].childNodes[j];
							feedbacksText = '<feedbackInline'+xh.prepareAttributes(feedback)+'>'+feedback.innerHTML+'</feedbackInline>' + feedbacksText;
							ti.childNodes[i].removeChild(feedback);
						}
					}
					text += feedbacksText;
				}
				text += '</textEntryInteraction> -->';
				var correctResponses = xh.getCorrectResponseByIdentifier(ti.childNodes[i].getAttribute('responseIdentifier'));
				text += '<span id="gap" class="mceNonEditable" style="border: 1px solid blue; color: blue; background-color: #f0f0f0;" mce_style="border: 1px solid blue; color: blue; background-color: #f0f0f0;">'+correctResponses+'</span>';
			
			} else if ('INLINECHOICEINTERACTION' == ti.childNodes[i].tagName) {
				text += '<!-- <inlineChoiceInteraction'+xh.prepareAttributes(ti.childNodes[i])+'> -->';
				text += '<span mce_style="border: 1px solid blue; color: blue; background-color: #f0f0f0;" style="border: 1px solid blue; color: blue; background-color: #f0f0f0;" class="mceNonEditable" id="inlineChoiceInteraction">';
				
				if (null != ti.childNodes[i].childNodes) {
					
					for (var j = 0; j < ti.childNodes[i].childNodes.length; j++) {
						var iCText = '';
						
						if (ti.childNodes[i].childNodes[j].tagName == 'INLINECHOICE') {
							var ic = ti.childNodes[i].childNodes[j];
							iCText += '<!-- <inlineChoice'+xh.prepareAttributes(ic)+'>';
							
							if (null != ic.childNodes) {
								var feedbacksText = '';
								
								for (var k = ic.childNodes.length-1; k >= 0; k--) {

									if (ic.childNodes[k].tagName == 'FEEDBACKINLINE') {
										var feedback = ic.childNodes[k];
										feedbacksText += '<feedbackInline'+xh.prepareAttributes(feedback)+'>'+feedback.innerHTML+'</feedbackInline>';
										ic.removeChild(feedback);
									}
								}
							}
							iCText += ic.innerHTML;
							iCText += feedbacksText;
							iCText += '</inlineChoice> -->';
							var correctResponses = xh.getCorrectResponseByIdentifier(ti.childNodes[i].getAttribute('responseIdentifier'));
							if (correctResponses == ic.getAttribute('identifier')) {
								iCText += '<span id="inlineChoiceAnswer" style="border: none; color: blue; background-color: #f0f0f0;" mce_style="border: none; color: blue; background-color: #f0f0f0;">'+ic.innerHTML+'<span style="color: green; font-weight: bold;" mce_style="color: green; font-weight: bold;"> »</span></span>';
							} else {
								iCText += '<span id="inlineChoiceAnswer" style="display: none;" mce_style="display: none;">'+ic.innerHTML+'</span>';
							}
						}
						text += iCText;
					}
				}
				text += '</span><!-- </inlineChoiceInteraction> -->';
			}
		}
	}

	text += '</p></div><!-- </textInteractionsGroup> -->';
	//usuniecie childeow zeby rekurencja juz tam nie wpadla
	while(ti.hasChildNodes()){
		ti.removeChild(ti.lastChild);
	}
	return text;
}

function QTI2HTML(h) {
	
	//remove formatting
	h = h.replace(/(\r\n|\n|\r)/gm,'');
	h = h.replace(/(>[ ]+<)/gm,'><');
	
	if(h.match(/<assessmentItem [^>]*>/gi)) {
		basePagePath = tinyMCE.gwtProxy.getPageBasePath();
		if(basePagePath != undefined && basePagePath != '') {
			basePagePath = basePagePath.split('/');
			basePagePath.pop();
			basePagePath = basePagePath.join('/');
			basePagePath += '/';
			h = h.replace(/src="([^"(ctrl)]+media[^"]*)"/gi, 'src="' + basePagePath + '$1"');
			h = h.replace(/href="([^"]*media[^"]*)"/gi, 'href="' + basePagePath + '$1"');

		}

		if(h.match(/<!-- <changesTracking state="on"> -->/gi)) {
			tinyMCE.changesTracking = true;
			tinyMCE.activeEditor.controlManager.setActive('enablechangestracking', true);
		} else {
			tinyMCE.changesTracking = false;
			tinyMCE.activeEditor.controlManager.setActive('enablechangestracking', false);
		}
	}

	/*h = h.replace(/(<span[^>]*class="changestracking_original"[^>]*style=")("[^>]*>)/gi,'$1color: red; text-decoration: line-through;$2');
	h = h.replace(/(<span[^>]*class="changestracking_new"[^>]*style=")[^"]*("[^>]*>)/gi,'$1color: red; text-decoration: underline;$2');

	h = h.replace(/<u[^>]*style="[^"]*"[^>]*>(.*?)<\/u>/gi,'<span class="changestracking_new" style="color: red; text-decoration: underline;" title="Changes tracking: new content">$1</span>');
	h = h.replace(/<strike[^>]*style="[^"]*"[^>]*>(.*?)<\/strike>/gi,'<span class="changestracking_original" style="color: red; text-decoration: line-through;" title="Changes tracking: original content">$1</span>');
*/
	// bug 35201
	//if(h.match(/^<table[^>]*>.*<\/table>$/i) == undefined) {
		h = processQTI(h);
	//}
	return h;
}

function processQTI(h) {

	// Prepare QTI base template if file is empty
	if(h == '<br mce_bogus="1" />' || h == '') {
		h = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p1 imsqti_v2p1.xsd"  identifier="" title="" adaptive="false" timeDependent="false"> <itemBody>' + h + '</itemBody></assessmentItem>';
	}
	
	var xh = tinymce.EditorManager.activeEditor.XmlHelper;
	xh.loadXML(h);
	var text = '<!-- ?xml version="1.0" encoding="UTF-8" standalone="no"? -->';
	text += qti2htmlParse(xh.actualNode.node);
	return text;
}

function HTML2QTI(h) {
	h = parseToQTI(h);
	
	basePagePath = tinyMCE.gwtProxy.getPageBasePath();
	if(basePagePath != undefined && basePagePath != '') {

		basePagePath = basePagePath.split('/');
		basePagePath.pop();
		basePagePath = basePagePath.join('/');
		basePagePath += '/';
		var rg = new RegExp('src="(' + basePagePath + ')*([^"]*)"', 'gi');
		h = h.replace(rg, 'src="$2"');
		var rg = new RegExp('href="(' + basePagePath + ')*([^"]*)"', 'gi');
		h = h.replace(rg, 'href="$2"');

	}
	h = applyFormatting(h);
	return h;
}

function parseToQTI(h) {
	var node = document.createElement('root');
	node.innerHTML = h;
	text = html2qtiParse(node);
	return text;
}

function applyFormatting(h) {

	h = h.replace(/(\r\n|\n|\r)/gm,'');
	h = h.replace(/(>[ ]+<)/gm,'><');

	// TEMPLATE FORMATING
	//before begin
	h = h.replace(/<(qy:tag|assessmentItem)([^>]*)>/gi, '\n<$1$2>');
	
	//after begin
	h = h.replace(/<(qy:tag|assessmentItem|styleDeclaration|itemBody|link|responseDeclaration|correctResponse)([^>]*)>/gi, '<$1$2>\n');
	
	//after end
	h = h.replace(/<\/(qy:tag|styleDeclaration|value|correctResponse|responseDeclaration|itemBody)([^>]*)>/gi, '</$1$2>\n');
	
	//before end
	h = h.replace(/<\/(qy:tag|itemBody)([^>]*)>/gi, '\n</$1$2>');
	h = h.replace(/<(div class="[^"]+")([^>]*)>/gi, '\n<$1$2>');
	h = h.replace(/<\/(div)>/gi, '</$1>\n');
	
	
	//PLUGIN FORMATING
	//after begin
	h = h.replace(/<(choiceInteraction)([^>]*)>/gi, '<$1$2>\n');
	//before end
	h = h.replace(/<\/(choiceInteraction)>/gi, '\n</$1>');
	//after end
	h = h.replace(/<\/(prompt)>/gi, '</$1>\n');
	return h;
}

function actionOnQTI(e) {
	
	var ed = tinymce.EditorManager.activeEditor;
	
	// fix for writing content before xml template
	if(ed.selection.getStart().attributes != undefined && ed.selection.getStart().hasAttribute('_moz_editor_bogus_node')) {
		ed.selection.dom.doc.body.innerHTML = ed.selection.dom.doc.body.innerHTML.replace(/(.*)(<!-- \?xml[^\?]*\? -->[^<]*<!-- <assessmentItem[^>]*> -->[^<]*<!-- <itemBody> -->)/gi,'$2$1');
	}
	
	// TODO: ZNALEZC OBEJSCIE DLA IE !! WAZNE !!
	if(!tinymce.isIE) { 
		if(ed.selection.getRng().startContainer.nodeName == 'BODY') {
			if(ed.selection.dom.doc.body.getElementsByTagName('p')[0] != undefined && tinyMCE.originalBookmark == undefined) {
				ed.selection.select(ed.selection.dom.doc.body.getElementsByTagName('p')[0]);
				//ed.selection.moveToBookmark(ed.selection.getBookmark());
			} 
		} 
	} 
	
	//selectNodeAfterMouseEvent(e, ed);
	//onDelete if Tracking is disable
	if (e.keyCode == 46 && e.type == 'keypress') {
		var dd = ed.selection.getNode() || ed.getBody();

		if(dd.attributes != undefined) {
			if (dd.id != undefined  && dd.nodeName == 'DIV' && dd.id == 'gapInlineChoiceInteraction') {
				ed.execCommand('mceGapInlineChoiceRemove', false);
			}
		}
		
		if ("P" == dd.nodeName && "&nbsp;" == dd.innerHTML) {
			dd.parentNode.removeChild(dd);
			return false;
		}
		return false;
	}
	
	if(tinyMCE.changesTracking != undefined) {
		if(tinyMCE.changesTracking === true) {
		
			if(tinyMCE.originalBookmark != undefined) {
				ed.selection.moveToBookmark(tinyMCE.originalBookmark);
				delete tinyMCE.originalBookmark;
			}
			
			// Disable editing original content
			if(ed.selection.getNode().nodeName != undefined && ed.selection.getNode().nodeName == 'SPAN' && ed.selection.getNode().getAttribute('class') == 'changestracking_original') {
				if(e.type == 'keypress' && (e.charCode != 0 || e.keyCode == 8 || e.keyCode == 88 || e.keyCode == 46 || e.keyCode == 86)) {
					return false;
				}
			}
			
			// On typing text or pasting
			if(e.type=='keypress' && (e.charCode != 0 || e.keyCode == 86)) {
				
				if(ed.selection.getContent() != '') {
					
					// replace selected text
					ed.windowManager.alert('Text replacing is not allowed in changes tracking mode');
					return false;
					
				} else if(ed.selection.getNode().nodeName != undefined && ed.selection.getNode().nodeName == 'SPAN' && ed.selection.getNode().attributes != undefined && ed.selection.getNode().getAttribute('class') == 'changestracking_new') {
					
					// type inside previously added text
					return true;
					
				} else if(ed.selection.getNode().nodeName != undefined && ed.selection.getNode().nodeName == 'SPAN' && ed.selection.getNode().className != undefined && ed.selection.getNode().className == 'AMedit') {
					
					// type inside math expressions
					ed.selection.getNode().setAttribute('style','color: red;');
					return true;
					
				} else {
					
					// type new text
					tinyMCE.execCommand('mceInsertContent', false, '<span class="changestracking_new" style="color: red; text-decoration: underline;" title="Changes tracking: new content">' + String.fromCharCode(e.charCode) + '</span>');
					return false;
					
				}
				
			}
			
			// Actions on normal text
			if(ed.selection.getNode().nodeName == undefined || ed.selection.getNode().nodeName != 'SPAN' || ed.selection.getNode().attributes == undefined || ed.selection.getNode().getAttribute('class') != 'changestracking_new') {
				// on backspace
				if(e.type == 'keypress' && e.keyCode == 8) {
					var content = ed.selection.getContent();
					if(content != '') {
						
						var myBookmark = ed.selection.getBookmark();
						ed.selection.moveToBookmark(myBookmark);
						tinyMCE.execCommand('mceInsertContent', false, '<span class="changestracking_original" style="color: red; text-decoration: line-through;" title="Changes tracking: original content">' + content + '</span>');
						myBookmark.end = myBookmark.start;
						ed.selection.moveToBookmark(myBookmark);
						
					} else if(ed.selection.getNode().nodeName != undefined && ed.selection.getNode().nodeName == 'SPAN' && ed.selection.getNode().className != undefined && ed.selection.getNode().className == 'AMedit') {
						
						ed.selection.getNode().setAttribute('style','color: red;');
						return true;
						
					} else {
						
						var myBookmark = ed.selection.getBookmark();
						
						myBookmark.start = myBookmark.start - 1;
						ed.selection.moveToBookmark(myBookmark);
						
						var content = ed.selection.getContent();
						tinyMCE.execCommand('mceInsertContent', false, '<span class="changestracking_original" style="color: red; text-decoration: line-through;" title="Changes tracking: original content">' + content + '</span>');
						myBookmark.end = myBookmark.start;
						ed.selection.moveToBookmark(myBookmark);
						
					}
					//reduceNumberOfSpans();
					return false;
				} // eof on backspace
				
				// on delete
				if(e.type == 'keypress' && e.keyCode == 46) {
					var content = ed.selection.getContent();
					if(content != '') {
						var myBookmark = ed.selection.getBookmark();
						ed.selection.moveToBookmark(myBookmark);
						tinyMCE.execCommand('mceInsertContent', false, '<span class="changestracking_original" style="color: red; text-decoration: line-through;" title="Changes tracking: original content">' + content + '</span>');
						myBookmark.start = myBookmark.end;
						ed.selection.moveToBookmark(myBookmark);
					} else {
						ed.windowManager.alert('Delete button is not working properly in changes tracking mode, due to technical reasons');
						//var myBookmark = ed.selection.getBookmark();
						//myBookmark.end = myBookmark.end + 1;
						//ed.selection.moveToBookmark(myBookmark);
						//var content = ed.selection.getContent();
						//tinyMCE.execCommand('mceInsertContent', false, '<span class="changestracking_original" style="color: red; text-decoration: line-through;" title="Changes tracking: original content">' + content + '</span>');
						//myBookmark.start = myBookmark.end;
						//ed.selection.moveToBookmark(myBookmark);
					}
					//reduceNumberOfSpans();
					return false;
				} // eof on delete
			
			}// eof actions on normal text
			
		} else {
			if(e.type == 'keypress' && (e.charCode != 0 || e.keyCode == 8 || e.keyCode == 46)) {
				if(ed.selection.getNode().nodeName != undefined && ed.selection.getNode().nodeName == 'SPAN' && ed.selection.getNode().attributes != undefined && ed.selection.getNode().getAttribute('class') == 'changestracking_new') {
					return false;
				}
				if(ed.selection.getNode().nodeName != undefined && ed.selection.getNode().nodeName == 'SPAN' && ed.selection.getNode().attributes != undefined && ed.selection.getNode().getAttribute('class') == 'changestracking_original') {
					return false;
				}
			}
		}
		
	} // eof changesTracking

	if ((e.type == 'dblclick' && e.button == 0) || (e.type == 'keypress' && e.keyCode == '113')) {
		
		if(e.type == 'dblclick') {
			var selectedNode = e.target;
		} else {
			var selectedNode = ed.selection.getNode();
		}
		
		if(selectedNode.nodeName == 'HTML') {
			return false;
		}
		
		while(selectedNode.nodeName != 'BODY') {
			if(selectedNode.attributes != undefined) {
				
				// QY Comments
				if (selectedNode.nodeName == 'DIV' && selectedNode.getAttribute('class') == 'mceNonEditable qy_comment') {
					runComment(selectedNode);
					break;
				}

				// Gap InlineChoice
				if (selectedNode.nodeName == 'DIV' && selectedNode.id == 'gapInlineChoiceInteraction') {
					runGapInlineChoiceInteraction(selectedNode);
					//runGapInlineChoice(selectedNode);
					break;
				}
				
				// PlayPause
				if (selectedNode.nodeName == 'IMG' && selectedNode.attributes != undefined && selectedNode.getAttribute('id') == 'mcePlayPause') {
					runPlayPause(selectedNode);
					break;
				}
				
				// MediaLib
				if(selectedNode.nodeName == 'IMG' || (selectedNode.nodeName == 'FIELDSET' && selectedNode.id == 'runFileUploadLib')) {
					runMediaLib(selectedNode);
					break;
				}
				
				// Multiple choice
				if ((selectedNode.nodeName == 'P' && selectedNode.id == 'choiceInteraction' && selectedNode.parentNode.id == 'choiceInteraction') || (selectedNode.nodeName == 'DIV' && selectedNode.id == 'choiceInteraction')) {
					runChoiceInteraction(selectedNode);
					break;
				}

				// Drag and Drop
				if ((selectedNode.nodeName == 'P' && selectedNode.id == 'dragDropInteractionContents') || (selectedNode.nodeName == 'DIV' && selectedNode.id == 'dragDropInteraction')) {
					runDraggable(selectedNode);
					break;
				}

				// Selection
				if (selectedNode.nodeName == 'DIV' && selectedNode.id == 'selectionInteraction') {
					runSelectionInteraction(selectedNode);
					break;
				}
				
				// Order
				if (selectedNode.id == 'orderOption' || (selectedNode.id == 'choiceInteraction' && selectedNode.parentNode.id == 'orderInteraction')) {
					runOrder(selectedNode);
					break;
				}
				
				// Match
				if (selectedNode.id != undefined && (selectedNode.id == 'matchInteraction' || selectedNode.id.match(/canvas_/))) {
					runMatch(selectedNode);
					break;
				}

				// Identification
				if (selectedNode.id == 'identificationInteraction' || selectedNode.id == 'identificationAnswer' || selectedNode.parentNode.id == 'identificationAnswer') {
					runIdentification(selectedNode);
					break;
				}

			}
			selectedNode = selectedNode.parentNode;
		}
		
	}
	return true;
	
}

function runGapInlineChoiceInteraction(selectedNode) {
	
	var body = selectedNode;
        while(body.nodeName != 'BODY') {
                body = body.parentNode;
        }
	var xh = tinymce.EditorManager.activeEditor.XmlHelper;

	var data = new Array();
	data['question'] = selectedNode.children[0].innerHTML;
	data['content'] = null;
	data['inlineRows'] = new Array();
	var contentElement = selectedNode.children[1];
	var contentText = '';
	var nodeCounter = 0;

	for(var i = 0; i < contentElement.childNodes.length; i++) {
//	for ( var i in contentElement.childNodes) {
		var node = contentElement.childNodes[i];
		//console.log(node.nodeValue+' '+node.nodeType);
		if (3 == node.nodeType) { //text node
			contentText += node.nodeValue;
		} else if (1 == node.nodeType) { //zwykly html node
			//node.parentNode.removeChild(node);
		} else if (8 == node.nodeType) { //comment node
			var child = $(node.nodeValue).get(0);
			
			if ('TEXTENTRYINTERACTION' == child.tagName) {
				contentText += '[gap#'+nodeCounter+']';
				var feedback = new Array();
					feedback['onOk'] = '';
					feedback['onWrong'] = '';
				
				for (k = 0; k < child.childNodes.length; k++) {
					if ('CORRECT' == child.childNodes[k].getAttribute('mark')) {
						feedback['onOk'] = child.childNodes[k].innerHTML;
					} 
					if ('WRONG' == child.childNodes[k].getAttribute('mark')) {
						feedback['onWrong'] = child.childNodes[k].innerHTML;
					} 
				}
				
				data['inlineRows'].push({
							answer: contentElement.childNodes[i].nextSibling.innerHTML,
							feedback: feedback,
							id: nodeCounter,
							identifier: child.getAttribute('responseIdentifier'),
							type: 'gap'
			}
				);
				
				nodeCounter++;
			} else if ('INLINECHOICEINTERACTION' == child.tagName) {
				contentText += '[inlineChoice#'+nodeCounter+']';
				
				var span = contentElement.childNodes[i].nextSibling;
				var n = null;
				var comment = null;

				var points = new Array();
				var ids = new Array();
				var answers = new Array();
				var fixed = new Array();
				var feedbacks = new Object();
				var shuffle = false;
				
				if ("true" == child.getAttribute('shuffle')) {
					shuffle = true;
				}

				for (var j = 0; j < span.childNodes.length; j++) {
					n = span.childNodes[j];

					if (8 == n.nodeType) {
						comment = $(n.nodeValue).get(0);
					
						if ('INLINECHOICE' == comment.tagName) {
    							var correctResponse = xh.getCorrectResponseById(body, child.getAttribute('responseIdentifier'));

							if (correctResponse[0] == comment.getAttribute('identifier')) {
								points.push(1);
							} else {
								points.push(0);
							}
							ids.push(comment.getAttribute('identifier'));
							if ('true' == comment.getAttribute('fixed')) {
								fixed.push(1);
							} else {
								fixed.push(0);
							}
							
							if (comment.lastChild != null && 'FEEDBACKINLINE' == comment.lastChild.tagName) {
								feedbacks[comment.getAttribute('identifier')] = comment.lastChild.innerHTML;
								comment.removeChild(comment.lastChild);
							}
							answers.push(comment.innerHTML);
						}
					}
				}
				
				data['inlineRows'].push({
					answers: answers,
					feedbacks: feedbacks,
					fixed: fixed,
					id: nodeCounter,
					identifier: child.getAttribute('responseIdentifier'),
					ids: ids,
					points: points,
					shuffle: shuffle,
					type: 'inlineChoice'
				});
				
				var tmpNode = node;

				while (null != tmpNode.nextSibling) {
					
					tmpNode = tmpNode.nextSibling;
					
					if (8 == tmpNode.nodeType && tmpNode.nodeValue == '</inlineChoiceInteraction>') {
						break;
					}
					i++;
				}
				i--; // cofam o 1 bo petla for(var i) zrobi jeszcze i++
				nodeCounter++;
			}
		}
	}
	data['content'] = contentText;
	tinyMCE.selectedNode = selectedNode;
	tinyMCE.execCommand('mceGapInlineChoice', false, data);
}

//choiceInteraction DblClick
function runChoiceInteraction(selectedNode) {
	var sectionDiv = selectedNode;
	while(sectionDiv.nodeName != 'DIV') {
		sectionDiv = sectionDiv.parentNode;
	}

	var answers = new Array();
	var points = new Array();
	var ids = new Array();
	var fixed = new Array();
	var fdb = new Array();
	var data = new Array();

	//choiceInteraction comment as node
	var ch = sectionDiv.previousSibling.nodeValue;

	var identifier = $(ch).attr('responseIdentifier');
	var shuffle = $(ch).attr('shuffle');
	var maxChoices = $(ch).attr('maxChoices');

	//question content
	data.push(sectionDiv.firstElementChild.innerHTML);	

	var feedback = null;
	var smCh = null;
	var feedbacks = new Array();
	for (i = 0; i < sectionDiv.childNodes.length; i++) {

		if (sectionDiv.childNodes[i].nodeType == 8) { //if Comment

			if (sectionDiv.childNodes[i].nextSibling.nextElementSibling.checked == true) {
				points.push('1');
			} else {
				points.push('0');
			}
			smCh = sectionDiv.childNodes[i].nodeValue;
			
			if ($(smCh).get(0).firstChild.tagName == 'IMG') {
				answers.push('<img src="'+$(smCh).get(0).firstChild.getAttribute('src')+'"/>');
			} else {
				answers.push($(smCh).get(0).firstChild.nodeValue);
			}
			
			//feedback = $(':last', smCh).get(0);
			feedback = $(smCh).get(0).lastElementChild;
			ids.push($(smCh).attr('identifier'));
			fixed.push($(smCh).attr('fixed'));

			if (null != feedback && feedback.tagName == 'FEEDBACKINLINE') {
				//fdb[identifier] = new Array()[$(smCh).attr('identifier')] = $(':first', smCh).html();
				feedbacks[$(smCh).attr('identifier')] = {text: feedback.innerHTML, sound: null};
			}
		}
	}
	fdb[identifier] = feedbacks;

	data.push(answers);
	data.push(points);
	data.push(ids);
	data.push(identifier);
	data.push(shuffle);
	data.push(fixed);
	data.push(maxChoices);
	data.push(fdb);
	data.push(new Array());
	tinyMCE.selectedNode = selectedNode;
	tinyMCE.execCommand('mceChoice', false, data);
}

//selectionInteraction DblClick
function runSelectionInteraction(selectedNode) {
	var sectionDiv = selectedNode;
	while(sectionDiv.nodeName != 'DIV') {
		sectionDiv = sectionDiv.parentNode;
	}

	var body = sectionDiv;
	while(body.nodeName != 'BODY') {
		body = body.parentNode;
	}

	var simpleChoices = new Array();
	var items = new Array();

	var answers = new Array();
	var ids_ch = new Array();
	var ids_ans = new Array();
	var choices = new Array();
	var fixed_ans = new Array();
	var feedbacks = new Array();
	var points = new Array();
	var question = '';

	//choiceInteraction comment as node
	var sh = sectionDiv.previousSibling.nodeValue;

	var identifier = $(sh).attr('responseIdentifier');
	var shuffle = $(sh).attr('shuffle');

	//question content
	question = sectionDiv.firstElementChild.innerHTML;	
	var tBody = sectionDiv.firstElementChild.nextElementSibling.firstElementChild;

	for (var i = 0; i < tBody.childNodes.length; i++) {

		if (i == 0) { //sekcja z options

			for (var j = 1; j < tBody.childNodes[i].childNodes.length; j++) {
				simpleChoices.push($(tBody.childNodes[i].childNodes[j].firstChild.nodeValue).get(0));
			}

		} else { //sekcja z items
			items.push($(tBody.childNodes[i].childNodes[0].firstChild.nodeValue).get(0));
		}
	}

	feedbacks['text'] = new Array();

	for (var i in items) {
		var onOk= '';
		var onWrong = '';

		for (var j = items[i].childNodes.length-1; j > 0; j--) {

			if ('CORRECT' == items[i].childNodes[j].getAttribute('mark')) {
				onOk = items[i].childNodes[j].innerHTML; 

			} else {
				onWrong = items[i].childNodes[j].innerHTML;
			}
			items[i].removeChild(items[i].childNodes[j]);
		}
		fixed_ans.push(items[i].getAttribute('fixed'));
		ids_ans.push(items[i].getAttribute('identifier'));
		feedbacks['text'][items[i].getAttribute('identifier')] = {onOk: onOk, onWrong: onWrong};
		answers.push(items[i].innerHTML);
	}

	for ( var i in simpleChoices) {
		ids_ch.push(simpleChoices[i].getAttribute('identifier'));
		choices.push(simpleChoices[i].innerHTML);
	}

	var xh = tinymce.EditorManager.activeEditor.XmlHelper;
	var correctResponse = xh.getCorrectResponseById(body, identifier);

	for(var i = 0; i < correctResponse.length; i++) {
		var rs = correctResponse[i].split(' ');
		points[rs[0]] = rs[1];
	}

	var data = new Array();
	data['answers'] = answers;
	data['choices'] = choices;
	data['identifier'] = identifier;
	data['question'] = question;
	data['shuffle'] = shuffle;
	data['feedbacks'] = feedbacks;
	data['ids_ans'] = ids_ans;
	data['ids_ch'] = ids_ch;
	data['fixed_ans'] = fixed_ans;
	data['points'] = points;
	data.fd = new Array();

	tinyMCE.selectedNode = selectedNode;
	tinyMCE.execCommand('mceSelection', false, data);
}

function cutQTI(content) {
	
	content = content.replace(/<!-- \?(xml[^\?]*)\? -->/gi,'');
	
	content = content.replace(/<!-- (<assessmentItem [^>]*>) -->/gi,'');
	content = content.replace(/<!-- (<\/assessmentItem>) -->/gi,'');
	
	content = content.replace(/<!-- (<responseDeclaration[^>]*>)/gi,'');
	content = content.replace(/(<\/responseDeclaration>) -->/gi,'');
	
	content = content.replace(/<!-- (<itemBody>) -->/gi,'');
	content = content.replace(/<!-- (<\/itemBody>) -->/gi,'');
	
	content = content.replace(/<!-- (<gap[^>]*>[^<]*<\/gap>) --><span id="gap" class="mceNonEditable"[^>]*>([^<]*)<\/span>/gi, '');
	
	content = content.replace(/(?:<p>)?<!-- (<choiceInteraction[^>]*>) -->(?:<\/p>)?<div id="choiceInteraction" class="mceNonEditable"[^>]*>/gi, '');
	content = content.replace(/<p id="choiceInteraction">([^<]*)<\/p>/gi, '');
	content = content.replace(/<!-- (<simpleChoice[^>]*>([^<]*|[^<]*<img[^>]*>[^<]*)<\/simpleChoice>) --><br[^>]*><input id="choiceInteraction" [^>]*>(<img[^>]*>|[^<]*)/gi,'');
	content = content.replace(/<\/p><\/div><!-- end of choiceInteraction -->/gi,'');
	
	content = content.replace(/(?:<p>)?<!-- (<inlineChoiceInteraction[^>]*>) -->(?:<\/p>)?<span id="inlineChoiceInteraction" class="mceNonEditable"[^>]*>/gi, '');
	content = content.replace(/<!-- (<inlineChoice[^>]*>[^<]*<\/inlineChoice>) --><span id="inlineChoiceAnswer"[^>]*>[^<]*(?:<span[^>]*>[^<]*<\/span>)?<\/span>/gi,'');
	content = content.replace(/<\/span>[^<]*(?:<\/p>)?[^<]*<!-- end of inlineChoiceInteraction -->/gi,'');
	
	content = content.replace(/(?:<p>)?<!-- (<orderInteraction[^>]*>) -->(?:<\/p>)?<div id="orderInteraction"[^>]*>/gi, '');
	content = content.replace(/<!-- (<simpleChoice[^>]*>([^<]*|[^<]*<img[^>]*>[^<]*)<\/simpleChoice>) -->(?:<\/p>)?<div id="orderOption" [^>]*>(<img[^>]*>|[^<]*)<\/div>/gi,'');
	content = content.replace(/<\/div><!-- end of orderInteraction -->/gi,'');
	
	content = content.replace(/<!-- (<matchInteraction[^>]*>) --><div id="matchInteraction" class="mceNonEditable"[^>]*>/gi, '');
	content = content.replace(/<p id="matchInteraction">([^<]*)<\/p><table[^>]*><tbody><tr[^>]*>/gi, '');
	content = content.replace(/<td id="canvas_td"[^>]*><canvas[^>]*><\/canvas><\/td>/gi, '');
	content = content.replace(/<!-- (<simpleMatchSet>) --><td[^>]*><table[^>]*><tbody>/gi, '');
	content = content.replace(/(<tr id="canvas_tr"[^>]*><td[^>]*><canvas id="canvas"[^>]*><\/canvas><\/td><\/tr>)/gi,'');
	content = content.replace(/<!-- (<simpleAssociableChoice[^>]*>([^<]*|[^<]*<img[^>]*>[^<]*)<\/simpleAssociableChoice>) --><tr[^>]*><td[^>]*><span[^>]*>[^<]*<\/span><span[^>]*>[^<]*<\/span><span[^>]*>([^<]*|[^<]*<img[^>]*>[^<]*)<\/span><\/td><\/tr>/gi, '');
	content = content.replace(/<!-- (<\/simpleMatchSet>) --><\/tbody><\/table><\/td>/gi, '');
	content = content.replace(/<\/tr><\/tbody><\/table><\/div><!-- end of matchInteraction -->/gi, '');
	
	content = content.replace(/(<!-- (<modalFeedback [^>]*>[^<]*<\/modalFeedback>) -->)(?! -->)/gi, '');
	
	return content;
	
}
