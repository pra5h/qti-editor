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
						srcArr = filePath.split('/');
						if(data != undefined && data.src != undefined && data.src != '') {
								node.parentNode.removeChild(node);
						}
						var videotag = '<fieldset id="runFileUploadLib" class="mceNonEditable" style="font-size: 10px; font-color: #b0b0b0; color: #b0b0b0; border: 1px solid #d0d0d0;"><embed type="" src="' + String(srcArr[srcArr.length-2] + '/' + srcArr[srcArr.length-1]) + '" title="' + title + '"/><img id="mceVideo" src="/work/tools/qtitesteditor/tinymce/tiny_mce/plugins/addvideo/img/movie.png" /><br>' + title + '</fieldset>';
						ed.selection.moveToBookmark(ed.selection.getBookmark());
						tinyMCE.execCommand('mceInsertContent', false, videotag);
						return true;
					},
					
					onBrowseError : function(error) {
						alert(error);
						return false;
					}
					
				}
				
				var extensions = [".mp4",".swf", ".flv", ".avi"];
				
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
