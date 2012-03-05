var basePagePath =tinyMCE.gwtProxy.getPageBasePath();
	basePagePath = basePagePath.split('/');
	basePagePath.pop();
	basePagePath = basePagePath.join('/');
	basePagePath += '/';

var tv = 0;
var player;
var OPSExtension = new AssessmentCentreEditorOnPageSwitchExtension();
	OPSExtension.setCallback(function(val) {
		if (typeof parent.initEditButton == 'function'){
			parent.initEditButton(val);
		}
	});

function empiriaPlayerAppLoaded() {
	player = empiriaCreatePlayer('player');
//	if(tv == 0) {
		player.importFlowOptions = function(){
			return {showToC: false, showSummary: false, itemsDisplayMode: "ONE", showCheck: false};
		}
	/*} else {
		player.importFlowOptions = function(){
			return {showToC: false, showSummary: false, itemsDisplayMode: "ALL", showCheck: false};
		}
	}*/
	player.loadExtension("DefaultAssessmentHeaderViewExtension");
	player.loadExtension("DefaultAssessmentFooterViewExtension");
	player.loadExtension("DefaultSoundProcessorExtension");
	player.loadExtension("PlayerCoreApiExtension");
	player.loadExtension(OPSExtension);
	var itemXml = tinyMCEPopup.editor.getContent();
	var itemDatas = [ {document:itemXml, baseURL:basePagePath} ];
	var assessmentXml = '<?xml version="1.0" encoding="UTF-8" ?><assessmentTest title="Test" identifier="Test"><styleDeclaration><link href="../qtidesign_default/default.css" userAgent=".*" /><link href="../qtidesign_default/msie.css" userAgent="MSIE" /><link href="../qtidesign_default/ipad.css" userAgent="iPad" /><link href="../qtidesign_default/iphone.css" userAgent="iPhone" /></styleDeclaration><testPart><assessmentSection><assessmentItemRef href="" identifier=""/></assessmentSection></testPart></assessmentTest>';
	var assessmentData = {document:assessmentXml, baseURL:basePagePath};
	player.loadFromData(assessmentData, itemDatas);
}

function getRelativeFromAbsoute(absoluteFrom, absoluteTo) {

	var absoluteFromDir = absoluteFrom;
	var absoluteFromDirArr = absoluteFromDir.split("/");
	var prefix = "";
	var path;

	while (absoluteFromDirArr.length) {
		absoluteFrom = absoluteFromDirArr.join('/');
		if (absoluteTo.indexOf(absoluteFrom) == - 1) {
			if (absoluteFromDirArr.pop() != "") {
				prefix+= "../";
			}
		} else {
			break;
		}
	}

	if (prefix == "") {
		path = prefix + absoluteTo.substring(absoluteFrom.length, absoluteTo.length);
	} else {
		path = prefix + absoluteTo.substring(absoluteFrom.length + 1, absoluteTo.length);
	}

	return path;

}