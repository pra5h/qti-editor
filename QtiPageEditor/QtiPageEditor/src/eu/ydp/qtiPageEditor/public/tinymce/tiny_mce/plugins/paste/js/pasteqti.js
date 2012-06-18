tinyMCEPopup.requireLangPack();

var PasteQTIDialog = {
	init : function() {
	
		var ed = tinyMCEPopup.editor, el = document.getElementById('iframecontainer'), ifr, doc, css, cssHTML = '';

		// Create iframe
		el.innerHTML = '<iframe id="iframe" src="javascript:\'\';" frameBorder="0" style="border: 1px solid gray"></iframe>';
		ifr = document.getElementById('iframe');
		
		doc = ifr.contentWindow.document;
	
		// Force absolute CSS urls
		css = [ed.baseURI.toAbsolute("themes/" + ed.settings.theme + "/skins/" + ed.settings.skin + "/content.css")];
		css = css.concat(tinymce.explode(ed.settings.content_css) || []);
		tinymce.each(css, function(u) {
			cssHTML += '<link href="' + ed.documentBaseURI.toAbsolute('' + u) + '" rel="stylesheet" type="text/css" />';
		});

		// Write content into iframe
		doc.open();
		doc.write('<html><head>' + cssHTML + '</head><body class="mceContentBody" spellcheck="false"></body></html>');
		doc.close();

		doc.designMode = 'on';
		this.resize();

		window.setTimeout(function() {
			ifr.contentWindow.focus();
		}, 10);
		
	},

	insert : function() {
	
		var h = document.getElementById('iframe').contentWindow.document.body.innerHTML;
		
		h = h.replace(/<!-- \?(xml[^\?]*)\? -->/gi,'');
		
		h = h.replace(/<!-- (<assessmentItem [^>]*>) -->/gi,'');
		h = h.replace(/<!-- (<\/assessmentItem>) -->/gi,'');
		
		h = h.replace(/<!-- (<responseDeclaration[^>]*>)/gi,'');
		h = h.replace(/(<\/responseDeclaration>) -->/gi,'');
		
		h = h.replace(/<!-- (<itemBody>) -->/gi,'');
		h = h.replace(/<!-- (<\/itemBody>) -->/gi,'');
		
		h = h.replace(/<!-- (<gap[^>]*>[^<]*<\/gap>) --><span id="gap" class="mceNonEditable"[^>]*>([^<]*)<\/span>/gi, '');
		
		h = h.replace(/(?:<p>)?<!-- (<choiceInteraction[^>]*>) -->(?:<\/p>)?<div id="choiceInteraction" class="mceNonEditable"[^>]*>/gi, '');
		h = h.replace(/<p id="choiceInteraction">([^<]*)<\/p><p id="choiceInteraction">/gi, '');
		h = h.replace(/<!-- (<simpleChoice[^>]*>([^<]*|[^<]*<img[^>]*>[^<]*)<\/simpleChoice>) --><br[^>]*><input id="choiceInteraction" [^>]*>(<img[^>]*>|[^<]*)/gi,'');
		h = h.replace(/<\/p><\/div><!-- end of choiceInteraction -->/gi,'');
		
		h = h.replace(/(?:<p>)?<!-- (<inlineChoiceInteraction[^>]*>) -->(?:<\/p>)?<span id="inlineChoiceInteraction" class="mceNonEditable"[^>]*>/gi, '');
		h = h.replace(/<!-- (<inlineChoice[^>]*>[^<]*<\/inlineChoice>) --><span id="inlineChoiceAnswer"[^>]*>[^<]*(?:<span[^>]*>[^<]*<\/span>)?<\/span>/gi,'');
		h = h.replace(/<\/span>[^<]*(?:<\/p>)?[^<]*<!-- end of inlineChoiceInteraction -->/gi,'');
		
		tinyMCEPopup.editor.execCommand('mceInsertClipboardContent', false, {content : h});
		tinyMCEPopup.close();
		
	},

	resize : function() {
		var vp = tinyMCEPopup.dom.getViewPort(window), el;

		el = document.getElementById('iframe');

		if (el) {
			el.style.width  = (vp.w - 20) + 'px';
			el.style.height = (vp.h - 90) + 'px';
		}
	}
};

tinyMCEPopup.onInit.add(PasteQTIDialog.init, PasteQTIDialog);
