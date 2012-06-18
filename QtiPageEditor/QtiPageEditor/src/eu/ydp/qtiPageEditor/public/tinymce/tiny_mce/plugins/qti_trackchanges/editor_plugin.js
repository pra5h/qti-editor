(function() {
	tinymce.PluginManager.requireLangPack('trackchanges');

	tinymce.create('tinymce.plugins.trackChanges', {
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
			
			ed.addCommand('mceEnableChangesTracking', function(ui, data) {
				
				if(tinyMCE.changesTracking != undefined && tinyMCE.changesTracking === true) {
					
					tinyMCE.changesTracking = false;
					ed.controlManager.setActive('enablechangestracking', false);
					
				} else {
					
					tinyMCE.originalBookmark = ed.selection.getBookmark();
					tinyMCE.changesTracking = true;
					ed.controlManager.setActive('enablechangestracking', true);
					ed.selection.dom.doc.body.innerHTML = ed.selection.dom.doc.body.innerHTML.replace(/(<!-- <assessmentItem [^>]*> -->)/gi, '$1<!-- <changesTracking state="on"> -->');
				
				}
				
			});
			
			ed.addCommand('mceDisableChangesTracking', function(ui, data) {
				if(tinyMCE.changesTracking != undefined && tinyMCE.changesTracking) {
					
					tinyMCE.changesTracking = false;
					ed.controlManager.setActive('enablechangestracking', false);
					
					confirmChanges(ed);
					
					ed.selection.dom.doc.body.innerHTML = ed.selection.dom.doc.body.innerHTML.replace(/<!-- <changesTracking state="on"> -->/gi, '');
					
				}
			});
			
			ed.addButton('enablechangestracking', {title : 'Changes tracking', cmd : 'mceEnableChangesTracking'});
			ed.addButton('disablechangestracking', {title : 'Accept changes', cmd : 'mceDisableChangesTracking'});
			
		},
		
		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Plugin for tracking changes in assessment page',
				author : '<a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('qti_trackchanges', tinymce.plugins.trackChanges);
})();

function confirmChanges(ed) {
		
	var bodyContent = tinyMCE.activeEditor.selection.dom.doc.body;
	var spans = bodyContent.getElementsByTagName('span');
	var spans_old = new Array;
	var spans_new = new Array;
	if(spans.length > 0) {
		for(var i in spans) {
			if(spans[i] != undefined && spans[i].attributes != undefined && spans[i].getAttribute('class') == 'changestracking_original') {
				spans_old.push(spans[i]);
			} else if(spans[i] != undefined && spans[i].attributes != undefined && spans[i].getAttribute('class') == 'changestracking_new') {
				spans_new.push(spans[i]);
			}
		}
		for(i in spans_old) {
			tinyMCE.activeEditor.dom.remove(spans_old[i]);
		}
		for(i in spans_new) {
			var c = spans_new[i].innerHTML;
			ed.selection.select(spans_new[i]);
			tinyMCE.activeEditor.dom.remove(spans_new[i]);
			tinyMCE.execCommand('mceInsertContent', false, c);
		}
	}
	
}
		
