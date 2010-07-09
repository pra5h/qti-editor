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
					var commented_text = ed.selection.getContent();
					var comment_content = '';
					var comment_id = '';
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
				if(span.nodeName != 'SPAN' || span.id != refid) {
					for(i in span.children) {
						if(span.children[i].nodeName == 'SPAN' && span.children[i].id == refid) {
							span = span.children[i];
							break;
						}
					}
				}
				
				selectedNode.parentNode.removeChild(selectedNode);
				var commentedText = span.innerHTML;
				ed.selection.moveToBookmark(ed.selection.getBookmark());
				tinyMCE.execCommand('mceInsertContent', false, commentedText);
				span.parentNode.removeChild(span);
				
				return true;
			
			});
			
			ed.addButton('insertcomment', {title : 'Insert comment', cmd : 'mceComment'});

		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Plugin for creating and managing QTI',
				author : 'Olaf Galazka',
				authorurl : '',
				infourl : '',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('comment', tinymce.plugins.commentPlugin);
})();