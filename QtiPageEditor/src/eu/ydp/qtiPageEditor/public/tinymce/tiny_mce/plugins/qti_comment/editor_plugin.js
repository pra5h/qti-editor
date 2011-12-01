(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('comment');

	tinymce.create('tinymce.plugins.commentPlugin', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {
			// Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');
			ed.addCommand('mceComment', function(ui, data) {
				
				if(data != undefined) {
					
					var commented_text = data.commented_text;
					var comment_content = data.comment_content;
					var comment_id = data.comment_id;
				
				} else { // dodawanie nowego komentarza
					if(ed.selection.getContent() == undefined || ed.selection.getContent() == '') {
						ed.windowManager.alert("Select text to be commented");
						return false;
					}
					if(/<\/?qy:comment[^>]*>/i.test(ed.selection.getContent()) || (/<span[^>]*class="qy_comment"[^>]*>/i.test(ed.selection.getContent()))) {
						ed.windowManager.alert("Comments cannot be nested");
						return false;
					}
					var commented_text = ed.selection.getContent();
					var comment_content = '';
					var comment_id = '';
				}
				
				if(commented_text == '') {
					tinyMCE.execCommand('mceCommentRemove');
					return false;
				}
				
				ed.windowManager.open({
					file : url + '/comment.htm',
					width : 400,
					height : 150,
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					commented_text : commented_text,
					comment_content : comment_content,
					comment_id : comment_id
				});
				
			});
			
			ed.addCommand('mceCommentRemove', function(ui, data) {
				
				var selectedNode = ed.selection.getNode();
				
				var refid = selectedNode.id;
				refid = refid.replace("ref_","");
				
				var span = selectedNode.nextSibling;
				if(span != undefined) {
					if(span.nodeName != 'SPAN' || span.id != refid) {
						for(i in span.children) {
							if(span.children[i].nodeName == 'SPAN' && span.children[i].id == refid) {
								span = span.children[i];
								break;
							}
						}
					}
				}
				selectedNode.parentNode.removeChild(selectedNode);
				if(span != undefined) {
					var commentedText = span.innerHTML;
				} else {
					var commentedText = '';
				}
				ed.selection.moveToBookmark(ed.selection.getBookmark());
				tinyMCE.execCommand('mceInsertContent', false, commentedText);
				span.parentNode.removeChild(span);
				
				return true;
			
			});
		
			ed.addButton('insertcomment', {title : 'Insert comment', cmd : 'mceComment'});
			 
			ed.onNodeChange.add(function(ed, cm, n) {

				if ('BODY' == ed.selection.getNode().nodeName) {
					cm.setDisabled('insertcomment', true);
				} else {
					cm.setDisabled('insertcomment', false);
				}
			});
		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Plugin for creating and managing QYcomments',
				author : '<a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('qti_comment', tinymce.plugins.commentPlugin);
})();
