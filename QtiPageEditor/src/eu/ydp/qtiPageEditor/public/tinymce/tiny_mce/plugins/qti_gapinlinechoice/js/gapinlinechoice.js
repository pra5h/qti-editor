tinyMCEPopup.requireLangPack();

var gapInlineChoiceDialog = {
		windowId : null,
		
		init : function(ed) {
			document.body.setAttribute('onUnload',"tinymce.DOM.remove('mcePopupLayer_'+gapInlineChoiceDialog.windowId);");
			document.body.setAttribute('onLoad',"gapInlineChoiceDialog.windowId = tinymce.EditorManager.activeEditor.QTIWindowHelper.lockUI(tinyMCEPopup.id);");
			var ed = ed;
			var f = document.forms[0]; 
			var data = tinyMCEPopup.getWindowArg("gapInlineChoiceData");

			tagInsert.init(f.question.id);
			InputHelper.init(f.question);
			tagInsert.init(f.exercise_content.id);
			MediaHelper.init(f.exercise_content);
			InputHelper.init(f.exercise_content);
//			MediaHelper.init(f.exercise_content);

			if(data != undefined && data.question != undefined) {
				f.question.value = stringDecode(data.question);
			}
			if(data != undefined && data.content != undefined) {
				//data.content = data.content.replace(/&#32;/g,' ').replace(/<br \/>/g,'\n').replace(/<br>/g,'\n');
				data.content = data.content.replace(/<br \/>/g,'\n').replace(/<br>/g,'\n');
				f.exercise_content.value = data.content;
			}

			if(data != undefined && data.identifier != undefined) {
				f.identifier.value = data.identifier;
			} else {
				f.identifier.value = this.regenerateIdentifier();
			}

			if (data == undefined) {
				document.getElementById('gaps_list').innerHTML += '<input type="hidden" name="addnew" value="1">';
			}

			if(data != undefined && data.inlineRows != undefined) {

				for (r in data.inlineRows) {
					var id = data.inlineRows[r].id;
					
					if ('gap' == data.inlineRows[r].type) {
						data.inlineRows[r].answer = $('<div/>').html(data.inlineRows[r].answer).text();
						addNewRow(data.inlineRows[r]);
						
					} else {
						addNewRow(null);
						var jsonString = tinymce.util.JSON.serialize(data.inlineRows[r]);
						$('#distractorData'+data.inlineRows[r].id).attr('value', jsonString);
						$('#distractor' + data.inlineRows[r].id).attr('disabled', false);
						$('#answer' + data.inlineRows[r].id).attr('disabled', true);
						$('#checkbox' + data.inlineRows[r].id).attr('checked', true);
						$('#feedback' + data.inlineRows[r].id).attr('disabled', true);
						$('#imgfeedback' + data.inlineRows[r].id).css('opacity', 0.4);
						//pokazanie w formularzu poprawnej odpowiedzi
						for (i in data.inlineRows[r].points) {
							if (1 == data.inlineRows[r].points[i]) {
								$('#answer'+data.inlineRows[r].id).val(stringDecode(data.inlineRows[r].answers[i]));
							}
						}
					}
					if ('' != $('#answer'+id).val()) {
						$('#'+id+'_add').val('Del');
						$('#'+id+'_add').attr('onClick', 'removeTagFromContentData('+id+')');
					}
				}
				
				if (0 == data.inlineRows.length) {
					addNewRow(null);
				}
				$('#gapinlinechoice_insert').attr('value', 'Save');
				$('#remove_button').show();

			} else {
				addNewRow(null);
			}
			$('.focusedGapInlineChoice').focus();
		},

		insertGapActivityRow: function(row, sourcesList, newData) {
			var gapMatch = newData.content.match('\\[gap#'+row.id+'\\]', 'gi');
			var count = 0;
			if (null != gapMatch) {
				count = gapMatch.length;
			}
			
			var pattern = new RegExp('\\[gap#'+row.id+'\\]', 'i');
			for(var i = 0; i < count; i++) {
				var gapTag = '<!-- <textEntryInteraction responseIdentifier="' + row.identifier + '" expectedLength="100">';
				if ('undefined' != typeof tinyMCE.feedback) {
					var feedbackObj = tinyMCE.feedback[row.identifier];//new tinymce.util.JSON.parse(row.feedback);

					if('undefined' != typeof feedbackObj) {

						if ('undefined' != typeof feedbackObj.onOk && feedbackObj.onOk != '') {
							gapTag += '<feedbackInline ';
							gapTag += 'mark="CORRECT"';
							gapTag += ' fadeEffect="300" ';
							gapTag += 'senderIdentifier="^' + row.identifier + '$" ';
							gapTag += 'variableIdentifier="' + row.identifier + '" '; 
							gapTag += 'value="' + row.answer + '" showHide="show">' + feedbackObj.onOk + '</feedbackInline>'
						}

						if ('undefined' != typeof feedbackObj.onWrong && feedbackObj.onWrong != '') {
							gapTag += '<feedbackInline ';
							gapTag += 'mark="WRONG"';
							gapTag += ' fadeEffect="300" ';
							gapTag += 'senderIdentifier="^' + row.identifier + '$" ';
							gapTag += 'variableIdentifier="' + row.identifier + '" ';
							gapTag += 'value="' + row.answer + '" showHide="hide">' + feedbackObj.onWrong + '</feedbackInline>'
						}
					}
				}
				gapTag += '</textEntryInteraction> -->';
				gapTag += '<span id="gap" class="mceNonEditable" style="border: 1px solid blue; color: blue; background-color: #f0f0f0;">';
				gapTag += row.answer;
				gapTag += '</span>';
				newData.content = newData.content.replace(pattern, gapTag);
				//sourcesList.content += gapTag;
				var responseDeclaration = '<!-- <responseDeclaration identifier="' + row.identifier + '" cardinality="single" baseType="string">';
				responseDeclaration += '<correctResponse>';
				responseDeclaration += '<value>' + row.answer + '</value>';
				responseDeclaration += '</correctResponse>';
				responseDeclaration += '</responseDeclaration> -->';

				sourcesList.responses += responseDeclaration;
				if (count > 1) {
					var id = this.regenerateIdentifier();
					
					if ('undefined' != typeof tinyMCE.feedback) {
						tinyMCE.feedback[id] = tinyMCE.feedback[row.identifier];
					}
					row.identifier = id;
				}
			}
		},

		insertInlineChoiceActivityRow: function(row, sourcesList, newData) {
			var inlineChoiceMatch = newData.content.match('\\[inlineChoice#'+row.id+'\\]', 'gi');
			var count = 0;
			if (null != inlineChoiceMatch) {
				count = inlineChoiceMatch.length;
			}

			var pattern = new RegExp('\\[inlineChoice#'+row.id+'\\]', 'i');
			for(var j = 0; j < count; j++) {
				var choiceSection = '<!-- <inlineChoiceInteraction responseIdentifier="' + row.data.identifier + '" shuffle="' + String(row.data.shuffle) + '"> --><span id="inlineChoiceInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; background-color: #f0f0f0;">';
				responseDeclaration = '<!-- <responseDeclaration identifier="' + row.data.identifier + '" cardinality="single" baseType="identifier"><correctResponse>';

				for(i in row.data.answers) {
					choiceSection += '<!-- <inlineChoice identifier="' + row.data.ids[i] + '"';
					if(row.data.fixed[i] == 1) {
						choiceSection += ' fixed="true" ';
					}
					choiceSection += '>' + row.data.answers[i];

					if(row.data.feedbacks != undefined && row.data.feedbacks[row.data.ids[i]] != undefined && row.data.feedbacks[row.data.ids[i]] != '') {
						choiceSection += '<feedbackInline ';
						if(row.data.points[i] == 1) { 
							choiceSection += 'mark="CORRECT"';
						} else {
							choiceSection += 'mark="WRONG"';
						}
						//row.data.ids[i]
						var fId = this.regenerateIdentifier();
						choiceSection += ' fadeEffect="300" senderIdentifier="' + row.data.identifier + '" variableIdentifier="' + row.data.identifier + '" value="' + row.data.ids[i] + '" showHide="show">' + row.data.feedbacks[row.data.ids[i]] + '</feedbackInline>'
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
				choiceSection += '</span><!-- </inlineChoiceInteraction> -->';

				newData.content = newData.content.replace(pattern, choiceSection);
				//sourcesList.content += choiceSection;
				sourcesList.responses += responseDeclaration;
				if (count > 1) {
					row.data.identifier = this.regenerateIdentifier();
					for(x in row.data.answers) {
						row.data.ids[x] = this.regenerateIdentifier();
					}
				}
			}
		},

		insertGapInlineChoiceSection : function(form) {
			var ed = tinymce.EditorManager.activeEditor;
			var obj = new Object();
			obj.identifier = $('#identifier').val();
			
			if (!ed.validateHtml($('[name=question]').val(), 'content')) {
				return false;
			}

			obj.question = stringEncode($('[name=question]').val());
			
			//obj.content = stringEncode($('[name=exercise_content]').val()).replace(/\n/g,'<br/>').replace(/[ ]/gi,'&#32;');
			var ec = $('[name=exercise_content]').val();
			if (!ed.validateHtml(ec, 'exercise content')) {
				return false;
			}
			ec = ec.replace(/<img alt="([^"]*)" src="([^"]*)">/g, '[img alt={$1} src={$2}]'); //, '<img src="$2" alt="$1"/>');
			//obj.content = stringEncode(ec).replace(/\n/g,'<br/>');//.replace(/[ ]/gi,'&#32;');
			obj.content = ec.replace(/\n/g,'<br/>');//.replace(/[ ]/gi,'&#32;');
			obj.tags = new Array();
			var reg = new RegExp(/(?:\[(?:(?:gap#|inlineChoice#)[0-9]+)*?\])+/gi);
			
			while (null != (t = reg.exec(obj.content))) {
				obj.tags.push(t[0]);
			}
			obj.inlineRows = new Array();
			var validateHtmlFlag = true;
			
			$('#gaps tbody tr').each(function() {
				$tr = $(this);
				var row = new Object();
				row.id = $tr.attr('id');
				if (false == $('#checkbox' + row.id).attr('checked')) {
					row.identifier = $tr.find('#identifier'+row.id).val();
					//if (!ed.validateHtml($tr.find('#answer'+row.id).val(), 'correct answer')) {
						//validateHtmlFlag = false;
					//} 
					row.answer = stringEncode($('<div/>').text($tr.find('#answer'+row.id).val()).html());
					//row.answer = $("<div/>").text($tr.find('#answer'+row.id).val()).html();
					//console.log(row.answer);
					row.checkboks = $tr.find('#checkbox'+row.id).attr('checked');
					//row.feedback = $tr.find('#feedback'+row.id).val();
					row.type = 'gap';
				} else {
					row.data = tinymce.util.JSON.parse($('#distractorData'+$tr.attr('id')).val());
					row.type = 'inlineChoice';
				}

				obj.inlineRows.push(row);
			});

			if (!validateHtmlFlag) {
				return false;
			}
			
			if (validateGapInlineChoiceExercise(obj)) {
				
				if (obj.question != undefined && obj.question != '') {
					//var bm = ed.selection.getBookmark();
//					ed.selection.moveToBookmark(bm);

					//obj.content = obj.content.replace(/\[img title={([^"]*)} src={([^"]*)}\]/g, '<img src="$2" alt="$1"/>');
					//obj.content = obj.content.replace(/\[img alt={([^"]*?)} src={([^"]*?)}\]/g, '<span class="mediaInputModule"><img alt="$1" src="$2"/><br/>$1</span>');
					obj.content = obj.content.replace(/\[img alt={([^"]*?)} src={([^"]*?)}\]/g, function(a, alt, src) {
						var ret = '<span class="mediaInputModule"><img alt="'+alt+'" src="'+src+'"/><br/>'+ed.decodeMath(alt)+'</span>';
						return ret;
					});

					var newData = new Object();
					newData.content = '';

					if(form.addnew != undefined && form.addnew.getAttribute('value') == '1') {
						newData.content = '<p>&nbsp;</p><!-- <textInteraction> -->';
						newData.content += '<div id="gapInlineChoiceInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue;padding: 5px; background-color: rgb(240, 240, 240);">';
					}
					newData.content += '<!-- <prompt> --><p id="gapInlineChoiceInteractionQuestion">'+obj.question+'</p><!-- </prompt> -->';
					newData.content += '<p id="gapInlineChoiceInteractionContent">'+obj.content+'</p>'; 

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

					//var ed = tinymce.EditorManager.activeEditor;
					//var bm = ed.selection.getBookmark();

					if(form.addnew != undefined && form.addnew.getAttribute('value') == '1') {
						newData.content += '</div><!-- </textInteraction> --><p>&nbsp;</p><span id="focus">_</span>';

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

						//newData.content = ed.correctHtml(newData.content, 'decode'); //poprawka quot'ów w atrybutach mathml'a
						dom.setOuterHTML(dom.select('._mce_marker')[0], newData.content);
						//ed.selection.moveToBookmark(bm);

						body = ed.selection.getNode();
						while(body.nodeName != 'BODY') {
							body = body.parentNode;
						}
						regexp = new RegExp('(<!-- <itemBody> -->)','gi');
						body.innerHTML = body.innerHTML.replace(regexp, sourcesList.responses + '$1');
						ed.focusAfterInsert('focus');
						
					} else {
						var nd = tinyMCE.selectedNode;
						
						while(nd.id != 'gapInlineChoiceInteraction') {
							nd = nd.parentNode;
						}
						//newData.content = ed.correctHtml(newData.content, 'decode');
						nd.innerHTML = newData.content;
						body = nd;
						while(body.nodeName != 'BODY') {
							body = body.parentNode;
						}

						var identifier = '';
						var resp = '';
						var xh = ed.XmlHelper;
						
						for (i in obj.inlineRows) {
							resp = obj.inlineRows[i];

							if ('inlineChoice' == resp.type) {
								identifier = resp.data.identifier;

							} else if ('gap' == resp.type) {
								identifier = resp.identifier;
							}
														
							var newRespDeclarIdsRgx = new RegExp('identifier="([^"]+)"', 'gi');
							var newIds = new Array();
							while( null != (newCorrectResponsesIds = newRespDeclarIdsRgx.exec(sourcesList.responses))) {
								newIds.push(newCorrectResponsesIds[1]);
							}
							var actualResponseNode = null;
							//usuniecie wszystkich correct response zdefiniowanych w ramach tego gapa
							for (var j in newIds) {
								actualResponseNode = xh.getCorrectResponseNodeId(body, newIds[j]);
								if (null != actualResponseNode) {
									actualResponseNode.parentNode.removeChild(actualResponseNode);
								}
							}
							/*
							var respNewRgx = new RegExp(' <responseDeclaration identifier="'+identifier+'"[^>]*>[^<]*<correctResponse>[^<]*<value>[^<]*<\/value>[^<]*<\/correctResponse>[^<]*<\/responseDeclaration> ', 'gi');
							var newRespRgxRes = respNewRgx.exec(sourcesList.responses);

							var newRespSection = '';

							if (null != newRespRgxRes) {
								newRespSection = newRespRgxRes[0]; 
							}

							var correctResponseNode = xh.getCorrectResponseNodeId(body, identifier);
							
							if (null != correctResponseNode) {
								regexp = new RegExp('(<responseDeclaration[^>]*>[^<]*<correctResponse>)(?:[^<]*<value>[^<]*<\/value>[^<]*)*(<\/correctResponse>[^>]*<\/responseDeclaration>)','gi');
								correctResponseNode.nodeValue = correctResponseNode.nodeValue.replace(regexp, newRespSection);
							} else {
								regexp = new RegExp('(<!-- <itemBody> -->)','gi');
								body.innerHTML = body.innerHTML.replace(regexp, '<!-- '+newRespSection + ' -->$1');
							}*/
							//wstawienie nowych correct response
						}
						var itemBody = null;
						itemBody = $(ed.dom.doc.body).contents().filter(function() {
								if (this.nodeType == 8 && this.nodeValue == ' <itemBody> ') {
									return this;
								}
						});
						//console.dir(itemBody.get(0));
						
						//regexp = new RegExp('(<!-- <itemBody> -->)','gi');
						//body.innerHTML = body.innerHTML.replace(regexp, sourcesList.responses + '$1');
						//console.log(sourcesList.responses);
						//ed.dom.doc.body.innerHTML = ed.dom.doc.body.innerHTML.replace(regexp, sourcesList.responses + '$1');
						var respArray = sourcesList.responses.match(/<!-- .*? -->/gi);
						//console.log(test[0].substr(4, test[0].length-5));
						//.substr(5, test[0].length-10)
						for ( var i in respArray) {
							//var newNode = ed.dom.create('p',null,'&nbsp;');
							itemBody.get(0).parentNode.insertBefore(document.createComment(respArray[i].replace('<!--', '').replace('-->','')),itemBody.get(0));
						}
						/*var a = document.createComment(test[0].replace('<!--', '').replace('-->',''));
						console.dir(a);
						regexp = new RegExp('(<!-- <itemBody> -->)','gi');
						body.innerHTML = body.innerHTML.replace(regexp, sourcesList.responses + '$1');
						*/
						//ed.focusAfterInsert('focus');
						ed.focusAfterModify(ed.dom.get(nd));
					}
					//ed.selection.moveToBookmark(bm);

					// Remove illegal text before headins
					var beforeHeadings = ed.selection.dom.doc.body.innerHTML.match(/(.*?)(?=<!-- \?xml)/);
					if(beforeHeadings != undefined && beforeHeadings[1] != '') {
						ed.selection.dom.doc.body.innerHTML = ed.selection.dom.doc.body.innerHTML.replace(/(.*?)(?=<!-- \?xml)/,'');
					}
					if(beforeHeadings && beforeHeadings[1] != '') {
						ed.selection.dom.doc.body.innerHTML = ed.selection.dom.doc.body.innerHTML.replace(/<itemBody> -->/,'<itemBody> -->' + beforeHeadings[1]);
					}
				}
				//ed.execCommand('mceEndUndoLevel');
				tinyMCEPopup.restoreSelection();
				tinyMCEPopup.close();
				return true;
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
			
			return false;
		},
		
		regenerateIdentifier: function() {
			var randid = Math.random();
			randid = String(randid);
			var rg = new RegExp('0.([0-9]*)',"gi");
			exec = rg.exec(randid);
			return 'id_' + exec[1];
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

