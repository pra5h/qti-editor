function getModuleIdentifier(commentNode) {
	return $(commentNode.nodeValue).attr('responseIdentifier');
}

function replaceModuleHtml(object) {
	var beginCommentNode = object.previousSibling;
	var endCommentNode = object.nextSibling;
	
	if (8 == beginCommentNode.nodeType && 8 == endCommentNode.nodeType) {
		var identifier = getModuleIdentifier(beginCommentNode);
		var ed = tinymce.EditorManager.activeEditor;
		var node = null;
		var respDeclaration = '';
		var ret = new Object();
		var xh = ed.XmlHelper;
		ret.responseDeclaration = xh.getCorrectResponseNodeId(ed.dom.doc.body, identifier).nodeValue;

		var text = '';
		text += '<p>&nbsp;</p><!--'+beginCommentNode.nodeValue+'-->';
		text += object.outerHTML;
		text += '<!--'+endCommentNode.nodeValue+'-->';
		text += '<p>&nbsp;</p><span id="focus">_</span>';
		ret.module = text;
	}
	return ret;
}

function removeModule(object) {
	var beginCommentNode = object.previousSibling;
	var endCommentNode = object.nextSibling;
	var identifier = getModuleIdentifier(beginCommentNode);
	var ed = tinymce.EditorManager.activeEditor;
	var textNode = ed.dom.doc.body.firstChild;
	
	if (8 == beginCommentNode.nodeType && 8 == endCommentNode.nodeType) {
		var responseNode = null;
		var xh = ed.XmlHelper;
		responseNode = xh.getCorrectResponseNodeId(ed.dom.doc.body, identifier);
		responseNode.parentNode.removeChild(responseNode);
		object.parentNode.removeChild(beginCommentNode);
		object.parentNode.removeChild(endCommentNode);
		object.parentNode.removeChild(object);
	}
}

function getIdsMappingArray(text) {
	var id;
	var reg = new RegExp(/responseIdentifier="([^"]+)"/gi);
	var mappingTab = new Array();
	while(null != (id = reg.exec(text))) {
		mappingTab[id[1]] = newRandId();
	}
	
	reg = new RegExp(/identifier="([^"]+)"/gi);
	while(null != (id = reg.exec(text))) {
		mappingTab[id[1]] = newRandId();
	}
	return mappingTab;
}

function newRandId() {
	
	var randid = Math.random();
	randid = String(randid);
	var rg = new RegExp('0.([0-9]*)',"gi");
	exec = rg.exec(randid);
	return 'id_' + exec[1];
					
}

function insertContentWithoutUndoLevel(h,s) {
	var ed = tinymce.EditorManager.activeEditor;
	
	var t = ed.selection, r = t.getRng(), c, d = t.win.document;

	s = s || {format : 'html'};
	s.set = true;
	h = s.content = t.dom.processHTML(h);
	h = s.content;

	if (r.insertNode) {
		h += '<span id="__caret">_</span>';
		r.deleteContents();
		r.insertNode(t.getRng().createContextualFragment(h));

		// Move to caret marker
		c = t.dom.get('__caret');

		// Make sure we wrap it compleatly, Opera fails with a simple select call
		r = d.createRange();
		if(c != undefined) {
			r.setStartBefore(c);
			r.setEndAfter(c);
			t.setRng(r);
		} else {
			console.log('YDP Note: skipped setRng(), tinymce.js line ~5200');
		}

		// Remove the caret position
		t.dom.remove('__caret');
	} else {
		if (r.item) {
			// Delete content and get caret text selection
			d.execCommand('Delete', false, null);
			r = t.getRng();
		}

		r.pasteHTML(h);
	}
}