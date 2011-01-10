(function() {

	tinymce.create('tinymce.plugins.addVideoPlugin', {
		
		init : function(ed, url) {
			
			ed.addCommand('mceAddVideo', function(ui, data) {
				
				var node = ed.selection.getNode();
				if(node.nodeName != 'DIV') {
					node = node.parentNode;
				}
				
				var browseCallback = {
				
					onBrowseComplete : function(filePath, title) {
						
						if(data != undefined && data.src != undefined && data.src != '') {
								node.parentNode.removeChild(node);
						}
						
						var fromPath = tinyMCE.gwtProxy.getPageBasePath();
						fromPath = fromPath.split('/');
						fromPath.pop();
						fromPath = fromPath.join('/');
						filePath = getRelativeFromAbsoute(fromPath, filePath);
						
						var videotag = '<fieldset id="runFileUploadLib" class="mceNonEditable" style="font-size: 10px; font-color: #b0b0b0; color: #b0b0b0; border: 1px solid #d0d0d0;"><embed src="' + fromPath + '/' + filePath + '" href="' + fromPath + '/' + filePath + '" autostart="false" type="video/mp4" target="myself" scale="1"/><br>' + title + '</fieldset>';
						ed.selection.moveToBookmark(ed.selection.getBookmark());
						tinyMCE.execCommand('mceInsertContent', false, videotag);
						return true;
					},
					
					onBrowseError : function(error) {
						tinyMCE.activeEditor.windowManager.alert(error);
						return false;
					}
					
				}
				
				var extensions = [".mp4", ".swf", ".flv", ".avi"];
				
				var assetBrowser = tinyMCE.gwtProxy.getAssetBrowser();
				
				if(data != undefined) {
					if(data.src != undefined && data.src != '') {
						srcArr = data.src.split('/');
						fileName = String(srcArr[srcArr.length-1]);
						assetBrowser.setSelectedFile(fileName);
					}
					if(data.title != undefined && data.title != '') {
						assetBrowser.setTitle(data.title);
					}
				}
				assetBrowser.browse(browseCallback, extensions);
				
			});
			
			ed.addButton('addvideo', {title : 'Add video / flash movie', cmd : 'mceAddVideo'});
			
		},

		getInfo : function() {
			return {
				longname : 'Plugin for uploading movies and flash',
				author : '<a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : "1.0"
			};
		}
	});

	tinymce.PluginManager.add('addvideo', tinymce.plugins.addVideoPlugin);
})();

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