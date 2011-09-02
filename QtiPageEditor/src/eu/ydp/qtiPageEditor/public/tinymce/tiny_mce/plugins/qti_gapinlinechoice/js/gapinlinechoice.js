tinyMCEPopup.requireLangPack();

var gapInlineChoiceDialog = {
		init : function(ed) {

			var ed = ed;
			var f = document.forms[0]; 
			var data = tinyMCEPopup.getWindowArg("gapInlineChoiceData");

			if(data != undefined && data.question != undefined) {
				f.question.value = data.question;
			}
			if(data != undefined && data.content != undefined) {
				data.content = data.content.replace(/&nbsp;/g,' ').replace(/<br \/>/g,'\n').replace(/<br>/g,'\n');
				f.exercise_content.value = data.content;
			}

			var randid = Math.random();
			randid = String(randid);
			var rg = new RegExp('0.([0-9]*)',"gi");
			exec = rg.exec(randid);
			f.identifier.value = 'id_' + exec[1];



			if (data == undefined) {
				document.getElementById('gaps_list').innerHTML += '<input type="hidden" name="addnew" value="1">';
			}

			if(data != undefined && data.inlineRows != undefined) {

				for (r in data.inlineRows) {

					if ('gap' == data.inlineRows[r].type) {
						addNewRow(data.inlineRows[r]);
					} else {
						addNewRow(null);
						var jsonString = tinymce.util.JSON.serialize(data.inlineRows[r]);
						$('#distractorData'+data.inlineRows[r].id).attr('value', jsonString);
						$('#distractor' + data.inlineRows[r].id).attr('disabled', false);
						$('#answer' + data.inlineRows[r].id).attr('disabled', true);
						$('#checkbox' + data.inlineRows[r].id).attr('checked', true);
					}
				}
			} else {
				addNewRow(null);
			}
		},

		insertGapActivityRow: function(row, sourcesList, newData) {
			var pattern = '[gap#'+row.id+']';
			var gapTag = '<!-- <textEntryInteraction responseIdentifier="' + row.identifier + '" expectedLength="100">';
			if ('undefined' != typeof tinyMCE.feedback) {
				var feedbackObj = tinyMCE.feedback[row.identifier];//new tinymce.util.JSON.parse(row.feedback);

				if('undefined' != typeof feedbackObj) {

					if ('undefined' != typeof feedbackObj.onOk) {
						gapTag += '<feedbackInline ';
						gapTag += 'mark="CORRECT"';
						gapTag += ' fadeEffect="300" ';
						gapTag += 'senderIdentifier="^' + row.identifier + '$" ';
						gapTag += 'outcomeIdentifier="' + row.identifier + '" '; 
						gapTag += 'identifier="' + row.answer + '" showHide="show">' + feedbackObj.onOk + '</feedbackInline>'
					}

					if ('undefined' != typeof feedbackObj.onWrong) {
						gapTag += '<feedbackInline ';
						gapTag += 'mark="WRONG"';
						gapTag += ' fadeEffect="300" ';
						gapTag += 'senderIdentifier="^' + row.identifier + '$" ';
						gapTag += 'outcomeIdentifier="' + row.identifier + '" ';
						gapTag += 'identifier="' + row.answer + '" showHide="hide">' + feedbackObj.onWrong + '</feedbackInline>'
					}
				}
			}
			gapTag += '</textEntryInteraction> -->';
			gapTag += '<span id="gap" class="mceNonEditable" style="border: 1px solid blue; color: blue; background-color: #f0f0f0;">';
			gapTag += row.answer;
			gapTag += '</span>';
			//console.log(content);
			newData.content = newData.content.replace(pattern, gapTag);
			//console.log(content);
			//sourcesList.content += gapTag;
			var responseDeclaration = '<!-- <responseDeclaration identifier="' + row.identifier + '" cardinality="single" baseType="string">';
			responseDeclaration += '<correctResponse>';
			responseDeclaration += '<value>' + row.answer + '</value>';
			responseDeclaration += '</correctResponse>';
			responseDeclaration += '</responseDeclaration> -->';

			sourcesList.responses += responseDeclaration;
		},

		insertInlineChoiceActivityRow: function(row, sourcesList, newData) {

			var pattern = '[inlineChoice#'+row.id+']';
			var choiceSection = '<!-- <inlineChoiceInteraction responseIdentifier="' + row.data.identifier + '" shuffle="' + String(row.data.shuffle) + '"> --><span id="inlineChoiceInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; background-color: #f0f0f0;">';
			responseDeclaration = '<!-- <responseDeclaration identifier="' + row.data.identifier + '" cardinality="single" baseType="identifier"><correctResponse>';

			for(i in row.data.answers) {
				choiceSection += '<!-- <inlineChoice identifier="' + row.data.ids[i] + '"';
				if(row.data.fixed[i] == 1) {
					choiceSection += ' fixed="true" ';
				}
				choiceSection += '>' + row.data.answers[i];

				if(row.data.feedbacks != undefined && row.data.feedbacks[row.data.ids[i]] != undefined) {
					choiceSection += '<feedbackInline ';
					if(row.data.points[i] == 1) { 
						choiceSection += 'mark="CORRECT"';
					} else {
						choiceSection += 'mark="WRONG"';
					}
					choiceSection += ' fadeEffect="300" senderIdentifier="^' + row.data.ids[i] + '$" outcomeIdentifier="' + row.data.ids[i] + '" identifier="' + row.data.answers[i] + '" showHide="show">' + row.data.feedbacks[row.data.ids[i]] + '</feedbackInline>'
				} 

				choiceSection += '</inlineChoice> -->';
				if(row.data.points[i] == 1) {
					responseDeclaration += '<value>' + row.data.ids[i] + '</value>';
					choiceSection += '<span id="inlineChoiceAnswer" style="border: none; color: blue; background-color: #f0f0f0;">' + row.data.answers[i] + '<span style="color: green; font-weight: bold;"> &raquo;</span></span>';
				} else {
					choiceSection += '<span id="inlineChoiceAnswer" style="display: none;">' + row.data.answers[i] + '</span>';
				}
			}
			responseDeclaration += '</correctResponse></responseDeclaration> -->';
			choiceSection += '</span><!-- end of inlineChoiceInteraction -->';

			newData.content = newData.content.replace(pattern, choiceSection);
			//sourcesList.content += choiceSection;
			sourcesList.responses += responseDeclaration;
		},

		insertGapInlineChoiceSection : function(form) {
			var obj = new Object();
			obj.identifier = $('#identifier').val();
			obj.question = $('[name=question]').val();
			obj.content = $('[name=exercise_content]').val().replace(/\n/g,'<br/>').replace(/[ ]/gi,'&nbsp;');
			
			obj.inlineRows = new Array();

			$('#gaps tbody tr').each(function() {
				$tr = $(this);
				var row = new Object();
				row.id = $tr.attr('id');
				if (false == $('#checkbox' + row.id).attr('checked')) {
					row.identifier = $tr.find('#identifier'+row.id).val();
					row.answer = $tr.find('#answer'+row.id).val();
					row.checkboks = $tr.find('#checkbox'+row.id).attr('checked');
					//row.feedback = $tr.find('#feedback'+row.id).val();
					row.type = 'gap';
				} else {
					row.data = tinymce.util.JSON.parse($('#distractorData'+$tr.attr('id')).val());
					row.type = 'inlineChoice';
				}

				obj.inlineRows.push(row);
			});

			if (obj.question != undefined && obj.question != '') {
				var ed = tinymce.EditorManager.activeEditor;
				var bm = ed.selection.getBookmark();
//				ed.selection.moveToBookmark(bm);


				var newData = new Object();
				newData.content = '';

				if(form.addnew != undefined && form.addnew.getAttribute('value') == '1') {
					newData.content = '<p>&nbsp;</p><!-- <gapInlineChoiceInteraction> -->';
					newData.content += '<div id="gapInlineChoiceInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue;padding: 5px; background-color: rgb(240, 240, 240);">';
				}
				newData.content += '<!-- <prompt> --><p id="gapInlineChoiceInteractionQuestion">'+obj.question+'</p><!-- </prompt> -->';
				newData.content += '<!-- <content> --><p id="gapInlineChoiceInteractionContent">'+obj.content+'</p><!-- </content> -->'; 

				var sourcesList = new Object();
				//sourcesList.content = '<!-- <sourcesList> -->';
				sourcesList.responses = '';
				
				for (i in obj.inlineRows) {
					var row = obj.inlineRows[i];

					if ('gap' == row.type) {
						//content = content.replace(pattern, '<!-- <slot id="'+row.identifier+'"></slot> --><span id="mgap" style="border: 1px solid green;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
						this.insertGapActivityRow(row, sourcesList, newData);
					} else if ('inlineChoice' == row.type){
						//var pattern = '[inlineChoice#'+row.id+']';
						//newData.content = newData.content.replace(pattern, '<!-- <slot id="'+row.data.identifier+'"></slot> --><span id="minlineChoice" style="border: 1px solid green;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
						this.insertInlineChoiceActivityRow(row, sourcesList, newData);
					}
				}
				
				//sourcesList.content += '<!-- </sourcesList> -->';
				//content += sourcesList.content;

				var ed = tinymce.EditorManager.activeEditor;
				var bm = ed.selection.getBookmark();

				if(form.addnew != undefined && form.addnew.getAttribute('value') == '1') {
					newData.content += '</div><!-- end of </gapInlineChoiceInteraction> --><p>&nbsp;</p>';

					var dom = ed.dom;
					var patt = '';

					ed.execCommand('mceInsertContent', false, '<br class="_mce_marker" />');

					tinymce.each('h1,h2,h3,h4,h5,h6,p'.split(','), function(n) {

						if (patt) {
							patt += ',';
						}
						patt += n + ' ._mce_marker';
					});

					tinymce.each(dom.select(patt), function(n) {
						ed.dom.split(ed.dom.getParent(n, 'h1,h2,h3,h4,h5,h6,p'), n);
					});

					dom.setOuterHTML(dom.select('._mce_marker')[0], newData.content);
					ed.selection.moveToBookmark(bm);

					body = ed.selection.getNode();
					while(body.nodeName != 'BODY') {
						body = body.parentNode;
					}
					regexp = new RegExp('(<!-- <itemBody> -->)','gi');
					body.innerHTML = body.innerHTML.replace(regexp, sourcesList.responses + '$1');

				} else {
					var nd = tinyMCE.selectedNode;
					
					while(nd.id != 'gapInlineChoiceInteraction') {
						nd = nd.parentNode;
					}
					nd.innerHTML = newData.content;
					body = nd;
					while(body.nodeName != 'BODY') {
						body = body.parentNode;
					}

					var identifier = '';
					var resp = '';
					
					for (i in obj.inlineRows) {
						resp = obj.inlineRows[i];
					
						if ('inlineChoice' == resp.type) {
							identifier = resp.data.identifier;
					
						} else if ('gap' == resp.type) {
							identifier = resp.identifier;
						}
						var respOldRgx = new RegExp('<!-- <responseDeclaration identifier="'+identifier+'"[^>]*>[^<]*<correctResponse>[^<]*<value>[^<]*<\/value>[^<]*<\/correctResponse>[^<]*<\/responseDeclaration> -->', 'gi');
						var respNewRgx = new RegExp('<!-- <responseDeclaration identifier="'+identifier+'"[^>]*>[^<]*<correctResponse>[^<]*<value>[^<]*<\/value>[^<]*<\/correctResponse>[^<]*<\/responseDeclaration> -->', 'gi');
						var newRespRgxRes = respNewRgx.exec(sourcesList.responses);
						var newRespSection = '';
						
						if (null != newRespRgxRes) {
							newRespSection = newRespRgxRes[0]; 
						}
						body.innerHTML = body.innerHTML.replace(respOldRgx, newRespSection);
					}
				}
				ed.selection.moveToBookmark(bm);

				// Remove illegal text before headins
				var beforeHeadings = ed.selection.dom.doc.body.innerHTML.match(/(.*?)(?=<!-- \?xml)/);
				if(beforeHeadings != undefined && beforeHeadings[1] != '') {
					ed.selection.dom.doc.body.innerHTML = ed.selection.dom.doc.body.innerHTML.replace(/(.*?)(?=<!-- \?xml)/,'');
				}
				if(beforeHeadings && beforeHeadings[1] != '') {
					ed.selection.dom.doc.body.innerHTML = ed.selection.dom.doc.body.innerHTML.replace(/<itemBody> -->/,'<itemBody> -->' + beforeHeadings[1]);
				}
			}
			/*
			if(tinyMCE.feedback != undefined) {
				var row = '';
				var identifier = '';
				var gap = '';
				
				for (i in obj.inlineRows) {
					row = obj.inlineRows[i];
					if ('gap' == row.type) {
						identifier = row.identifier;
						gap = row.answer;
					} else if ('inlineChoice' == row.type) {
						identifier = row.data.identifier;
					}

					var rg_onok = new RegExp('<!-- <modalFeedback[^>]*outcomeIdentifier="' + identifier + '"[^>]*showHide="show"[^>]*>[^<]*</modalFeedback> -->','gi');
					var rg_onwrong = new RegExp('<!-- <modalFeedback[^>]*outcomeIdentifier="' + identifier + '"[^>]*showHide="hide"[^>]*>[^<]*</modalFeedback> -->','gi');
					if(rg_onok.exec(tinyMCE.activeEditor.dom.doc.body.innerHTML) != '') {
						tinyMCE.activeEditor.dom.doc.body.innerHTML = tinyMCE.activeEditor.dom.doc.body.innerHTML.replace(rg_onok,'');
					}
					if(rg_onwrong.exec(tinyMCE.activeEditor.dom.doc.body.innerHTML) != '') {
						tinyMCE.activeEditor.dom.doc.body.innerHTML = tinyMCE.activeEditor.dom.doc.body.innerHTML.replace(rg_onwrong,'');
					}

					if(tinyMCE.feedback[identifier] != undefined) {

						var mf_onok = '<!-- <modalFeedback outcomeIdentifier="' + identifier + '" identifier="' + gap + '" showHide="show"';
						if(tinyMCE.feedback[identifier].sound_onok != undefined && tinyMCE.feedback[identifier].sound_onok != '') {
							mf_onok += ' sound="' + tinyMCE.feedback[identifier].sound_onok + '"';
						}
						mf_onok += '></modalFeedback> -->'
							var mf_onwrong = '<!-- <modalFeedback outcomeIdentifier="' + identifier + '" identifier="' + gap + '" showHide="hide"';
						if(tinyMCE.feedback[identifier].sound_onwrong != undefined && tinyMCE.feedback[identifier].sound_onwrong != '') {
							mf_onwrong += ' sound="' + tinyMCE.feedback[identifier].sound_onwrong + '"';
						}
						mf_onwrong += '></modalFeedback> -->'

							tinyMCE.activeEditor.dom.doc.body.innerHTML = tinyMCE.activeEditor.dom.doc.body.innerHTML.replace(/(<!-- <\/itemBody> -->)/i, '$1' + mf_onok + mf_onwrong);
					}
				}
			} 
			*/
			tinyMCEPopup.close();
			return true;
		},

		openInlineChoice: function(rowNr) {
			var ed  = tinyMCE.activeEditor;
			var url = tinyMCEPopup.getWindowArg("plugin_url");
			var actualData = $('#distractorData'+rowNr).val();

			
			
			ed.windowManager.open({
				file : url + '/inlinechoice.htm',
				width : 470,
				height : 350,
				inline : 1
			}, {
				plugin_url : url, // Plugin absolute URL
				inlineChoiceData : actualData,
				rowNumber: rowNr,
				win: window
			});
		} 
};

tinyMCEPopup.onInit.add(gapInlineChoiceDialog.init, gapInlineChoiceDialog);

