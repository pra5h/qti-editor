function QTI2HTML(h) {

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

	h = h.replace(/(<span[^>]*class="changestracking_original"[^>]*style=")("[^>]*>)/gi,'$1color: red; text-decoration: line-through;$2');
	h = h.replace(/(<span[^>]*class="changestracking_new"[^>]*style=")[^"]*("[^>]*>)/gi,'$1color: red; text-decoration: underline;$2');

	h = h.replace(/<u[^>]*style="[^"]*"[^>]*>(.*?)<\/u>/gi,'<span class="changestracking_new" style="color: red; text-decoration: underline;" title="Changes tracking: new content">$1</span>');
	h = h.replace(/<strike[^>]*style="[^"]*"[^>]*>(.*?)<\/strike>/gi,'<span class="changestracking_original" style="color: red; text-decoration: line-through;" title="Changes tracking: original content">$1</span>');

	setCanvasParams();

	// bug 35201
	if(h.match(/^<table[^>]*>.*<\/table>$/i) == undefined) {
		h = processQTI(h);
		h = processQYComments(h);
		h = processPlayPause(h);
		h = processEmbeds(h);
	}

	return h;

}

function HTML2QTI(h) {

	if(h.match(/<!-- <assessmentItem[^>]*>/i) && !h.match(/<!-- \?xml version="1\.0" encoding="UTF-8"( standalone="no")?\? -->/i)) {
		h = h.replace(/(<!-- <assessmentItem[^>]*>)/i, '<!-- ?xml version="1.0" encoding="UTF-8" standalone="no"? -->$1');
	}

	// Remove illegal text before headins
	var beforeHeadings = h.match(/(.*?)(?=<!-- \?xml)/);
	if(beforeHeadings != undefined && beforeHeadings[1] != '') {
		h = h.replace(/(.*?)(?=<!-- \?xml)/,'');
	}
	if(beforeHeadings && beforeHeadings[1] != '') {
		h = h.replace(/<itemBody> -->/,'<itemBody> -->' + beforeHeadings[1]);
	}

	h = parseToQTI(h);
	h = parseCommentsToQY(h);
	h = parsePlayPauseToQTI(h);
	h = parseEmbedsToQTI(h);

	h = h.replace(/(<p[^>a-z]*>)/gi, '<qy:tag name="text">$1');
	h = h.replace(/(<\/p>)/gi, '$1</qy:tag>');

	h = h.replace(/(<span[^>]*class="changestracking_original"[^>]*style=")[^"]*("[^>]*>)/gi,'$1$2');
	h = h.replace(/(<span[^>]*class="changestracking_new"[^>]*style=")[^"]*("[^>]*>)/gi,'$1display: none;$2');

	//h = h.replace(/(<embed[^>]*>(?:<\/embed>)?)<img[^>]*id="mceVideo"[^>]*>/gi, '$1');

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

function processQTI(h) {

	// Prepare QTI base template if file is empty
	if(h == '<br mce_bogus="1" />' || h == '') {
		h = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p1 imsqti_v2p1.xsd"  identifier="" title="" adaptive="false" timeDependent="false"> <itemBody>' + h + '</itemBody></assessmentItem>';
	}

	// Remove illegal text before headins
	var beforeHeadings = h.match(/(.*?)(?=<\?xml)/);
	if(beforeHeadings != undefined && beforeHeadings[1] != '') {
		h = h.replace(/(.*?)(?=<\?xml)/,'');
	}

	// Get correct answers
	var pattern = /<responseDeclaration identifier="([^"]*)" cardinality="([^"]*)" baseType="[^"]*">[^<]*<correctResponse>[^<]*((?:<value>[^<]*<\/value>[^<]*)+)<\/correctResponse>[^<]*<\/responseDeclaration>/gi;
	var answers = new Array;
	while(response = pattern.exec(h)) {
		if(response != null) {
			var re = new RegExp(/<value>([^<]*)<\/value>/gi);
			var ans = new Array;
			var answersCounter = 0;
			while ((w = re.exec(response[3])) != null) {
				ans[answersCounter] = w[1];
				answersCounter++;
			}
			answers[response[1]] = new Array;
			answers[response[1]][0] = ans;
			answers[response[1]][1] = response[2];
		}
	}

	// QTI base template tags

	h = h.replace(/<\?(xml[^\?]*)\?>/gi,'<!-- ?$1? -->');

	h = h.replace(/(<assessmentItem [^>]*>)(?! -->)/gi,'<!-- $1 -->');
	h = h.replace(/(<\/assessmentItem>)(?! -->)/gi,'<!-- $1 -->');

	h = h.replace(/(<!-- )?(<responseDeclaration[^>]*>)/gi,function($0, $1){
		return $1 ? $0 : '<!-- ' + $0;
	});
	h = h.replace(/(<\/responseDeclaration>)(?! -->)/gi,"$1 -->");

	h = h.replace(/(<!-- )?(<styleDeclaration[^>]*>)/gi,function($0, $1){
		return $1 ? $0 : '<!-- ' + $0;
	});
	h = h.replace(/(<\/styleDeclaration>)(?! -->)/gi,"$1 -->");

	h = h.replace(/(<itemBody>)(?! -->)/gi,'<!-- $1 -->');
	// Paste illegal text that was before headins (if exists)
	if(beforeHeadings && beforeHeadings[1] != '') {
		h = h.replace(/<itemBody> -->/,'<itemBody> -->' + beforeHeadings[1]);
	}
	h = h.replace(/(<\/itemBody>)(?! -->)/gi,'<!-- $1 -->');

	h = h.replace(/<qy:tag[^>]*>/gi,'');
	h = h.replace(/<\/qy:tag>/gi,'');

	//GapInlineChoice support
	h = h.replace(/[\s]*(?! <!--)(<gapInlineChoiceInteraction[^>]*>)(?! -->)/gi, '<!-- $1 --><div id="gapInlineChoiceInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue;padding: 5px; background-color: rgb(240, 240, 240);" mce_style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">');
	h = h.replace(/[\s]*(?! <!--)<question>(.*)<\/question>(?! -->)[\s]*/gi, '<!-- <question> --><p id="gapInlineChoiceInteractionQuestion">$1</p><!-- </question> -->');
	h = h.replace(/[\s]*(?! <!--)<content>/gi, '<!-- <content> --><p id="gapInlineChoiceInteractionContent">');
	h = h.replace(/[\s]*(?! <!--)<\/content>/gi, '<\/p><!-- </content> -->');

	h = h.replace(/(<sourcesList>)(?! -->)[\s]*/gi, '<!-- $1 -->');
	h = h.replace(/[\s]*(?! <!--)(<\/sourcesList>)(?! -->)[\s]*/gi, '<!-- $1 -->');
	h = h.replace(/<\/gapInlineChoiceInteraction>(?! -->)/gi, '</div><!-- end of </gapInlineChoiceInteraction> -->');
	
	var sourcesPattern = /<!-- <sourcesList> -->([\s\S.]*)<!-- <\/sourcesList> -->/gi;
	var sources = sourcesPattern.exec(h);
	
	if (null != sources){
	var splitPattern = /(<[\sa-zA-Z]* responseIdentifier="[id_0-9]*"[^>]*>)/gi;
	var sourcesElements = sources[1].split(splitPattern);
	
		for(var i in sourcesElements) {
			var elementPattern = /<([\sa-zA-Z]*) responseIdentifier="([id_0-9]*)".*>/gi;
			var elm = elementPattern.exec(sourcesElements[i]);
			
			if (null != elm) {
				var replacementId = '';
				if ('inlineChoiceInteraction' == elm[1]) {
					replacementId = 'minlineChoice';
				} else if ('textEntryInteraction' == elm[1]) {
					replacementId = 'mgap';
				}
				
				var pattern = new RegExp('(<slot id="'+elm[2]+'"><\/slot>)(?! -->)', "gi");
				h = h.replace(pattern, '<!-- $1 --><span id="'+replacementId+'" style="border: 1px solid green;" mce_style="border: 1px solid green;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
			}
		}
	}

	// inlineChoice*
	h = h.replace(/[\s]?(<inlineChoiceInteraction responseIdentifier="[^"]+" shuffle="[^"]+"[^>]*>)(?! -->)/gi, '<!-- $1 --><span id="inlineChoiceInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; background-color: #f0f0f0;">');
	for(var i in answers) {
		for(var j in answers[i][0]) {
			var inlineChoice = new RegExp('(<inlineChoice identifier="' + answers[i][0][j] + '"[^>]*>([^<]*)(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)*[^<]*<\/inlineChoice>)(?! -->)', "gi");
			h = h.replace(inlineChoice, '<!-- $1 --><span id="inlineChoiceAnswer" style="border: none; color: blue; background-color: #f0f0f0;">$2<span style="color: green; font-weight: bold;"> &raquo;</span></span>');
		}
	}
	h = h.replace(/[\s]?(<inlineChoice[^>]*>([^<]*)(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)*[^<]*<\/inlineChoice>)(?! -->)/gi, '<!-- $1 --><span id="inlineChoiceAnswer" style="display: none;">$2</span>');
	h = h.replace(/<\/inlineChoiceInteraction>[\s]?/gi, '</span><!-- end of inlineChoiceInteraction -->');
	
	// gap*
	for(var i in answers) {
		for(var j in answers[i][0]) {
			var gap_rg = new RegExp('(<textEntryInteraction responseIdentifier="' + i + '"[^>]*>[^<]*(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)*[^<]*<\/textEntryInteraction>)(?! -->)', "gi");
			h = h.replace(gap_rg, '<!-- $1 --><span id="gap" class="mceNonEditable" style="border: 1px solid blue; color: blue; background-color: #f0f0f0;">' + answers[i][0][j] + '</span>');
		}
	}
	h = h.replace(/(<textEntryInteraction[^>]*>[^<]*(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)*[^<]*<\/textEntryInteraction>)(?! -->)/gi, "<!-- $1 --><span id=\"gap\" class=\"mceNonEditable\" style=\"border: 1px solid blue; color: blue; background-color: #f0f0f0;\">$2</span>");

	//Order support
	h = h.replace(/(<orderInteraction[^>]*>)(?! -->)/gi, '<!-- $1 --><div id="orderInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">');
	h = h.replace(/<prompt>([^<]*)<\/prompt>(?=\s*<simpleChoice)/gi, '<p id="choiceInteraction">$1</p>');
	for(var i in answers) {
		if(answers[i][1] == 'ordered') {
			for(var j in answers[i][0]) {
				var idj = parseInt(j);
				idj++;
				var simpleChoice = new RegExp('(<simpleChoice identifier="' + answers[i][0][j] + '"[^>]*>([^<]*|[^<]*<img[^>]*>[^<]*)<\/simpleChoice>)(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)?[^<]*(?! -->)', "gi");
				h = h.replace(simpleChoice, '<!-- $1 --><div id="orderOption" name="' + idj + '" style="border: 1px solid green; margin: 2px;">$2</div><!-- $3 -->');
			}
		}
	}
	h = h.replace(/(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)(?=<\/orderInteraction>)/gi, '<!-- $1 -->');
	h = h.replace(/<\/orderInteraction>/gi,'</div><!-- end of orderInteraction -->');

	//Selection support
	h = h.replace(/(<selectionInteraction[^>]*>)(?! -->)/gi, '<!-- $1 --><div id="selectionInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">');
	h = h.replace(/<prompt>([^<]*)<\/prompt>(?=\s*<simpleChoice)/gi, '<p id="choiceInteraction">$1</p>');
	for(var i in answers) {
		if(answers[i][1] != 'ordered') {
			for(var j in answers[i][0]) {
				var simpleChoice = new RegExp('(<simpleChoice identifier="' + answers[i][0][j] + '"[^>]*>([^<]*|[^<]*<img[^>]*>[^<]*)(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)?<\/simpleChoice>)(?! -->)', "gi");
				h = h.replace(simpleChoice, '<!-- $1 --><br /><input id="choiceInteraction" name="simpleChoice" type="checkbox" checked="checked" />$2');
			}
		}
	}
	var sc = new RegExp('(<simpleChoice[^>]*>([^<]*|[^<]*<img[^>]*>[^<]*)(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)?<\/simpleChoice>)(?! -->)', 'gi');
	h = h.replace(sc, '<!-- $1 --><br /><input id="choiceInteraction" name="simpleChoice" type="checkbox" />$2');
	var sc = new RegExp('(<item[^>]*>([^<]*)(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)?<\/item>)(?! -->)', 'gi');
	h = h.replace(sc, '<!-- $1 --><li>$2</li>');
	h = h.replace(/<\/selectionInteraction>/gi, '</div><!-- end of selectionInteraction -->');


	//Choices support
	h = h.replace(/(<choiceInteraction[^>]*>)(?! -->)/gi, '<!-- $1 --><div id="choiceInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">');
	h = h.replace(/<prompt>([^<]*)<\/prompt>(?=\s*<simpleChoice)/gi, '<p id="choiceInteraction">$1</p>');
	for(var i in answers) {
		if(answers[i][1] != 'ordered') {
			for(var j in answers[i][0]) {
				var simpleChoice = new RegExp('(<simpleChoice identifier="' + answers[i][0][j] + '"[^>]*>([^<]*|[^<]*<img[^>]*>[^<]*)(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)?<\/simpleChoice>)(?! -->)', "gi");
				h = h.replace(simpleChoice, '<!-- $1 --><br /><input id="choiceInteraction" checked="checked" name="simpleChoice" type="checkbox" />$2');
			}
		}
	}
	var sc = new RegExp('(<simpleChoice[^>]*>([^<]*|[^<]*<img[^>]*>[^<]*)(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)?<\/simpleChoice>)(?! -->)', 'gi');
	h = h.replace(sc, '<!-- $1 --><br /><input id="choiceInteraction" name="simpleChoice" type="checkbox" />$2');
	h = h.replace(/<\/choiceInteraction>/gi, '</div><!-- end of choiceInteraction -->');

	//DragDrop support
	h = h.replace(/(<dragDropInteraction[^>]*>)(?! -->)/gi, '<!-- $1 --><div id="dragDropInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">');
	h = h.replace(/<contents>(.*)<\/contents>(?! -->)/gi, '<!-- <contents> --><p id="dragDropInteractionContents">$1</p><!-- </contents> -->');
	h = h.replace(/(<slot>(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)?<\/slot>)(?! -->)/gi, '<!-- $1 --><span id="mgap" style="border: 1px solid green;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
	h = h.replace(/(<sourcelist>)(?! -->)/gi, '<!-- $1 -->');
	h = h.replace(/(<\/sourcelist>)(?! -->)/gi, '<!-- $1 -->');
	var sc = new RegExp('(<dragElement[^>]*>([^<]*|[^<]*<img[^>]*>[^<]*)<\/dragElement>)(?! -->)', 'gi');
	h = h.replace(sc, '<!-- $1 --><span class="dragElement" name="dragElement" style="border: 1px solid green; margin: 5px;">$2</span>');
	h = h.replace(/<\/dragDropInteraction>/gi, '</div><!-- end of dragDropInteraction -->');

	//Identification support
	h = h.replace(/(<identificationInteraction responseIdentifier="[^"]+" shuffle="[^"]+"[^>]*>)(?! -->)/gi, '<!-- $1 --><div id="identificationInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; background-color: #f0f0f0;">');
	h = h.replace(/<\/identificationInteraction>/gi, '</div><!-- end of identificationInteraction -->');

	//Match support
	h = h.replace(/(<matchInteraction[^>]*>)(?! -->)/gi, '<!-- $1 --><div id="matchInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">');
	h = h.replace(/(<prompt>([^<]*)<\/prompt>)(?=\s*<simpleMatchSet)/gi, '<p id="matchInteraction">$2</p><table align="center" border=0 style="border: none;"><tbody><tr valign="top" style="border: none;">');
	h = h.replace(/(<simpleMatchSet>)(?! -->)/gi, '<!-- $1 --><td align="center" style="border: none;"><table class="mceNonEditable" width="100%" border=0 style="border: none;"><tbody>');
	h = h.replace(/(<simpleAssociableChoice identifier="([^"]*)" fixed="true"[^>]*>([^<]*)(?:<feedbackInline[^>]*>[^<]*<\/feedbackInline>)*[^<]*<\/simpleAssociableChoice>)(?! -->)/gi, '<!-- $1 --><tr id="matchset" style="border: none;"><td align="center" style="border: none;"><span id="span_identifier" style="display: none;">$2</span><span id="span_fixed" style="display: none;">true</span><span id="matchInteraction" style="border: 1px solid blue; color: blue;">$3</span></td></tr>');
	h = h.replace(/(<simpleAssociableChoice identifier="([^"]*)" fixed="true"[^>]*>([^<]*)<img([^>]*)>([^<]*)(?:<feedbackInline[^>]*>[^<]*<\/feedbackInline>)*[^<]*<\/simpleAssociableChoice>)(?! -->)/gi, '<!-- $1 --><tr id="matchset" style="border: none;"><td align="center" style="border: none;"><span id="span_identifier" style="display: none;">$2</span><span id="span_fixed" style="display: none;">true</span><span id="matchInteraction" style="border: 1px solid blue; color: blue;">$3<img$4 height="16px">$5</span></td></tr>');
	h = h.replace(/(<simpleAssociableChoice identifier="([^"]*)"[^>]*>([^<]*)(?:<feedbackInline[^>]*>[^<]*<\/feedbackInline>)*[^<]*<\/simpleAssociableChoice>)(?! -->)/gi, '<!-- $1 --><tr id="matchset" style="border: none;"><td align="center" style="border: none;"><span id="span_identifier" style="display: none;">$2</span><span id="span_fixed" style="display: none;">false</span><span id="matchInteraction" style="border: 1px solid blue; color: blue;">$3</span></td></tr>');
	h = h.replace(/(<simpleAssociableChoice identifier="([^"]*)"[^>]*>([^<]*)<img([^>]*)>([^<]*)(?:<feedbackInline[^>]*>[^<]*<\/feedbackInline>)*[^<]*<\/simpleAssociableChoice>)(?! -->)/gi, '<!-- $1 --><tr id="matchset" style="border: none;"><td align="center" style="border: none;"><span id="span_identifier" style="display: none;">$2</span><span id="span_fixed" style="display: none;">false</span><span id="matchInteraction" style="border: 1px solid blue; color: blue;">$3<img$4 height="16px">$5</span></td></tr>');
	h = h.replace(/(<\/simpleMatchSet>)(?! -->)/gi, '<!-- $1 --></tbody></table></td>');
	h = h.replace(/(<!-- <\/simpleMatchSet> --><\/tbody><\/table><\/td>)[^<]*(<!-- <simpleMatchSet> --><td[^>]*>)/gi, '$1<td id="canvas_td" width="200px" style="border: none;"><canvas id="canvas" width="200px" style="border: 1px solid blue;"></canvas></td>$2');
	h = h.replace(/(<\/matchInteraction>)(?! -->)/gi, '</tr></tbody></table></div><!-- end of matchInteraction -->');

	//Modal feedbacks
	h = h.replace(/(<modalFeedback[^>]*>)/gi, '<!-- $1 -->');
	h = h.replace(/(<\/modalFeedback>)/gi, '<!-- $1 -->');

	return h;

}

function processQYComments(h) {

	h = h.replace(/<span (id="[0-9]+" class="qy_comment") style="">/gi, '<span $1 style="color: red; background-color: #f0f0f0">');
	h = h.replace(/<qy:comment idref="([0-9]+)">([^<]*)<\/qy:comment>/gi, '<div id="ref_$1" class="mceNonEditable qy_comment" style="float: right; clear: both; border: 1px solid red; background-color: #f0f0f0; max-width: 20%;">$2</div>');
	return h;

}

function processPlayPause(h) {

	var fromPath = tinyMCE.gwtProxy.getPageBasePath();
	if(fromPath == undefined) return h;

	var prefix = fromPath.match(/^(.*\/)ctrl.php/i);
	h = h.replace(/(<audioPlayer[^>]*>)(?! -->)/gi, '<!-- $1 --><img id="mcePlayPause" src="' + prefix[1] + 'tools/qtitesteditor/tinymce/tiny_mce/plugins/qti_playpause/img/playpause.png" />');
	return h;

}

function processEmbeds(h) {

	var fromPath = tinyMCE.gwtProxy.getPageBasePath();
	if(fromPath == undefined) return h;

	var prefix = fromPath.match(/^(.*\/)ctrl.php/i);
	h = h.replace(/(<embed[^>]*>)(?!<img)/gi,'$1<img id="mceVideo" src="' + prefix[1] + 'tools/qtitesteditor/tinymce/tiny_mce/plugins/qti_addvideo/img/movie.png" />');

	return h;
	
}

function setCanvasParams() {

	var canvasParams = new Array;
	var matchInteractions = $('matchInteraction');

	matchInteractions.each(function(i) {
		var rid = matchInteractions[i].getAttribute('responseIdentifier');
		var sets = $('matchInteraction[responseIdentifier=\'' + rid + '\'] > simpleMatchSet');
		if(sets[0].childElementCount > sets[1].childElementCount) {
			var maxElements = sets[0].childElementCount;
		} else {
			var maxElements = sets[1].childElementCount;
		}

		var connIndexes = new Array;
		var connections = $('responseDeclaration[identifier=\'' + rid + '\'] > correctResponse').children();
		connections.each(function(i) {
			var conn = connections[i].innerHTML;
			conn = conn.split(' ');

			var posLeft = 0;
			for(i in sets[0].childNodes) {
				if(sets[0].childNodes[i].nodeType == 1 && sets[0].childNodes[i].nodeName == 'SIMPLEASSOCIABLECHOICE') {
					if(sets[0].childNodes[i].getAttribute('identifier') == conn[0]) {
						break;
					}
					posLeft++;
				}
			}

			var posRight = 0;
			for(i in sets[1].childNodes) {
				if(sets[1].childNodes[i].nodeType == 1 && sets[1].childNodes[i].nodeName == 'SIMPLEASSOCIABLECHOICE') {
					if(sets[1].childNodes[i].getAttribute('identifier') == conn[1]) {
						break;
					}
					posRight++;
				}
			}

			connIndexes.push(String(posLeft) + ' ' + String(posRight));

		});

		canvasParams[rid] = {maxElements: maxElements, connections: connIndexes};

	});

	tinyMCE.canvasParams = canvasParams;

}

function parseToQTI(h) {

	// Add QTI  headings
	if(h.match(/<!-- \?(xml[^\?]*)\? -->/gi)) {
		h = h.replace(/<!-- \?(xml[^\?]*)\? -->/gi,'<?$1?>');
	} else {
		h = h.replace(/^.*(<!-- <assessmentItem [^>]*> -->)/gmi,'<?xml version="1.0" encoding="UTF-8" standalone="no"?>$1\n');
	}

	h = h.replace(/<!-- (<assessmentItem [^>]*>) -->/gi,'$1');
	h = h.replace(/<!-- (<\/assessmentItem>) -->/gi,'$1');

	h = h.replace(/<!-- (<responseDeclaration[^>]*>)/gi,"$1");
	h = h.replace(/(<\/responseDeclaration>) -->/gi,"$1");

	h = h.replace(/<!-- (<styleDeclaration[^>]*>)/gi,"$1");
	h = h.replace(/(<\/styleDeclaration>) -->/gi,"$1");

	h = h.replace(/<!-- (<itemBody>) -->/gi,'$1');
	h = h.replace(/<!-- (<\/itemBody>) -->/gi,'$1');

	//GapInlineChoice support
	h = h.replace(/(?:<p>)?<!-- (<gapInlineChoiceInteraction[^>]*>) -->(?:<\/p>)?<div id="gapInlineChoiceInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">/gi, '<qy:tag name="exercise">$1');
	h = h.replace(/<!-- <question> --><p id="gapInlineChoiceInteractionQuestion">(.*)<\/p><!-- <\/question> -->/gi, '<question>$1</question>');
//	h = h.replace(/<!-- <content> --><p id="gapInlineChoiceInteractionContent">([\S\n\r\t\s.]*)<\/p><!-- <\/content> -->/gi, '<content>$1</content>');
	h = h.replace(/<!-- <content> --><p id="gapInlineChoiceInteractionContent">/gi, '<content>');
	h = h.replace(/<\/p><!-- <\/content> -->/gi, '</content>');
	//([\S\n\r\t\s.]*)<\/p><!-- <\/content> -->
	h = h.replace(/<!-- (<textEntryInteraction[^>]*>[^<]*(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)*[^<]*<\/textEntryInteraction>) --><span id="gap" class="mceNonEditable" style="border: 1px solid blue; color: blue; background-color: #f0f0f0;">([^<]*)<\/span>/gi, '$1');
	h = h.replace(/<!-- (<inlineChoiceInteraction[^>]*>) -->(?:<\/?p>)?<span id="inlineChoiceInteraction" class="mceNonEditable" style="[^"]*">/gi, '$1');
	h = h.replace(/<!-- (<inlineChoice[^>]*>[^<]*(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)*[^<]*<\/inlineChoice>) --><span id="inlineChoiceAnswer" style="[^"]*">[^<]*(?:<span[^>]*>[^<]*<\/span>)?<\/span>/gi,'$1');
	h = h.replace(/<!-- (<slot[^>]*>(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)?<\/slot>) --><span id="(?:(?:mgap)?|(?:minlineChoice)?)"[^>]*>[^<]*<\/span>/gi, '$1');
	h = h.replace(/<\/span>[^<]*(?:<\/p>)?[^<]*<!-- end of inlineChoiceInteraction -->/gi,'</inlineChoiceInteraction>');
	h = h.replace(/ mce_src="[^"]*"/gi,'');
	h = h.replace(/<!-- (<sourceslist>) -->/gi, '$1');
	h = h.replace(/<!-- (<\/sourceslist>) -->/gi, '$1');
	h = h.replace(/<\/div><!-- end of <\/gapInlineChoiceInteraction> -->/gi,'</gapInlineChoiceInteraction></qy:tag>');

	//Selection support
	h = h.replace(/(?:<p>)?<!-- (<selectionInteraction[^>]*>) -->(?:<\/p>)?<div id="selectionInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">/gi, '<qy:tag name="exercise">$1');
	h = h.replace(/<prompt>([^<]*)<\/prompt>(?=\s*<simpleChoice)/gi, '<p id="choiceInteraction">$1</p>');
	var sc = new RegExp('<!-- (<item[^>]*>([^<]*)(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)?<\/item>) --><li>[^<]*</li>', 'gi');
	h = h.replace(sc, '$1');
	h = h.replace(/<\/div><!-- end of selectionInteraction -->/gi, '</selectionInteraction></qy:tag>');

	//Choices support
	h = h.replace(/(?:<p>)?<!-- (<choiceInteraction[^>]*>) -->(?:<\/p>)?<div id="choiceInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">/gi, '<qy:tag name="exercise">$1');
	h = h.replace(/<p id="choiceInteraction">([^<]*)<\/p>/gi, '<prompt>$1</prompt>');
	h = h.replace(/<!-- (<simpleChoice[^>]*>([^<]*|[^<]*<img[^>]*>[^<]*)(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)?<\/simpleChoice>) --><br \/><input id="choiceInteraction" [^>]*>(<img[^>]*>|[^<]*)/gi,'$1');
	h = h.replace(/ mce_src="[^"]*"/gi,'');
	h = h.replace(/<\/div><!-- end of choiceInteraction -->/gi,'</choiceInteraction></qy:tag>');

	//DragDrop support
	h = h.replace(/(?:<p>)?<!-- (<dragDropInteraction[^>]*>) -->(?:<\/p>)?<div id="dragDropInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">/gi, '<qy:tag name="exercise">$1');
	h = h.replace(/<!-- <contents> --><p id="dragDropInteractionContents">(.*)<\/p><!-- <\/contents> -->/gi, '<contents>$1</contents>');
	h = h.replace(/<!-- (<slot>(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)?<\/slot>) --><span id="mgap"[^>]*>[^<]*<\/span>/gi, '$1');
	h = h.replace(/<!-- (<dragElement[^>]*>([^<]*|[^<]*<img[^>]*>[^<]*)<\/dragElement>) --><span class="dragElement"[^>]*>(<img[^>]*>|[^<]*)<\/span>/gi,'$1');
	h = h.replace(/ mce_src="[^"]*"/gi,'');
	h = h.replace(/<!-- (<sourcelist>) -->/gi, '$1');
	h = h.replace(/<!-- (<\/sourcelist>) -->/gi, '$1');
	h = h.replace(/<\/div><!-- end of dragDropInteraction -->/gi,'</dragDropInteraction></qy:tag>');

	//Identification support
	h = h.replace(/(?:<p>)?<!-- (<identificationInteraction[^>]*>) -->(?:<\/p>)?<div id="identificationInteraction"[^>]*>/gi, '<qy:tag name="exercise">$1');
	h = h.replace(/ mce_src="[^"]*"/gi,'');
	h = h.replace(/<\/div><!-- end of identificationInteraction -->/gi,'</identificationInteraction></qy:tag>');

	//Order support
	h = h.replace(/(?:<p>)?<!-- (<orderInteraction[^>]*>) -->(?:<\/p>)?<div id="orderInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">/gi, '<qy:tag name="exercise">$1');
	h = h.replace(/<p id="choiceInteraction">([^<]*)<\/p>/gi, '<prompt>$1</prompt>');
	h = h.replace(/<!-- (<simpleChoice[^>]*>([^<]*|[^<]*<img[^>]*>[^<]*)<\/simpleChoice>[^<]*) -->(?:<\/p>)?<div id="orderOption" [^>]*>(<img[^>]*>|[^<]*)<\/div>(?:<!-- (<feedbackInline[^>]*>[^<]*<\/feedbackInline>)* -->)?/gi,'$1$4');
	h = h.replace(/ mce_src="[^"]*"/gi,'');
	h = h.replace(/(?:<!-- (<feedbackInline[^>]*>[^<]*<\/feedbackInline>) -->)(?=<\/div><!-- end of orderInteraction -->)/gi, '$1');
	h = h.replace(/<\/div><!-- end of orderInteraction -->/gi,'</orderInteraction></qy:tag>');

	//Match support
	h = h.replace(/<!-- (<matchInteraction[^>]*>) --><div id="matchInteraction" class="mceNonEditable"[^>]*>/gi, '<qy:tag name="exercise">$1');
	h = h.replace(/<p id="matchInteraction">([^<]*)<\/p><table[^>]*><tbody><tr[^>]*>/gi, '<prompt>$1</prompt>');
	h = h.replace(/<td id="canvas_td"[^>]*><canvas[^>]*><\/canvas><\/td>/gi, '');
	h = h.replace(/<!-- (<simpleMatchSet>) --><td[^>]*><table class="mceNonEditable"[^>]*><tbody>/gi, '$1');
	h = h.replace(/(<tr id="canvas_tr"[^>]*><td[^>]*><canvas id="canvas"[^>]*><\/canvas><\/td><\/tr>)/gi,'');
	h = h.replace(/<!-- (<simpleAssociableChoice[^>]*>([^<]*|[^<]*<img[^>]*>[^<]*)(?:<feedbackInline[^>]*>[^<]*<\/feedbackInline>)*[^<]*<\/simpleAssociableChoice>) --><tr[^>]*><td[^>]*><span[^>]*>[^<]*<\/span><span[^>]*>[^<]*<\/span><span[^>]*>([^<]*|[^<]*<img[^>]*>[^<]*)<\/span><\/td><\/tr>/gi, '$1');
	h = h.replace(/<!-- (<\/simpleMatchSet>) --><\/tbody><\/table><\/td>/gi, '$1');
	h = h.replace(/<\/tr><\/tbody><\/table><\/div><!-- end of matchInteraction -->/gi, '</matchInteraction></qy:tag>');

	//Modal feedbacks
	h = h.replace(/<!-- (<modalFeedback[^>]*>) -->/gi, '$1');
	h = h.replace(/<!-- (<\/modalFeedback>) -->/gi, '$1');

	// Fix for bug #42087
	h = h.replace(/(<img[^>]*[^\/])(>)/gi,'$1 /$2');

	return h;

}

function parseCommentsToQY(h) {

	h = h.replace(/<span (id="[0-9]+" class="qy_comment") style="[^"]*">/gi, '<span $1 style="">');
	h = h.replace(/<div id="ref_([0-9]+)" class="mceNonEditable qy_comment" style="[^"]*">([^<]*)<\/div>/gi, '<qy:comment idref="$1">$2<\/qy:comment>');
	return h;

}

function parsePlayPauseToQTI(h) {

	h = h.replace(/<!-- (<audioPlayer[^>]*>) -->(?:<p>)?<img id="mcePlayPause"[^>]*>(?:<\/p>)?/gi, '<qy:tag name="media">$1</qy:tag>');
	return h;

}

function parseEmbedsToQTI(h) {

	h = h.replace(/<img id="mceVideo" src=".*?tools\/qtitesteditor\/tinymce\/tiny_mce\/plugins\/qti_addvideo\/img\/[^"]*"[^>]*>/gi,'');
	return h;

}

function applyFormatting(h) {

	h = h.replace(/(\n)+/g, '');

	// begin tags with two newlines before
	h = h.replace(/<(gapInlineChoiceInteraction|inlineChoiceInteraction|choiceInteraction|orderInteraction|matchInteraction|selectionInteraction|dragDropInteraction|identificationInteraction)([^>]*)>\s*/gi, '\n\n<$1$2>');

	// begin tags with one newline before
	h = h.replace(/<(qy:tag|textEntryInteraction|sourcesList|question|content|assessmentItem|modalFeedback)([^>]*)>\s*/gi, '\n<$1$2>');

	// begin tags with two newlines after
	h = h.replace(/<(assessmentItem|itemBody)([^>]*)>\s*/gi, '<$1$2>\n\n');

	// begin tags with one newline after
	h = h.replace(/<(qy:tag|content|simpleMatchSet|mapping|mapEntry|correctResponse|responseDeclaration|inlineChoiceInteraction|choiceInteraction|orderInteraction|matchInteraction|selectionInteraction|dragDropInteraction|identificationInteraction)([^>]*)>\s*/gi, '<$1$2>\n');

	// end tags with two newlines after
	h = h.replace(/<\/(gapInlineChoiceInteraction|responseDeclaration|inlineChoiceInteraction|choiceInteraction|orderInteraction|matchInteraction|selectionInteraction|dragDropInteraction|identificationInteraction)>\s*/gi, '</$1>\n\n');

	// end tags with one newline after
	h = h.replace(/<\/(qy:tag|sourcesList|simpleMatchSet|simpleAssociableChoice|mapping|assessmentItem|value|correctResponse|prompt|simpleChoice|inlineChoice|item|contents|sourcelist|dragElement)>\s*/gi, '</$1>\n');

	// end tags with one newline after (spacje pozostają nie zamieniane na newline)
	h = h.replace(/<\/(slot)>/gi, '</$1>\n');

	// end tags with two newlines before
	h = h.replace(/<\/(itemBody)>\s*/gi, '\n\n</$1>');

	// end tags with one newline before
	h = h.replace(/<\/(qy:tag|assessmentItem)>/gi, '\n</$1>');

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
					runGapInlineChoice(selectedNode);
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
					runMultipleChoice(selectedNode);
					break;
				}

				// Drag and Drop
				if ((selectedNode.nodeName == 'P' && selectedNode.id == 'dragDropInteractionContents') || (selectedNode.nodeName == 'DIV' && selectedNode.id == 'dragDropInteraction')) {
					runDraggable(selectedNode);
					break;
				}

				// Selection
				if (selectedNode.nodeName == 'DIV' && selectedNode.id == 'selectionInteraction') {
					runSelection(selectedNode);
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

//QY Comments
function runComment(selectedNode) {
	
	var ed = tinymce.EditorManager.activeEditor;
	var comment_content = selectedNode.innerHTML;
	var idref = selectedNode.getAttribute('id');
	idref = idref.replace(/^ref_([0-9]+)/i, '$1');
	var commented_text = selectedNode.nextSibling;
	if(commented_text != undefined) {
		if(commented_text.nodeName != 'SPAN' || commented_text.id != idref) {
			for(i in commented_text.children) {
				if(commented_text.children[i].nodeName == 'SPAN' && commented_text.children[i].id == idref) {
					commented_text = commented_text.children[i];
					break;
				}
			}
		} 
		commented_text = commented_text.innerHTML;
		tinyMCE.execCommand('mceComment', false, {comment_content: comment_content, comment_id: idref, commented_text: commented_text});
	} else {
		tinyMCE.execCommand('mceComment', false, {comment_content: comment_content, comment_id: idref, commented_text: ''});
	}
		
}

//PlayPause
function runPlayPause(selectedNode) {

	var ed = tinymce.EditorManager.activeEditor;
	var src = selectedNode.previousSibling.data;
	//tinyMCE.execCommand('mcePlayPause', false, src: src);

}

//GapInlineChoice
function runGapInlineChoice(selectedNode) {
			
	var ed = tinymce.EditorManager.activeEditor;
	var qtiNode = selectedNode;
	var qtiNodeInnerHTML = qtiNode.innerHTML;
	var data = new Object();

	var rg = new RegExp(/<!-- <question> --><p id="gapInlineChoiceInteractionQuestion">(.*)<\/p><!-- <\/question> -->/gi);
	data.question = rg.exec(qtiNodeInnerHTML)[1];
	
	
	var sourceRg = new RegExp(/<!-- <sourcesList> -->([\s\S.]*)<!-- <\/sourcesList> -->/gi);
	var sourcesHtml = sourceRg.exec(qtiNodeInnerHTML);
	
	rg = new RegExp(/<!-- <content> --><p id="gapInlineChoiceInteractionContent">[\n]?([\s\S.]*)<\/p><!-- <\/content> -->/gi);
	var content = rg.exec(qtiNodeInnerHTML)[1];
	content = content.replace(/<span id="(?:(?:mgap)|(?:minlineChoice))"[^>]*>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<\/span>/gi, '');

	var slot = null;
	var nodeName = null;
	var nodeId = null;
	rg = new RegExp('<!-- (<slot id="(id_[0-9]+)"[^>]*>(<feedbackInline[^>]*>[^<]*<\/feedbackInline>)?<\/slot>) -->[\\n]?','gi');
	
	var i = 0;
	var tmpContent = content;
	var sourceRegexp = null;

	data.inlineRows = new Array();

	while (null != (slot = rg.exec(content))) {
		
		sourceRegexp = new RegExp('<!-- <([a-zA-Z]+) responseIdentifier="'+slot[2]+'"','gi');
		nodeName = sourceRegexp.exec(sourcesHtml)[1];

		if ('textEntryInteraction' == nodeName) {
			var gapElement = new Object();
			gapElement.id = i;
			gapElement.identifier = slot[2];
			
			var gapRegexp = new RegExp('<!-- <textEntryInteraction responseIdentifier="'+slot[2]+'" [^>]*><\/textEntryInteraction> --><span[^>]*>([^<]*)<\/span>','gi');
			var gapTag = gapRegexp.exec(sourcesHtml);
			gapElement.answer = gapTag[1];
			gapElement.type = 'gap';
			data.inlineRows.push(gapElement);
			tmpContent = tmpContent.replace(slot[0], '[gap#'+i+']');
			
		} else if ('inlineChoiceInteraction' == nodeName) {
			var inlChElement = new Object();
			inlChElement.id = i;
			inlChElement.identifier = slot[2];
			inlChElement.answers = new Array(); 
			inlChElement.fixed = new Array();
			inlChElement.ids = new Array();
			inlChElement.points = new Array();
			//console.log(sourcesHtml[1]);
			//var inlChRegexp = new RegExp('<!-- <inlineChoiceInteraction responseIdentifier="'+slot[2]+'" shuffle="([truefalse]+)"> --><span[^>]*><!-- <inlineChoice[^>]*>([^<]*)<\/inlineChoice> --><span[^>]*>([^<]*)<span[^>]*> »<\/span><\/span><!-- <inlineChoice identifier="(id_[0-9]+)" fixed="([truefalse]+)" >([^<]*)<\/inlineChoice> --><span[^>]*>([<]*)<\/span><\/span><!-- end of inlineChoiceInteraction -->', 'gi');
			//var inlChElement = inlChRegexp.exec(sourcesHtml[1]);
			//console.log(sourcesHtml[1]);
			var inlChInteractionRgx = new RegExp('<!-- <inlineChoiceInteraction responseIdentifier="'+slot[2]+'" shuffle="(true|false)"> -->([.\\n\\s\\S]*)?<!-- end of inlineChoiceInteraction -->', 'gi');
			var inChResult = inlChInteractionRgx.exec(sourcesHtml[1]);
			
			if ("true" == inChResult[1]) {
				inlChElement.shuffle = true;
			} else {
				inlChElement.shuffle = false;
			}
			
			var correctAnswersReg = new RegExp('<responseDeclaration identifier="' + inlChElement.identifier + '"[^>]*>[^<]*<correctResponse>[^<]*<value>([^<]*)?<\/value>[^<]*<\/correctResponse>[^<]*<\/responseDeclaration>','gi');
			var correctAnswerResult = correctAnswersReg.exec(ed.dom.doc.body.innerHTML);
			var correctAnswer = '';
			
			//jeżeli zdefiniowano poprawne odpowiedzi - może być null przy "paste QTI activity" bo tam nie kopiuje się poprawnych odpowiedzi
			if (null != correctAnswerResult) {
				correctAnswer = correctAnswerResult[1];
			}
			
			var inlChoiceRgx = new RegExp('<!-- <inlineChoice identifier="(id_[0-9]+)"(?: fixed="([^"]*)" )?>([^<]*)<\/inlineChoice> -->', 'gi');
			var inlChoice;
			var correctInlChReg;
			while(null != (inlChoice = inlChoiceRgx.exec(inChResult[2]))) {
				inlChElement.answers.push(inlChoice[3]);
				inlChElement.ids.push(inlChoice[1]);
				
				if ("true" == inlChoice[2]) {
					inlChElement.fixed.push(1);
				} else {
					inlChElement.fixed.push(0);
				}
				
				if ("undefined" != typeof correctAnswer && null != correctAnswer && inlChoice[1] == correctAnswer) {
						inlChElement.points.push(1);
				} else {
					inlChElement.points.push(0);
				}
			}
			data.inlineRows.push(inlChElement);
			tmpContent = tmpContent.replace(slot[0], '[inlineChoice#'+i+']');
		}
		i++;
	}
	
	data.content = tmpContent;
	tinyMCE.selectedNode = selectedNode;
	tinyMCE.execCommand('mceGapInlineChoice', false, data);
	/*
	var id = qtiNode.previousSibling.data;
	rg = new RegExp('<textEntryInteraction responseIdentifier="([^"]*)"[^>]*>',"gi");
	id = rg.exec(id);
	if(id[1] && id[1] != undefined && id[1] != '') {
		id = id[1];
	} else {
		id = '';
	}
	var body = ed.selection.dom.doc.body.innerHTML;
	
	rg = new RegExp('<feedbackInline[^>]*showHide="show"[^>]*>([^<]*)<\/feedbackInline>','gi');
	var onok = rg.exec(qtiNode.previousSibling.data);
	if(onok != undefined) {
		var oo = onok[1];
	} else {
		var oo = '';
	}
	rg = new RegExp('<modalFeedback[^>]*outcomeIdentifier="' + id + '"[^>]*showHide="show"[^>]*sound="([^"]*)"[^>]*>','gi');
	var onok_sound = rg.exec(body);
	if(onok_sound != undefined) {
		var oo_snd = onok_sound[1];
	} else {
		var oo_snd = '';
	}
	rg = new RegExp('<feedbackInline[^>]*showHide="hide"[^>]*>([^<]*)<\/feedbackInline>','gi');
	var onwrong = rg.exec(qtiNode.previousSibling.data);
	if(onwrong != undefined) {
		var ow = onwrong[1];
	} else {
		var ow = '';
	}
	rg = new RegExp('<modalFeedback[^>]*outcomeIdentifier="' + id + '"[^>]*showHide="hide"[^>]*sound="([^"]*)"[^>]*>','gi');
	var onwrong_sound = rg.exec(body);
	if(onwrong_sound != undefined) {
		var ow_snd = onwrong_sound[1];
	} else {
		var ow_snd = '';
	}
	
	var gapdata = {value: qtiNodeInnerHTML, id: id, onok: oo, onwrong: ow, onok_sound: oo_snd, onwrong_sound: ow_snd};
	
	tinyMCE.selectedNode = selectedNode;
	tinyMCE.execCommand('mceGap', false, gapdata);
	*/
	
}

//MediaLib
function runMediaLib(selectedNode) {

	var ed = tinymce.EditorManager.activeEditor;
	if(selectedNode.nodeName == 'IMG') {
		var node = selectedNode;
	} else {
		var node = selectedNode.getElementsByTagName('img')[0];
	}
	
	if(node.getAttribute('id') == 'mceVideo') {
		var src = node.previousSibling.getAttribute('src');
		var title = node.previousSibling.getAttribute('title');
		tinyMCE.execCommand('mceAddVideo', false, {src: src, title: title});
	} else {
		var src = node.attributes['src'].value;
		if(node.attributes['title'] != undefined) {
			var title = node.attributes['title'].value;
		} else {
			var title = '';
		}
		var data = {src: src, title: title};
		//src = src.split('/');
		//src = src[src.length - 1];
		tinyMCE.execCommand('mceAppendImageToPage', false, data);
	}

}

// Gap
function runGap(selectedNode) {
			
	var ed = tinymce.EditorManager.activeEditor;
	var qtiNode = selectedNode;
	var qtiNodeInnerHTML = qtiNode.innerHTML;
	
	var id = qtiNode.previousSibling.data;
	rg = new RegExp('<textEntryInteraction responseIdentifier="([^"]*)"[^>]*>',"gi");
	id = rg.exec(id);
	if(id[1] && id[1] != undefined && id[1] != '') {
		id = id[1];
	} else {
		id = '';
	}
	var body = ed.selection.dom.doc.body.innerHTML;
	
	rg = new RegExp('<feedbackInline[^>]*showHide="show"[^>]*>([^<]*)<\/feedbackInline>','gi');
	var onok = rg.exec(qtiNode.previousSibling.data);
	if(onok != undefined) {
		var oo = onok[1];
	} else {
		var oo = '';
	}
	rg = new RegExp('<modalFeedback[^>]*outcomeIdentifier="' + id + '"[^>]*showHide="show"[^>]*sound="([^"]*)"[^>]*>','gi');
	var onok_sound = rg.exec(body);
	if(onok_sound != undefined) {
		var oo_snd = onok_sound[1];
	} else {
		var oo_snd = '';
	}
	rg = new RegExp('<feedbackInline[^>]*showHide="hide"[^>]*>([^<]*)<\/feedbackInline>','gi');
	var onwrong = rg.exec(qtiNode.previousSibling.data);
	if(onwrong != undefined) {
		var ow = onwrong[1];
	} else {
		var ow = '';
	}
	rg = new RegExp('<modalFeedback[^>]*outcomeIdentifier="' + id + '"[^>]*showHide="hide"[^>]*sound="([^"]*)"[^>]*>','gi');
	var onwrong_sound = rg.exec(body);
	if(onwrong_sound != undefined) {
		var ow_snd = onwrong_sound[1];
	} else {
		var ow_snd = '';
	}
	
	var gapdata = {value: qtiNodeInnerHTML, id: id, onok: oo, onwrong: ow, onok_sound: oo_snd, onwrong_sound: ow_snd};
	
	tinyMCE.selectedNode = selectedNode;
	tinyMCE.execCommand('mceGap', false, gapdata);
	
}

// Inline choice
function runInlineChoice(selectedNode) {
			
	var ed = tinymce.EditorManager.activeEditor;
	var answers = new Array();
	var points = new Array();
	var ids = new Array();
	var fixed = new Array();
	var data = new Array();
	var fdb = new Array();
	
	var inlineChoiceSpan = selectedNode;
	while(inlineChoiceSpan.id != 'inlineChoiceInteraction') {
		inlineChoiceSpan = inlineChoiceSpan.parentNode;
	}
	var choiceSectionHTML = inlineChoiceSpan.innerHTML;
	if(inlineChoiceSpan.previousSibling != undefined) {
		if(inlineChoiceSpan.previousSibling.nodeName == "P") {
			var identifier = inlineChoiceSpan.previousSibling.innerHTML.match(/<inlineChoiceInteraction responseIdentifier="([^"]+)"[^>]*>/i);
			var shuffle = inlineChoiceSpan.previousSibling.innerHTML.match(/<inlineChoiceInteraction.*?shuffle="([^"]*)"[^>]*>/i);
		} else {
			var identifier = inlineChoiceSpan.previousSibling.data.match(/<inlineChoiceInteraction responseIdentifier="([^"]+)"[^>]*>/i);
			var shuffle = inlineChoiceSpan.previousSibling.data.match(/<inlineChoiceInteraction.*?shuffle="([^"]*)"[^>]*>/i);
		}
	} else {
		var identifier = inlineChoiceSpan.parentNode.previousSibling.data.match(/<inlineChoiceInteraction responseIdentifier="([^"]+)"[^>]*>/i);
		var shuffle = inlineChoiceSpan.parentNode.previousSibling.data.match(/<inlineChoiceInteraction.*?shuffle="([^"]*)"[^>]*>/i);
	}
	var answers_paragraph = choiceSectionHTML.match(/<!-- <inlineChoice identifier="[^"]*"[^>]*>[^<]*(?:<feedbackInline[^>]*>([^<]*)<\/feedbackInline>)?<\/inlineChoice> --><span id="inlineChoiceAnswer" style="[^"]*"[^>]*>([^<]*)(<span[^>]*>[^<]*<\/span>)?<\/span>/gi);
	var values = new Array();
	for (ans in answers_paragraph) {
		values.push(answers_paragraph[ans].match(/<!-- <inlineChoice identifier="([^"]*)"\s*(?:fixed="([^"]*)")?[^>]*>[^<]*(?:<feedbackInline[^>]*>([^<]*)<\/feedbackInline>)?<\/inlineChoice> --><span id="inlineChoiceAnswer" style="[^"]*"[^>]*>([^<]*)(<span[^>]*>[^<]*<\/span>)?<\/span>/i));
	}
	var i=0;
	while(values[i] != undefined) {
		ids.push(values[i][1]);
		answers.push(values[i][4]);
		if(values[i][5] != undefined) {
			points.push(1);
		} else {
			points.push(0);
		}
		if(values[i][2] == 'true') {
			fixed.push('true');
		} else {
			fixed.push('false');
		}
		fdb[values[i][1]] = values[i][3];
		i++;
	}
	
	data.push('');
	data.push(answers);
	data.push(points);
	data.push(ids);
	data.push(identifier[1]);
	data.push(shuffle[1]);
	data.push(fixed);
	data.push(fdb);
	
	var body = ed.selection.dom.doc.body.innerHTML;
	
	rg = new RegExp('<modalFeedback[^>]*senderIdentifier="' + identifier[1] + '"[^>]*identifier="([^"]*)"[^>]*sound="([^"]*)"[^>]*>','gi');
	var fdArr = body.match(rg);
	if(fdArr != undefined) {
		var fd = new Array;
		for (i in fdArr) {
			rg = new RegExp('<modalFeedback[^>]*senderIdentifier="' + identifier[1] + '"[^>]*identifier="([^"]*)"[^>]*sound="([^"]*)"[^>]*>','i');
			var arr = rg.exec(fdArr[i]);
			fd[arr[1]] = arr[2]
		}
		data.push(fd);
	}			
	
	tinyMCE.selectedNode = selectedNode;
	tinyMCE.execCommand('mceInlineChoice', false, data);
	
}

// Multiple choice
function runMultipleChoice(selectedNode) {
			
	var ed = tinymce.EditorManager.activeEditor;
	var answers = new Array();
	var points = new Array();
	var ids = new Array();
	var fixed = new Array();
	var fdb = new Array();
	var data = new Array();
	
	var sectionDiv = selectedNode;
	while(sectionDiv.nodeName != 'DIV') {
		sectionDiv = sectionDiv.parentNode;
	}
	var choiceSectionHTML = sectionDiv.innerHTML;
	var question = choiceSectionHTML.match(/<p id="choiceInteraction">([^<]*)<\/p>/i);
	if(sectionDiv.previousSibling.nodeName == "P") {
		var identifier = sectionDiv.previousSibling.innerHTML.match(/<choiceInteraction responseIdentifier="([^"]+)"[^>]*>/i);
		var shuffle = sectionDiv.previousSibling.innerHTML.match(/<choiceInteraction.*?shuffle="([^"]*)"[^>]*>/i);
		var maxChoices = sectionDiv.previousSibling.innerHTML.match(/<choiceInteraction.*?maxChoices="([^"]*)"[^>]*>/i);
	} else {
		var identifier = sectionDiv.previousSibling.data.match(/<choiceInteraction responseIdentifier="([^"]+)"[^>]*>/i);
		var shuffle = sectionDiv.previousSibling.data.match(/<choiceInteraction.*?shuffle="([^"]*)"[^>]*>/i);
		var maxChoices = sectionDiv.previousSibling.data.match(/<choiceInteraction.*?maxChoices="([^"]*)"[^>]*>/i);
	}
	var answers_paragraph = choiceSectionHTML.match(/<!-- <simpleChoice identifier="[^"]*"[^>]*>([^<]*|<img[^>]*>)[^<]*(?:<feedbackInline[^>]*>[^<]*<\/feedbackInline>)?[^<]*<\/simpleChoice>[^<]* --><br[^>]*><input id="choiceInteraction" (checked="checked")?[\s]*name="simpleChoice"[\s]*(?:type="checkbox")?[\s]*(?:type="checkbox")?>(<img[^>]*>|[^<]*)/gi);
	var values = new Array();
	for (ans in answers_paragraph) {
		values.push(answers_paragraph[ans].match(/<!-- <simpleChoice identifier="([^"]*)"\s*(?:fixed="([^"]*)")?[^>]*>(?:[^<]*|<img[^>]*>)[^<]*(?:<feedbackInline[^>]*>([^<]*)<\/feedbackInline>)?[^<]*<\/simpleChoice>[^<]* --><br[^>]*><input id="choiceInteraction" (checked="checked")?[\s]*name="simpleChoice"[\s]*(?:type="checkbox")?[\s]*(?:type="checkbox")?>(<img[^>]*>|[^<]*)/i));
	}
	var i=0;
	while(values[i] != undefined) {
		ids.push(values[i][1]);
		answers.push(values[i][5]);
		if(values[i][4] == 'checked="checked"') {
			points.push('1');
		} else {
			points.push('0');
		}
		fixed.push(values[i][2]);
		fdb[values[i][1]] = values[i][3];
		i++;
	}
	data.push(question[1]);
	data.push(answers);
	data.push(points);
	data.push(ids);
	data.push(identifier[1]);
	data.push(shuffle[1]);
	data.push(fixed);
	data.push(maxChoices[1]);
	data.push(fdb);
	
	var body = ed.selection.dom.doc.body.innerHTML;
	rg = new RegExp('<modalFeedback[^>]*senderIdentifier="' + identifier[1] + '"[^>]*identifier="([^"]*)"[^>]*sound="([^"]*)"[^>]*>','gi');
	var fdArr = body.match(rg);
	var fd = new Array;
	if(fdArr != undefined) {
		for (i in fdArr) {
			rg = new RegExp('<modalFeedback[^>]*senderIdentifier="' + identifier[1] + '"[^>]*identifier="([^"]*)"[^>]*sound="([^"]*)"[^>]*>','i');
			var arr = rg.exec(fdArr[i]);
			fd[arr[1]] = arr[2]
		}
	}
	data.push(fd);	
	tinyMCE.selectedNode = selectedNode;
	tinyMCE.execCommand('mceChoice', false, data);
	
}

// Drag and Drop
function runDraggable(selectedNode) {

	var ed = tinymce.EditorManager.activeEditor;
	var slots = new Array();
	var points = new Array();
	var ids = new Array();
	var fixed = new Array();
	var fdb = new Array();
	var data = {};

	var sectionDiv = selectedNode;
	while(sectionDiv.nodeName != 'DIV') {
		sectionDiv = sectionDiv.parentNode;
	}

	var body = sectionDiv;
	while(body.nodeName != 'BODY') {
		body = body.parentNode;
	}
	
	var draggableSectionHTML = sectionDiv.innerHTML;
	var contents = draggableSectionHTML.match(/<!-- <contents> --><p id="dragDropInteractionContents">(.*?)<\/p><!-- <\/contents> -->/i);
	if(sectionDiv.previousSibling.nodeName == "P") {
		var identifier = sectionDiv.previousSibling.innerHTML.match(/<dragDropInteraction responseIdentifier="([^"]+)"[^>]*>/i);
		var shuffle = sectionDiv.previousSibling.innerHTML.match(/<dragDropInteraction.*?shuffle="([^"]*)"[^>]*>/i);
	} else {
		var identifier = sectionDiv.previousSibling.data.match(/<dragDropInteraction responseIdentifier="([^"]+)"[^>]*>/i);
		var shuffle = sectionDiv.previousSibling.data.match(/<dragDropInteraction.*?shuffle="([^"]*)"[^>]*>/i);
	}

	var answers_paragraph = draggableSectionHTML.match(/<!-- <dragElement[^>]*>.*?<\/dragElement> --><span class="dragElement"[^>]*>(<img[^>]*>|[^<]*)<\/span>/gi);
	
	var values = new Array();
	for (ans in answers_paragraph) {
		values.push(answers_paragraph[ans].match(/<!-- <dragElement identifier="([^"]*)"\s*(?:fixed="([^"]*)")?[^>]*>([^<]*|<img[^>]*>)<\/dragElement> --><span class="dragElement"[^>]*>(<img[^>]*>|[^<]*)<\/span>/i));
	}
	var i=0;
	while(values[i] != undefined) {
		ids.push(values[i][1]);
		slots.push(values[i][3]);
		fixed.push(values[i][2]);
		//fdb[values[i][1]] = values[i][3];
		i++;
	}

	var rg = new RegExp('<responseDeclaration identifier="' + identifier[1] + '"[^>]*>[^<]*<correctResponse>[^<]*(?:[^<]*<value>[^<]*</value>[^<]*)*</correctResponse>[^<]*</responseDeclaration>','gi');
	var pointsSection = rg.exec(body.innerHTML);
	pointsSection = pointsSection[0];
	var valuesSection = pointsSection.match(/<value>([^<]*)<\/value>/gi);
	for (sec in valuesSection) {
		var rs = valuesSection[sec].match(/<value>([^<]*)<\/value>/i);
		points[sec] = rs[1];
	}

	data.contents = contents[1];
	data.slots = slots;
	data.points = points;
	data.ids = ids;
	data.identifier = identifier[1];
	data.shuffle = shuffle[1];
	data.fixed = fixed;
	data.fdb = fdb;

	var body = ed.selection.dom.doc.body.innerHTML;
	rg = new RegExp('<modalFeedback[^>]*senderIdentifier="' + identifier[1] + '"[^>]*identifier="([^"]*)"[^>]*sound="([^"]*)"[^>]*>','gi');
	var fdArr = body.match(rg);
	var fd = new Array;
	if(fdArr != undefined) {
		for (i in fdArr) {
			rg = new RegExp('<modalFeedback[^>]*senderIdentifier="' + identifier[1] + '"[^>]*identifier="([^"]*)"[^>]*sound="([^"]*)"[^>]*>','i');
			var arr = rg.exec(fdArr[i]);
			fd[arr[1]] = arr[2]
		}
	}
	data.fd = fd;
	tinyMCE.selectedNode = selectedNode;
	tinyMCE.execCommand('mceDraggable', false, data);

}

// Selection
function runSelection(selectedNode) {

	var ed = tinymce.EditorManager.activeEditor;
	var choices = new Array();
	var answers = new Array();
	var ids_ch = new Array();
	var ids_ans = new Array();
	var fixed_ch = new Array();
	var fixed_ans = new Array();
	var fdb = new Array();
	var points = new Array();
	var question = '';
	var data = {};

	var sectionDiv = selectedNode;
	while(sectionDiv.nodeName != 'DIV') {
		sectionDiv = sectionDiv.parentNode;
	}
	var body = sectionDiv;
	while(body.nodeName != 'BODY') {
		body = body.parentNode;
	}
	var selectionSectionHTML = sectionDiv.innerHTML;
	if(sectionDiv.previousSibling.nodeName == "P") {
		var identifier = sectionDiv.previousSibling.innerHTML.match(/<selectionInteraction responseIdentifier="([^"]+)"[^>]*>/i);
		var shuffle = sectionDiv.previousSibling.innerHTML.match(/<selectionInteraction.*?shuffle="([^"]*)"[^>]*>/i);
	} else {
		var identifier = sectionDiv.previousSibling.data.match(/<selectionInteraction responseIdentifier="([^"]+)"[^>]*>/i);
		var shuffle = sectionDiv.previousSibling.data.match(/<selectionInteraction.*?shuffle="([^"]*)"[^>]*>/i);
	}

	var question = selectionSectionHTML.match(/<p id="choiceInteraction">(.*?)<\/p>/i);

	var choices_paragraph = selectionSectionHTML.match(/<!-- <simpleChoice identifier="[^"]*"[^>]*>([^<]*)(?:<feedbackInline[^>]*>[^<]*<\/feedbackInline>)?[^<]*<\/simpleChoice>[^<]* --><br[^>]*><input id="choiceInteraction" (checked="checked" )?name="simpleChoice" type="checkbox">(<img[^>]*>|[^<]*)/gi);

	var answers_paragraph = selectionSectionHTML.match(/<!-- <item identifier="[^"]*"[^>]*>([^<]*)(?:<feedbackInline[^>]*>[^<]*<\/feedbackInline>)?[^<]*<\/item>[^<]* --><li>([^<]*)<\/li>/gi);

	var values_ch = new Array();
	for (ans in choices_paragraph) {
		values_ch.push(choices_paragraph[ans].match(/<!-- <simpleChoice identifier="([^"]*)"\s*(?:fixed="([^"]*)")?[^>]*>([^<]*)(?:<feedbackInline[^>]*>([^<]*)<\/feedbackInline>)?[^<]*<\/simpleChoice>[^<]* --><br[^>]*><input id="choiceInteraction" name="simpleChoice" (?:checked="checked" )?type="checkbox">([^<]*)/i));
	}

	var values_ans = new Array();
	for (ans in answers_paragraph) {
		values_ans.push(answers_paragraph[ans].match(/<!-- <item identifier="([^"]*)"\s*(?:fixed="([^"]*)")?[^>]*>([^<]*)(?:<feedbackInline[^>]*>([^<]*)<\/feedbackInline>)?<\/item> --><li>([^<]*)<\/li>/i));
	}

	var i=0;
	while(values_ch[i] != undefined) {
		ids_ch.push(values_ch[i][1]);
		choices.push(values_ch[i][3]);
		fixed_ch.push(values_ch[i][2]);
		i++;
	}

	var i=0;
	while(values_ans[i] != undefined) {
		ids_ans.push(values_ans[i][1]);
		answers.push(values_ans[i][3]);
		fixed_ans.push(values_ans[i][2]);
		fdb[values_ans[i][1]] = values_ans[i][3];
		i++;
	}

	var rg = new RegExp('<responseDeclaration identifier="' + identifier[1] + '"[^>]*>[^<]*<correctResponse>[^<]*(?:[^<]*<value>[^<]*</value>[^<]*)*</correctResponse>[^<]*</responseDeclaration>','gi');
	var pointsSection = rg.exec(body.innerHTML);
	pointsSection = pointsSection[0];
	var valuesSection = pointsSection.match(/<value>([^<]*)<\/value>/gi);
	for (sec in valuesSection) {
		var rs = valuesSection[sec].match(/<value>([^<]*)<\/value>/i);
		rs = rs[1];
		rs = rs.split(' ');
		points[rs[0]] = rs[1];
	}

	data.question = question[1];
	data.choices = choices;
	data.answers = answers;
	data.ids_ch = ids_ch;
	data.ids_ans = ids_ans;
	data.identifier = identifier[1];
	data.shuffle = shuffle[1];
	data.fixed_ch = fixed_ch;
	data.fixed_ans = fixed_ans;
	data.fdb = fdb;
	data.points = points;

	var body = ed.selection.dom.doc.body.innerHTML;
	rg = new RegExp('<modalFeedback[^>]*senderIdentifier="' + identifier[1] + '"[^>]*identifier="([^"]*)"[^>]*sound="([^"]*)"[^>]*>','gi');
	var fdArr = body.match(rg);
	var fd = new Array;
	if(fdArr != undefined) {
		for (i in fdArr) {
			rg = new RegExp('<modalFeedback[^>]*senderIdentifier="' + identifier[1] + '"[^>]*identifier="([^"]*)"[^>]*sound="([^"]*)"[^>]*>','i');
			var arr = rg.exec(fdArr[i]);
			fd[arr[1]] = arr[2]
		}
	}
	data.fd = fd;

	tinyMCE.selectedNode = selectedNode;
	tinyMCE.execCommand('mceSelection', false, data);

}

// Order 
function runOrder(selectedNode) {			
	
	var ed = tinymce.EditorManager.activeEditor;
	var answers = new Array();
	var points = new Array();
	var ids = new Array();
	var fixed = new Array();
	var data = new Array();
	var fdb = '';
	
	var sectionDiv = selectedNode;
	while(sectionDiv.nodeName != 'DIV' || sectionDiv.id != 'orderInteraction') {
		sectionDiv = sectionDiv.parentNode;
	}
	var orderSectionHTML = sectionDiv.innerHTML;
	var question = orderSectionHTML.match(/<p id="choiceInteraction">([^<]*)<\/p>/i);
	if(sectionDiv.previousSibling.nodeName == "P") {
		var identifier = sectionDiv.previousSibling.innerHTML.match(/<orderInteraction responseIdentifier="([^"]+)"[^>]*>/i);
		var shuffle = sectionDiv.previousSibling.innerHTML.match(/<orderInteraction.*?shuffle="([^"]*)"[^>]*>/i);
	} else {
		var identifier = sectionDiv.previousSibling.data.match(/<orderInteraction responseIdentifier="([^"]+)"[^>]*>/i);
		var shuffle = sectionDiv.previousSibling.data.match(/<orderInteraction.*?shuffle="([^"]*)"[^>]*>/i);
	}
	
	var answers_paragraph = orderSectionHTML.match(/<!-- <simpleChoice identifier="[^"]*"[^>]*>([^<]*|<img[^>]*>)(?=<feedbackInline[^>]*>[^<]*<\/feedbackInline>)?<\/simpleChoice>[^-]*-->(?:<\/p>)?<div id="orderOption" name="([0-9]+)"[^>]*>(<img[^>]*>|[^<]*)<\/div>/gi);
	var values = new Array();
	for (ans in answers_paragraph) {
		values.push(answers_paragraph[ans].match(/<!-- <simpleChoice identifier="([^"]*)"\s*(?:fixed="([^"]*)")?[^>]*>(?:[^<]*|<img[^>]*>)[^<]*(?:<feedbackInline[^>]*>([^<]*)<\/feedbackInline>)?<\/simpleChoice>[^-]*-->(?:<\/p>)?<div id="orderOption" name="([0-9]+)"[^>]*>(<img[^>]*>|[^<]*)<\/div>/i));
	}
	var i=0;
	while(values[i] != undefined) {
		var point = values[i][4];
		points.push(point);
		point--;
		ids[point] = values[i][1];
		answers[point] = values[i][5];
		fixed[point] = values[i][2];
		i++;
	}
	
	var fd = orderSectionHTML.match(/<feedbackInline[^>]*>([^<]*)<\/feedbackInline>/i);
	if(fd != undefined) {
		fdb = fd[1];
	}
	
	data.push(question[1]);
	data.push(answers);
	data.push(points);
	data.push(ids);
	data.push(identifier[1]);
	data.push(shuffle[1]);
	data.push(fixed);
	data.push(fdb);
	
	tinyMCE.selectedNode = selectedNode;
	tinyMCE.execCommand('mceOrder', false, data);
	
}

// Identification
function runIdentification(selectedNode) {

	var ed = tinymce.EditorManager.activeEditor;
	var answers = new Array();
	var points = new Array();
	var ids = new Array();
	var fixed = new Array();
	var fdb = new Array();
	var data = new Array();

	var sectionDiv = selectedNode;
	while(sectionDiv.nodeName != 'DIV') {
		sectionDiv = sectionDiv.parentNode;
	}
	var choiceSectionHTML = sectionDiv.innerHTML;
	if(sectionDiv.previousSibling.nodeName == "P") {
		var identifier = sectionDiv.previousSibling.innerHTML.match(/<identificationInteraction responseIdentifier="([^"]+)"[^>]*>/i);
		var shuffle = sectionDiv.previousSibling.innerHTML.match(/<identificationInteraction.*?shuffle="([^"]*)"[^>]*>/i);
		var max_selections = sectionDiv.previousSibling.innerHTML.match(/<identificationInteraction.*?max_selections="([^"]*)"[^>]*>/i);
		var separator = sectionDiv.previousSibling.innerHTML.match(/<identificationInteraction.*?separator="([^"]*)"[^>]*>/i);
	} else {
		var identifier = sectionDiv.previousSibling.data.match(/<identificationInteraction responseIdentifier="([^"]+)"[^>]*>/i);
		var shuffle = sectionDiv.previousSibling.data.match(/<identificationInteraction.*?shuffle="([^"]*)"[^>]*>/i);
		var max_selections = sectionDiv.previousSibling.data.match(/<identificationInteraction.*?max_selections="([^"]*)"[^>]*>/i);
		var separator = sectionDiv.previousSibling.data.match(/<identificationInteraction.*?separator="([^"]*)"[^>]*>/i);
	}
	var answers_paragraph = choiceSectionHTML.match(/<!-- <simpleChoice identifier="[^"]*"[^>]*>([^<]*|<img[^>]*>)[^<]*(?:<feedbackInline[^>]*>[^<]*<\/feedbackInline>)?[^<]*<\/simpleChoice>[^<]* --><br[^>]*><input id="choiceInteraction" name="simpleChoice"[\s]*(?:type="checkbox")?[\s]*(checked="checked")?[\s]*(?:type="checkbox")?>(<img[^>]*>|[^<]*)/gi);
	var values = new Array();
	for (ans in answers_paragraph) {
		values.push(answers_paragraph[ans].match(/<!-- <simpleChoice identifier="([^"]*)"\s*(?:fixed="([^"]*)")?[^>]*>(?:[^<]*|<img[^>]*>)[^<]*(?:<feedbackInline[^>]*>([^<]*)<\/feedbackInline>)?[^<]*<\/simpleChoice>[^<]* --><br[^>]*><input id="choiceInteraction" name="simpleChoice"[\s]*(?:type="checkbox")?[\s]*(checked="checked")?[\s]*(?:type="checkbox")?>(<img[^>]*>|[^<]*)/i));
	}
	var i=0;
	while(values[i] != undefined) {
		ids.push(values[i][1]);
		answers.push(values[i][5]);
		if(values[i][4] == 'checked="checked"') {
			points.push('1');
		} else {
			points.push('0');
		}
		fixed.push(values[i][2]);
		fdb[values[i][1]] = values[i][3];
		i++;
	}

	data = {};
	data.answers = answers;
	data.points = points;
	data.ids = ids;
	data.identifier = identifier[1];
	data.shuffle = shuffle[1];
	data.fixed = fixed;
	data.max_selections = max_selections[1];
	data.separator = separator[1];
	data.fdb = fdb;

	var body = ed.selection.dom.doc.body.innerHTML;
	rg = new RegExp('<modalFeedback[^>]*senderIdentifier="' + identifier[1] + '"[^>]*identifier="([^"]*)"[^>]*sound="([^"]*)"[^>]*>','gi');
	var fdArr = body.match(rg);
	var fd = new Array;
	if(fdArr != undefined) {
		for (i in fdArr) {
			rg = new RegExp('<modalFeedback[^>]*senderIdentifier="' + identifier[1] + '"[^>]*identifier="([^"]*)"[^>]*sound="([^"]*)"[^>]*>','i');
			var arr = rg.exec(fdArr[i]);
			fd[arr[1]] = arr[2]
		}
	}
	data.fd = fd;
	
	tinyMCE.selectedNode = selectedNode;
	tinyMCE.execCommand('mceIdentification', false, data);

}

// Match
function runMatch(selectedNode) {
			
	var ed = tinymce.EditorManager.activeEditor;
	var answers = new Array();
	var points = new Array();
	var ids = new Array();
	var fixed = new Array();
	var data = new Array();
	var fdb = new Array();
	
	var sectionDiv = selectedNode;
	while(sectionDiv.nodeName != 'DIV' || sectionDiv.id != 'matchInteraction') {
		sectionDiv = sectionDiv.parentNode;
	}
	
	var matchSectionHTML = sectionDiv.innerHTML;
	var question = matchSectionHTML.match(/<p id="matchInteraction">([^<]*)<\/p>/i);
	
	var identifier = sectionDiv.previousSibling.data.match(/<matchInteraction responseIdentifier="([^"]+)"[^>]*>/i);
	var shuffle = sectionDiv.previousSibling.data.match(/<matchInteraction.*?shuffle="([^"]*)"[^>]*>/i);
	
	//var leftSet = $('matchInteraction[responseIdentifier=\'' + identifier[1] + '\'] > simpleMatchSet:first').children();
	//var rightSet = $('matchInteraction[responseIdentifier=\'' + identifier[1] + '\'] > simpleMatchSet:last').children();
	
	if(sectionDiv.children != undefined) {
		var sets = sectionDiv.children[1].children[0].children[0].children;
		var leftSet = sets[0].children[0].children[0].children;
		var rightSet = sets[2].children[0].children[0].children;
	} else {
		var sets = sectionDiv.childNodes[2].childNodes[0].rows[0].cells;
		var leftSet = sets[0].childNodes[0].childNodes[0].childNodes;
		var rightSet = sets[2].childNodes[0].childNodes[0].childNodes;
	}
	
	var leftSetAnswers = new Array;
	var leftSetIds = new Array;
	var leftSetFixed = new Array;
	var rightSetAnswers = new Array;
	var rightSetIds = new Array;
	var rightSetFixed = new Array;
	var responsePairs = new Array;
	
	if(sectionDiv.children != undefined) {
	
		for (el in leftSet) {
			if(leftSet[el].children != undefined) {
				leftSetAnswers.push(leftSet[el].children[0].children[2].innerHTML);
				leftSetIds.push(leftSet[el].children[0].children[0].innerHTML);
				leftSetFixed.push(leftSet[el].children[0].children[1].innerHTML);
			}
		}
		
		for (el in rightSet) {
			if(rightSet[el].children != undefined) {
				rightSetAnswers.push(rightSet[el].children[0].children[2].innerHTML);
				rightSetIds.push(rightSet[el].children[0].children[0].innerHTML);
				rightSetFixed.push(rightSet[el].children[0].children[1].innerHTML);
			}
		}
		
	} else {
	
		for (el in leftSet) {
			if(leftSet[el].nodeName != undefined && leftSet[el].nodeName == 'TR' && leftSet[el].childNodes != undefined) {
				leftSetAnswers.push(leftSet[el].childNodes[0].childNodes[2].innerHTML);
				leftSetIds.push(leftSet[el].childNodes[0].childNodes[0].innerHTML);
				leftSetFixed.push(leftSet[el].childNodes[0].childNodes[1].innerHTML);
			}
		}
		
		for (el in rightSet) {
			if(rightSet[el].nodeName != undefined && rightSet[el].nodeName == 'TR' && rightSet[el].childNodes != undefined) {
				rightSetAnswers.push(rightSet[el].childNodes[0].childNodes[2].innerHTML);
				rightSetIds.push(rightSet[el].childNodes[0].childNodes[0].innerHTML);
				rightSetFixed.push(rightSet[el].childNodes[0].childNodes[1].innerHTML);
			}
		}
	
	}
	
	var tinybody = ed.selection.getNode();
	while(tinybody.nodeName != 'BODY') {
		tinybody = tinybody.parentNode;
	}
	
	tinybody = tinybody.innerHTML;	
	var rg = new RegExp('<!-- <responseDeclaration identifier="' + identifier[1] + '" [^>]*>[^<]*<correctResponse>[^<]*((?:<value>[^<]*<\/value>[^<]*)*)[^<]*<\/correctResponse>','gi');
	var valuesStr = rg.exec(tinybody);
	valuesArr = valuesStr[1].match(/<value>([^<]*)<\/value>/gi);
	
	for (i in valuesArr) {
		responsePairs.push(valuesArr[i].match(/<value>([^<]*)<\/value>/i)[1]);
	}
	
	var rg = new RegExp('<feedbackInline[^>]*identifier="([^"]*)"[^>]*>([^<]*)<\/feedbackInline>',"gi");
	var fdbArr = matchSectionHTML.match(rg);
	for(i in fdbArr) {
		var val = rg.exec(fdbArr[i]);
		var val2 = fdbArr[i].match(rg); // lol?
		if(val != undefined) {
			fdb[val[1]] = val[2];
		}
	}
	
	data.push(question[1]);
	data.push(identifier[1]);
	data.push(shuffle[1]);
	data.push(leftSetAnswers);
	data.push(leftSetIds);
	data.push(rightSetAnswers);
	data.push(rightSetIds);
	data.push(leftSetFixed);
	data.push(rightSetFixed);
	data.push(responsePairs);
	data.push(fdb);
	
	var body = ed.selection.dom.doc.body.innerHTML;
	
	rg = new RegExp('<modalFeedback[^>]*senderIdentifier="' + identifier[1] + '"[^>]*identifier="([^"]*)"[^>]*sound="([^"]*)"[^>]*>','gi');
	var fdArr = body.match(rg);
	if(fdArr != undefined) {
		var fd = new Array;
		for (i in fdArr) {
			rg = new RegExp('<modalFeedback[^>]*senderIdentifier="' + identifier[1] + '"[^>]*identifier="([^"]*)"[^>]*sound="([^"]*)"[^>]*>','i');
			var arr = rg.exec(fdArr[i]);
			fd[arr[1]] = arr[2]
		}
		data.push(fd);
	}			
	
	tinyMCE.selectedNode = selectedNode;
	tinyMCE.execCommand('mceMatch', false, data);
	
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
