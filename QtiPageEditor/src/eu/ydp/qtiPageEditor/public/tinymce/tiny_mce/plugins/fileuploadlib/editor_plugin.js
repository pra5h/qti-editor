(function() {

	tinymce.create('tinymce.plugins.fileUploadLib', {
		
		init : function(ed, url) {
			
			ed.addCommand('mceAppendImageToPage', function(ui, data) {
				
				var node = ed.selection.getNode();
				if(node.nodeName == 'IMG') {
					node = node.parentNode;
				}
				
				var browseCallback = {
				
					onBrowseComplete : function(filePath, title) {
						if(data != undefined && data.src != undefined && data.src != '') {
							node.parentNode.removeChild(node);
						}
						var imgTag = '<fieldset id="runFileUploadLib" class="mceNonEditable" style="font-size: 10px; font-color: #b0b0b0; color: #b0b0b0; border: 1px solid #d0d0d0;"><img src="' + filePath + '" border="0" title="' + title + '" alt="' + title + '"/><br>' + title + '</fieldset>';
						ed.selection.moveToBookmark(ed.selection.getBookmark());
						tinyMCE.execCommand('mceInsertContent', false, imgTag);
						return true;
					},
					
					onBrowseError : function(error) {
						alert(error);
						return false;
					}
					
				}
				
				var extensions = [".jpg",".jpeg", ".gif", ".bmp", ".png"];
				
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
			
			ed.addCommand('mceAppendImageToExercise', function(ui,data) {
			
				var browseCallback = {
				
					onBrowseComplete : function(filePath,title) {
						var imgSrc = $('#thumb > img').attr('src');
						data.div.innerHTML = '<img style="max-height: 40px; max-width: 80px;" src="' + filePath + '">';
						data.div.previousSibling.setAttribute('value',filePath);
						return true;
					},
					
					onBrowseError : function(error) {
						alert(error);
						return false;
					}
					
				}
				
				var extensions = [".jpg",".jpeg", ".gif", ".bmp", ".png"];
				
				var assetBrowser = tinyMCE.gwtProxy.getAssetBrowser();
				
				if(data.src != undefined && data.src != '') {
					srcArr = data.src.split('/');
					fileName = String(srcArr[srcArr.length-1]);
					assetBrowser.setSelectedFile(fileName);
				}
				
				assetBrowser.browse(browseCallback, extensions);
			
			});
			
			ed.addCommand('mceAddFeedbackSound', function(ui,data) {
				
				var browseCallback = {
				
					onBrowseComplete : function(filePath) {
						filePath = filePath.split('/');
						filePath = String(filePath[filePath.length-2] + '/' + filePath[filePath.length-1]);
						data.dest.setAttribute('value', filePath);
						return true;
					},
					
					onBrowseError : function(error) {
						alert(error);
						return false;
					}
					
				}
				
				var extensions = [".mp3"];
				
				var assetBrowser = tinyMCE.gwtProxy.getAssetBrowser();
				
				if(data.src != undefined && data.src != '') {
					srcArr = data.src.split('/');
					fileName = String(srcArr[srcArr.length-1]);
					assetBrowser.setSelectedFile(fileName);
				}
				
				assetBrowser.browse(browseCallback, extensions);
			
			});
			
			ed.addCommand('mceRemoveMedia', function(ui, data) {
				
				var node = ed.selection.getNode();
				while(node.nodeName != 'FIELDSET') {
					node = node.parentNode;
				}
				ed.dom.remove(node);
				
			});
			
			ed.addButton('fileuploadlib_image', {title : 'Upload / insert image', cmd : 'mceAppendImageToPage'});
			
		},

		getInfo : function() {
			return {
				longname : 'Plugin managing picture uploads',
				author : '<a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : "2.0"
			};
		}
	});

	tinymce.PluginManager.add('fileuploadlib', tinymce.plugins.fileUploadLib);
})();
