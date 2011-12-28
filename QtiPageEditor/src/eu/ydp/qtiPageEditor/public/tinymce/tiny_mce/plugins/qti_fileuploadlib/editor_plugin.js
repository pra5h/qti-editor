(function() {

	tinymce.create('tinymce.plugins.fileUploadLib', {
		
		init : function(ed, url) {

			ed.addCommand('mceAppendImageToPage', function(ui, data) {
				var node = ed.selection.getNode();

				if(node.nodeName == 'IMG' || node.nodeName == 'EMBED') {
					node = node.parentNode;
				}

				var browseCallback = {

						onBrowseComplete : function(filePath, title) {
							var node = ed.selection.getNode();
							var paragraph = '';
							
							var fromPath =tinyMCE.gwtProxy.getPageBasePath();
							fromPath = fromPath.split('/');
							fromPath.pop();
							fromPath = fromPath.join('/');
							filePath = getRelativeFromAbsoute(fromPath, filePath);

							if(data != undefined && data.src != undefined && data.src != '') {

								while(node.nodeName != 'FIELDSET') {
									node = node.parentNode;
								}

								if (node.nodeName == 'FIELDSET' && node.id == 'runFileUploadLib') {
									node.parentNode.removeChild(node);
								}

							} else {
								paragraph = '<p>&nbsp;</p>';
								
								if (node.nodeName == 'P' && node.attributes.length == 0) {
									var prefix = '';
									
									if (null != node.lastElementChild && node.lastElementChild.nodeName == 'BR') {
										node.removeChild(node.lastElementChild);
									}
									
									if (null != node.previousElementSibling && node.previousElementSibling.nodeName == 'FIELDSET' && node.previousElementSibling.id == 'runFileUploadLib') {
										prefix = '<p>&nbsp;</p>';
									}
									ed.execCommand('mceInsertContent',false,'<span id="__caret">_</span>');

									var pNode = ed.selection.getNode();
									
									ed.dom.setOuterHTML(pNode, pNode.innerHTML);

									var carretNode = ed.dom.get('__caret');
									var node = carretNode.parentNode.firstChild;
									var innerHtml = '';
									pNode = carretNode.parentNode;
									
									while(null != node) {

										if (node.nodeType == 3) {
											
											if ($.trim(node.nodeValue) != '' && node.nodeValue != '\n\n') {
												innerHtml += prefix+'<p>'+node.textContent+'</p>';
												prefix = '';
											}

										} else {
											innerHtml += ed.dom.getOuterHTML(node);
										}
										node = node.nextSibling;
									}
									pNode.innerHTML = innerHtml;

									var rng = ed.dom.createRng();

									rng.setStartBefore(ed.dom.get('__caret'));
									rng.setEndAfter(ed.dom.get('__caret'));
									ed.selection.setRng(rng);
								}
							} 

							var imgTag = paragraph+'<fieldset id="runFileUploadLib" class="mceNonEditable" style="font-size: 10px; font-color: #b0b0b0; color: #b0b0b0; border: 1px solid #d0d0d0;"><img src="' + fromPath + '/' + filePath + '" border="0" title="' + title + '" alt="' + title + '"/><br>' + title + '</fieldset><span id="focus">_</span>'+paragraph;
							ed.execCommand('mceInsertContent', false, imgTag);

							var toFocus = ed.dom.get('focus').nextElementSibling.firstChild;
							rng = ed.dom.createRng();
							rng.setStart(toFocus, 0);
							rng.setEnd(toFocus, 0);
							ed.selection.setRng(rng);
							ed.dom.remove('focus');
						
							return true;
						},

						onBrowseError : function(error) {
							tinyMCE.activeEditor.windowManager.alert(error);
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
				$('.gwt-TextBox').focus();
				
			});
			
			ed.addCommand('mceAppendImageToExercise', function(ui,data) {
			
				var browseCallback = {
				
					onBrowseComplete : function(filePath,title) {
						var imgSrc = $('#thumb > img').attr('src');
						
						var fromPath =tinyMCE.gwtProxy.getPageBasePath();
						fromPath = fromPath.split('/');
						fromPath.pop();
						fromPath = fromPath.join('/');
						filePath = getRelativeFromAbsoute(fromPath, filePath);

						data.div.innerHTML = '<img style="max-height: 40px; max-width: 80px;" src="' + fromPath + '/' + filePath + '">';
						data.div.previousSibling.setAttribute('value', fromPath + '/' + filePath);
						return true;
					},
					
					onBrowseError : function(error) {
						tinyMCE.activeEditor.windowManager.alert(error);
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

			ed.addCommand('mceAppendImageToExerciseMatch', function(ui,data) {

				var browseCallback = {

					onBrowseComplete : function(filePath,title) {
						var imgSrc = $('#thumb > img').attr('src');

						var fromPath =tinyMCE.gwtProxy.getPageBasePath();
						fromPath = fromPath.split('/');
						fromPath.pop();
						fromPath = fromPath.join('/');
						filePath = getRelativeFromAbsoute(fromPath, filePath);

						data.div.children[1].setAttribute('src',fromPath + '/' + filePath);
						data.div.children[0].setAttribute('value','<img src="' + fromPath + '/' + filePath + '">');
						return true;
					},

					onBrowseError : function(error) {
						tinyMCE.activeEditor.windowManager.alert(error);
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
						tinyMCE.activeEditor.windowManager.alert(error);
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

				var selectedNode = node.nextElementSibling;
				ed.selection.select(selectedNode);
				var range = ed.selection.getRng();
				range.setStart(selectedNode, 0);
				range.setEnd(selectedNode, 0);
				ed.selection.setRng(range);
				ed.selection.collapse(1);
				ed.dom.remove(node);
			});
			
			ed.addButton('fileuploadlib_image', {title : 'Upload / insert image', cmd : 'mceAppendImageToPage'});
			ed.onNodeChange.add(function(ed, cm, n) {

				if ('BODY' == ed.selection.getNode().nodeName) {
					cm.setDisabled('fileuploadlib_image', true);
				} else {
					cm.setDisabled('fileuploadlib_image', false);
				}
			});
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

	tinymce.PluginManager.add('qti_fileuploadlib', tinymce.plugins.fileUploadLib);
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
