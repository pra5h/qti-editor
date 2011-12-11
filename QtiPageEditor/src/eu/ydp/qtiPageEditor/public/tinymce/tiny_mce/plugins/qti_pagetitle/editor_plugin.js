(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('pagetitle');
	
	tinymce.create('tinymce.plugins.pagetitlePlugin', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {
			
			ed.onPreProcess.add(function(ed, o) {
				
				if ("undefined" == typeof $('#pageTitleInput', parent.window.document).get(0)) {
					var reg = new RegExp(/<assessmentItem.*title="([^"]*)".*>/gi);
					var pageTitle = ed.dom.decode(reg.exec(o.content)[1]);
					var span = document.createElement('span');
					span.setAttribute('id', 'pageTitleSpan');
					span.setAttribute('style', 'float: right; margin-top: 2px');
					var label = document.createElement('label');
					label.setAttribute('for', 'pageTitleInput');
					label.innerHTML = 'Page title:';
					var input = document.createElement('input');
					input.setAttribute('id', 'pageTitleInput');
					input.setAttribute('value', pageTitle);
					input.setAttribute('type', 'text');
					input.setAttribute('size', '50');
					input.onkeyup = function(){tinyMCE.execCommand('mceRefreshPageTitle', false)};
					span.appendChild(label);
					span.appendChild(input);
					$('#choose_template', parent.window.document).parent().append(span);
				}
		    });

			ed.addCommand('mceRefreshPageTitle', function(ui,data) {
				pageTitle = $('#pageTitleInput', parent.window.document).val();
				ed.dom.doc.body.innerHTML = ed.dom.doc.body.innerHTML.replace(/(<assessmentItem.*title=")([^"]*)(".*>)/gi,'$1'+ed.dom.encode(pageTitle)+'$3');
				$('#pageTitleInput', parent.window.document).focus();
			});
			
			// Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');
			ed.addCommand('mcePageTitle', function(ui,data) {
				var reg = new RegExp(/<assessmentItem.*title="([^"]*)".*>/gi);
				var pagetitle = reg.exec(ed.dom.doc.body.innerHTML)[1];
				ed.windowManager.open({
					file : url + '/pagetitle.htm',
					width : 400,
					height : 105,
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					title: pagetitle
				});
				
			});
			
			ed.addCommand('mcePageTitleRemove', function(ui, data) {
				ed.dom.doc.body.innerHTML = ed.dom.doc.body.innerHTML.replace(/(<assessmentItem.*title=")([^"]*)(">)/gi,"$1$3");
				return true;
			});
			
			//ed.addButton('pagetitle', {title : 'Insert QTI Page title', cmd : 'mcePageTitle'});
		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Plugin for creating and managing QTIPage Title',
				author : '<a target="_blank" href="http://www.ydp.eu">Young Digital Planet</a>',
				authorurl : '',
				infourl : '',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('qti_pagetitle', tinymce.plugins.pagetitlePlugin);
})();
