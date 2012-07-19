(function() {

	tinymce.create('tinymce.plugins.addVideoPlugin', {
		
		init : function(ed, url) {
			
			ed.addCommand('mceAddVideo', function(ui, data) {

				var node = ed.selection.getNode();
				if(node.nodeName == 'IMG' || node.nodeName == 'OBJECT') {
					node = node.parentNode;
				}
				
				var browseCallback = {

					onBrowseComplete : function(filePath, title) {
						if (!ed.validateHtml(title, 'title', true)) {
							return false;
						}
						
						var node = ed.selection.getNode();
						var paragraph = '';

						if(data != undefined && data.src != undefined && data.src != '') {

							while(node.nodeName != 'FIELDSET') {
								if (null != node.nextElementSibling && node.nextElementSibling.nodeName == 'FIELDSET' && node.nextElementSibling.id == 'runFileUploadLib') {
									node = node.nextElementSibling;
								}else
								{
									node = node.parentNode;
								}
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

						var fromPath = tinyMCE.gwtProxy.getPageBasePath();
						var prefix = fromPath.match(/^(.*\/)ctrl.php/i);
						fromPath = fromPath.split('/');
						fromPath.pop();
						fromPath = fromPath.join('/');
						filePath = getRelativeFromAbsoute(fromPath, filePath);
						var videotag = paragraph+'<fieldset id="runFileUploadLib" class="mceNonEditable" style="font-size: 10px; font-color: #b0b0b0; color: #b0b0b0; border: 1px solid #d0d0d0;"><object data="' + filePath + '" type="video" alt="'+ed.correctHtml(title, "encode").replace(/"/g,'&quot;')+'"></object><img id="mceVideo" src="/res/skins/default/qtipageeditor/tinymce/tiny_mce/plugins/qti_addvideo/img/movie.png" /><br>' + title + '</fieldset><span id="focus">_</span>'+paragraph;
						ed.execCommand('mceInsertContent', false, videotag);
						n = ed.dom.get('focus');

						if (null == n.nextElementSibling || n.nextElementSibling.nodeType != 1 || n.nextElementSibling.tagName != 'P') {
							var newNode = ed.dom.create('p',null,'&nbsp;');
							ed.dom.insertAfter(newNode,ed.dom.get('focus'));
						}
						ed.selection.select(ed.dom.get(ed.dom.get('focus').nextElementSibling), true);
						ed.selection.collapse(false);
						ed.nodeChanged();
						ed.focus();
						ed.dom.remove('focus');
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
						var title = data.title;
						title = title.replace(/\</g,"&lt;").replace(/\>/g,"&gt;");
						title = ed.decodeMath(title);
						assetBrowser.setTitle(title);
					}
				}
				
				assetBrowser.browse(browseCallback, extensions);
				$('.gwt-TextBox').focus();
			});
			
			ed.addCommand('mceAppendVideoToInput', function(ui, data) {
				
				var browseCallback = {

						onBrowseComplete : function(filePath, title) {
							
							if (!ed.validateHtml(title, 'title', true)) {
								return false;
							}
							
							var fromPath =tinyMCE.gwtProxy.getPageBasePath();
							fromPath = fromPath.split('/');
							fromPath.pop();
							fromPath = fromPath.join('/');
							filePath = getRelativeFromAbsoute(fromPath, filePath);
							
							var prefix = data['input'].value.substr(0, data['offset']);
							var suffix = data['input'].value.substr(data['offset'], data['input'].value.length-data['offset']);
							//var template = '[img title={'+title+'} src={'+fromPath + '/' + filePath+'}]';
							//var template = '<img alt="'+title.replace(/\"/g,'&quot;')+'" src="'+fromPath + '/' + filePath+'">';
							title = title.replace(/&lt;/g,"<").replace(/&gt;/g,">");
							var template = '<object data="' + filePath + '" type="video" alt="'+ed.dom.encode(title)+'"></object>';
							//<img id="mceVideo" src="/res/skins/default/qtipageeditor/tinymce/tiny_mce/plugins/qti_addvideo/img/movie.png" />
//							var template = '<img alt="'+ed.dom.encode(title)+'" src="'+fromPath + '/' + filePath+'">';

							if (undefined == data['type']) {
								data['input'].value = prefix+template+suffix;
							} else {
								
								if ('modify' == data['type']) {
									data['input'].value = data['input'].value.replace(data['media'], template);
								}
							}
							data['input'].focus();
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
						title = ed.dom.decode(data.title);
						title = title.replace(/\</g,"&lt;").replace(/\>/g,"&gt;");
						title = ed.decodeMath(title);
//						assetBrowser.setTitle(data.title);
						assetBrowser.setTitle(title);
					}
				}
				
				assetBrowser.browse(browseCallback, extensions);
				ed.QTIWindowHelper.correctGwtWindowZIndex();
				$('.gwt-TextBox').focus();
				
			});
			
			ed.addButton('addvideo', {title : 'Add video / flash movie', cmd : 'mceAddVideo'});
			ed.onNodeChange.add(function(ed, cm, n) {

				if ('BODY' == ed.selection.getNode().nodeName) {
					cm.setDisabled('addvideo', true);
				} else {
					cm.setDisabled('addvideo', false);
				}
			});
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

	tinymce.PluginManager.add('qti_addvideo', tinymce.plugins.addVideoPlugin);
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