(function() {

	tinymce.create('tinymce.plugins.playPausePlugin', {
		
		init : function(ed, url) {
			
			ed.addCommand('mcePlayPause', function(ui, data) {
				
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
						var prefix = fromPath.match(/^(.*\/)ctrl.php/i);
						fromPath = fromPath.split('/');
						fromPath.pop();
						fromPath = fromPath.join('/');
						filePath = getRelativeFromAbsoute(fromPath, filePath);
						
						var playpausetag = '<!-- <audioPlayer src="' + fromPath + '/' + filePath + '" /> --><img id="mcePlayPause" src="' + prefix[1] + 'tools/qtitesteditor/tinymce/tiny_mce/plugins/qti_playpause/img/playpause.png" />';
						ed.selection.moveToBookmark(ed.selection.getBookmark());
						tinyMCE.execCommand('mceInsertContent', false, playpausetag);
						return true;
					},
					
					onBrowseError : function(error) {
						tinyMCE.activeEditor.windowManager.alert(error);
						return false;
					}
					
				}
				
				var extensions = [".mp3"];
				
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
			
			ed.addButton('playpause', {title : 'Insert Play / Pause button', cmd : 'mcePlayPause'});
			
		},

		getInfo : function() {
			return {
				longname : 'Plugin for playing audio files',
				author : '<a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : "1.0"
			};
		}
	});

	tinymce.PluginManager.add('qti_playpause', tinymce.plugins.playPausePlugin);
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