tinyMCEPopup.requireLangPack();

var feedbackDialog = {
	
	mouseX : 0,
	mouseY : 0,
	mDownX : 0,
	mDownY : 0,
	canvasHeight : 200,
	elementHeight : 42,
	rightCoordinates : new Array,
	leftCoordinates : new Array,
	matchIdentifier: '',
	images: false,
	
	init : function(ed) {
		
		var ed = ed;
		var f = document.forms[0]; 
		var data = tinyMCEPopup.getWindowArg("data");
		feedbackDialog.data = data;
		feedbackDialog.matchIdentifier = data[1];
		var maxElementCount = 2;
		
		feedbackDialog.images = data[0];
		
		// left set elements
		if(data != undefined && data[3].length > 0 && data[3].length == data[4].length) {
			
			maxElementCount = data[3].length;
			for(q=0; q<data[3].length;q++) {
				var newDiv = document.createElement('div');
				newDiv.setAttribute('style', 'width: 100%; margin: 3px; height:40px;');
				newDiv.setAttribute('id', data[4][q]);
				
				var odp = data[3][q];
				if(data[0] == true) {
					if(odp.match(/^<img[^>]*>$/i)) {
						odp = odp.replace(/^<img src="([^"]*)"[^>]*>$/, '$1');
					} 
					newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="160px" style="" align="right"><input type="hidden" id="id_left_' + q + '" name="ids_left[]" value="' + data[4][q] + '"/><input type="hidden" id="answer_left_' + q + '" name="answers_left[]" style="" value="' + odp + '"/><div style="width: 80px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;"><img style="max-height: 40px; max-width: 80px;" src="' + odp + '"></div></td></tr></table>';
				} else {
					newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="160px" style="" align="right"><input type="hidden" id="id_left_' + q + '" name="ids_left[]" value="' + data[4][q] + '"/><input type="text" disabled="disabled" id="answer_left_' + q + '" name="answers_left[]" style="width: 100%; margin-right: 5px;" value="' + odp + '"/></td></tr></table>';
				}
				document.getElementById('left_container').appendChild(newDiv);
			}
		
		} 
		
		// right set elements
		if(data != undefined && data[5].length > 0 && data[5].length == data[6].length) {
			
			if(data[5].length > maxElementCount) {
				maxElementCount = data[5].length;
			}
			for(q=0; q<data[5].length;q++) {
				var newDiv = document.createElement('div');
				newDiv.setAttribute('style', 'width: 100%; margin: 3px; height:40px;');
				newDiv.setAttribute('id', data[6][q]);
				var odp = data[5][q];
				if(data[0] == true) {
					if(odp.match(/^<img[^>]*>$/i)) {
						odp = odp.replace(/^<img src="([^"]*)"[^>]*>$/, '$1');
					}
					newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="160px" style="" align="left"><input type="hidden" id="id_right_' + q + '" name="ids_right[]" value="' + data[6][q] + '"/><input type="hidden" id="answer_right_' + q + '" name="answers_right[]" style="" value="' + odp + '"/><div style="width: 80px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;"><img style="max-height: 40px; max-width: 80px;" src="' + odp + '"></div></td></tr></table>';
				} else {
					newDiv.innerHTML = '<table cellpadding=0 cellspacing=0><tr><td width="160px" style="" align="left"><input type="hidden" id="id_right_' + q + '" name="ids_right[]" value="' + data[6][q] + '"/><input type="text" disabled="disabled" id="answer_right_' + q + '" name="answers_right[]" style="width: 100%; margin-right: 15px;" value="' + odp + '"/></td></tr></table>';
				}
				document.getElementById('right_container').appendChild(newDiv);
			}
		
		} 
		
		feedbackDialog.setCanvas();
		
		feedbackDialog.resizeCanvas(maxElementCount);
		
		if(data != undefined) {
			feedbackDialog.setElementFields(data[4],data[6]);
		} 
		
		// connections
		if(data != undefined && tinyMCE.feedback[data[1]] != undefined) {
			
			var pair = new Array;
			var pairs = tinyMCE.feedback[data[1]].text;
			var leftElements = data[4];
			var rightElements = data[6];
			
			for(p in pairs) {
				pair = p.split(' ');
				$('#middle_container').append('<input id="' + p + '" type="hidden" name="pair[]" value="' + p + '">');
				indexOfLeft = leftElements.indexOf(pair[0]);
				indexOfRight = rightElements.indexOf(pair[1]);
				this.drawConnectionLine(indexOfLeft, indexOfRight, p);
				
			}
			
		}
		
	},
	
	// setting canvas objects
	setCanvas : function() {
		
		document.onmousemove = feedbackDialog.getMousePos;
		canvas = document.getElementById("canvas");
		canvas_temp = document.getElementById("canvas_temp");
		ctx = canvas.getContext("2d");
		ctx_temp = canvas_temp.getContext("2d");

	},
	
	// resizing canvas
	resizeCanvas : function(maxElementCount) {
		
		feedbackDialog.canvasHeight = feedbackDialog.elementHeight * maxElementCount;
		
		document.getElementById('canvas').setAttribute('height', String(feedbackDialog.canvasHeight) + 'px');
		document.getElementById('canvas_temp').setAttribute('height', String(feedbackDialog.canvasHeight) + 'px');
		
	},
	
	// setting element fields
	setElementFields : function(leftElements, rightElements) {
		
		feedbackDialog.leftCoordinates = new Array;
		feedbackDialog.rightCoordinates = new Array;
		
		for (el in leftElements) {
			ctx.fillStyle = 'green';
			ctx.beginPath();
			if(feedbackDialog.images == true) {
				ctx.fillRect(0, (el * feedbackDialog.elementHeight) + 20,10,10);
				feedbackDialog.leftCoordinates.push( {min: (el * feedbackDialog.elementHeight) + 20, max: (el * feedbackDialog.elementHeight) + 20 + 10, middle: (el * feedbackDialog.elementHeight) + 20 + 5} );
			} else {
				ctx.fillRect(0, (el * feedbackDialog.elementHeight) + 5,10,10);
				feedbackDialog.leftCoordinates.push( {min: (el * feedbackDialog.elementHeight) + 5, max: (el * feedbackDialog.elementHeight) + 5 + 10, middle: (el * feedbackDialog.elementHeight) + 5 + 5} );
			}
			ctx.stroke();
		}
		
		for (el in rightElements) {
			ctx.fillStyle = 'green';
			ctx.beginPath();
			if(feedbackDialog.images == true) {
				ctx.fillRect(190, (el * feedbackDialog.elementHeight) + 20,10,10);
				feedbackDialog.rightCoordinates.push( {min: (el * feedbackDialog.elementHeight) + 20, max: (el * feedbackDialog.elementHeight) + 20 + 10, middle: (el * feedbackDialog.elementHeight) + 20 + 5} );
			} else {
				ctx.fillRect(190, (el * feedbackDialog.elementHeight) + 5,10,10);
				feedbackDialog.rightCoordinates.push( {min: (el * feedbackDialog.elementHeight) + 5, max: (el * feedbackDialog.elementHeight) + 5 + 10, middle: (el * feedbackDialog.elementHeight) + 5 + 5} );
			}
			ctx.stroke();
		}
		
	},
	
	drawConnectionLine : function(indexOfLeft,indexOfRight, identifier) {
		
		y0 = feedbackDialog.leftCoordinates[indexOfLeft].middle;
		y1 = feedbackDialog.rightCoordinates[indexOfRight].middle;
		
		ctx.lineWidth = '2'; 
		ctx.strokeStyle = "#2b6fb6";
		ctx.lineCap = 'round';
	
		ctx.beginPath();
		ctx.moveTo(10, y0);
		ctx.lineTo(190,y1);
		ctx.stroke();
		
	},
	
	remakeConnectionLines : function() {
		
		$('#connections_container').html('');
		var inputs = $('#middle_container').children();
		inputs.each(function setLine(ind) {
			
			var pair = inputs[ind].getAttribute('value');
			elements = pair.split(' ');
			
			var leftIndexes = new Array;
			var leftElements = $('#left_container').children();
			leftElements.each(function getId(ind) {
				leftIndexes.push(leftElements[ind].getAttribute('id'));
			});
			
			var rightIndexes = new Array;
			var rightElements = $('#right_container').children();
			rightElements.each(function getId(ind) {
				rightIndexes.push(rightElements[ind].getAttribute('id'));
			});
			
			feedbackDialog.drawConnectionLine(leftIndexes.indexOf(elements[0]), rightIndexes.indexOf(elements[1]), pair);
			
		});
		
	},
	
	checkLeftCoordinates : function (coord) {
		
		for (i in feedbackDialog.leftCoordinates) {
			if(coord > feedbackDialog.leftCoordinates[i].min && coord < feedbackDialog.leftCoordinates[i].max) {
				return true;
			}
		}
		return false;
		
	},

	checkRightCoordinates : function(coord) {
		
		for (i in feedbackDialog.rightCoordinates) {
			if(coord > feedbackDialog.rightCoordinates[i].min && coord < feedbackDialog.rightCoordinates[i].max) {
				return true;
			}
		}
		return false;
		
	},
	
	getMousePos : function(e) {
		
		var canvas = $('#canvas');
		var cpn = canvas.parent().get(0);
		if((feedbackDialog.mDownX > 0 && feedbackDialog.mDownX < 10) && feedbackDialog.checkLeftCoordinates(feedbackDialog.mDownY) || 
			(feedbackDialog.mDownX > 190 && feedbackDialog.mDownX < 200) && feedbackDialog.checkRightCoordinates(feedbackDialog.mDownY)) {
			feedbackDialog.drawTempLine(feedbackDialog.mDownX,feedbackDialog.mDownY,feedbackDialog.mouseX,feedbackDialog.mouseY);
		}
		feedbackDialog.mouseX = e.clientX - cpn.offsetLeft;
		feedbackDialog.mouseY = e.clientY - cpn.offsetTop;
		
	},
	
	mouseDown : function() {
		
		feedbackDialog.mDownX = feedbackDialog.mouseX;
		feedbackDialog.mDownY = feedbackDialog.mouseY;
		
	},

	mouseUp : function() {
		
		if(feedbackDialog.mouseX == feedbackDialog.mDownX && feedbackDialog.mouseY == feedbackDialog.mDownY) {
			
			var leftEl = new Array;
			var left = document.getElementById('left_container').childNodes;
			for(i in left) {
				if(left[i] && left[i].nodeName == 'DIV') {
					leftEl.push(left[i].id);
				}
			}
			
			var rightEl = new Array;
			var right = document.getElementById('right_container').childNodes;
			for(i in right) {
				if(right[i] && right[i].nodeName == 'DIV') {
					rightEl.push(right[i].id);
				}
			}
			
			var existingConnections = $('#middle_container').children();
			
			var stop_flag = false;
			
			existingConnections.each(function(c) {
				if(stop_flag == true) {
					return;
				} 
				ctx_temp.clearRect(0,0,200,feedbackDialog.canvasHeight);
				var pairId = existingConnections[c].getAttribute('id');
				var pair = pairId.split(' ');
				
				var leftPos = leftEl.indexOf(pair[0]);
				var rightPos = rightEl.indexOf(pair[1]);;
				
				ctx_temp.fillStyle = '#ff0000';
				ctx_temp.beginPath();
				ctx_temp.moveTo(10, feedbackDialog.leftCoordinates[leftPos].middle - 2);
				ctx_temp.lineTo(10, feedbackDialog.leftCoordinates[leftPos].middle + 2);
				ctx_temp.lineTo(190,feedbackDialog.rightCoordinates[rightPos].middle + 2);
				ctx_temp.lineTo(190,feedbackDialog.rightCoordinates[rightPos].middle - 2);
				ctx_temp.closePath();
				ctx_temp.fill();
				
				if(ctx_temp.isPointInPath(feedbackDialog.mouseX, feedbackDialog.mouseY)) {
					stop_flag = true;
					///////////
					$('#middle_container').append('<input id="' + pairId + '" type="hidden" name="pair[]" value="' + pairId + '">');
					$('#feedback_pair').attr('value', pairId);
					if(tinyMCE.feedback[feedbackDialog.matchIdentifier].text != undefined) {
						$('#feedback_text').attr('value', tinyMCE.feedback[feedbackDialog.matchIdentifier].text[pairId]);
					}
					if(tinyMCE.feedback[feedbackDialog.matchIdentifier].sound != undefined) {
						$('#fdb_sound').attr('value', tinyMCE.feedback[feedbackDialog.matchIdentifier].sound[pairId]);
					}
					$('#feedback_text').attr('style','width: 100%; background-color: #ffffff;');
					$('#feedback_text').removeAttr('disabled');
					$('#feedback_text').focus();
					$('#add_text_feedback').removeAttr('disabled');
					//////////
					return;
				} else {
					$('#feedback_text').attr('style','width: 100%; background-color: #f0f0f0;');
					$('#feedback_text').attr('disabled','disabled');
					$('#feedback_text').attr('value', '');
					$('#add_text_feedback').attr('disabled','disabled');
					ctx_temp.clearRect(0,0,200,feedbackDialog.canvasHeight);
				}
				
			});
			
			var stop_flag = false;
			
		} else {
			if(((feedbackDialog.mDownX > 0 && feedbackDialog.mDownX < 10) && feedbackDialog.checkLeftCoordinates(feedbackDialog.mDownY)) && ((feedbackDialog.mouseX > 190 && feedbackDialog.mouseX < 200) && feedbackDialog.checkRightCoordinates(feedbackDialog.mouseY))) {
				feedbackDialog.makeNewConnection(feedbackDialog.mDownX,feedbackDialog.mDownY,feedbackDialog.mouseX,feedbackDialog.mouseY);
			} else if(((feedbackDialog.mDownX > 190 && feedbackDialog.mDownX < 200) && feedbackDialog.checkRightCoordinates(feedbackDialog.mDownY)) && ((feedbackDialog.mouseX > 0 && feedbackDialog.mouseX < 10) && feedbackDialog.checkLeftCoordinates(feedbackDialog.mouseY))) {
				feedbackDialog.makeNewConnection(feedbackDialog.mouseX,feedbackDialog.mouseY,feedbackDialog.mDownX,feedbackDialog.mDownY);
			} else {
				ctx_temp.clearRect(0,0,200,feedbackDialog.canvasHeight);
			}
		}
		feedbackDialog.mDownX = 0;
		feedbackDialog.mDownY = 0;
		
	},
	
	makeNewConnection : function(x1, y1, x2, y2) { 
		
		ctx_temp.clearRect(0,0,200,feedbackDialog.canvasHeight);
		
		var posY1 = y1 - 5;
		posY1 = posY1/feedbackDialog.elementHeight;
		posY1 = Math.floor(posY1);
		var posY2 = y2 - 5;
		posY2 = posY2/feedbackDialog.elementHeight;
		posY2 = Math.floor(posY2);
		
		var leftChildren = $('#left_container').children();
		var rightChildren = $('#right_container').children();
		
		var identifier = leftChildren[posY1].getAttribute('id') + ' ' + rightChildren[posY2].getAttribute('id');
		var existing = $('#middle_container').children();
		var exists = false;
		existing.each(function(input) {
			if(existing[input].getAttribute('id') == identifier) {
				exists = true;
			}
		});
		
		if(!exists) {
			
			ctx_temp.fillStyle = '#ff0000';
			ctx_temp.beginPath();
			ctx_temp.moveTo(10, feedbackDialog.leftCoordinates[posY1].middle - 2);
			ctx_temp.lineTo(10, feedbackDialog.leftCoordinates[posY1].middle + 2);
			ctx_temp.lineTo(190,feedbackDialog.rightCoordinates[posY2].middle + 2);
			ctx_temp.lineTo(190,feedbackDialog.rightCoordinates[posY2].middle - 2);
			ctx_temp.closePath();
			ctx_temp.fill();
			
			if(tinyMCE.feedback[feedbackDialog.matchIdentifier] == undefined) {
				tinyMCE.feedback[feedbackDialog.matchIdentifier] = {text: new Array, sound: new Array};
			}
			if(tinyMCE.feedback[feedbackDialog.matchIdentifier].text == undefined) {
				tinyMCE.feedback[feedbackDialog.matchIdentifier].text = new Array;
			}
			if(tinyMCE.feedback[feedbackDialog.matchIdentifier].sound == undefined) {
				tinyMCE.feedback[feedbackDialog.matchIdentifier].sound = new Array;
			}
			
			tinyMCE.feedback[feedbackDialog.matchIdentifier].text[identifier] = '';
			tinyMCE.feedback[feedbackDialog.matchIdentifier].sound[identifier] = '';
			$('#middle_container').append('<input id="' + identifier + '" type="hidden" name="pair[]" value="' + identifier + '">');
			$('#feedback_pair').attr('value', identifier);
			$('#feedback_text').attr('value', '');
			$('#fdb_sound').attr('value', '');
			$('#feedback_text').attr('style','width: 100%; background-color: #ffffff;');
			$('#feedback_text').removeAttr('disabled');
			$('#feedback_text').focus();
			$('#add_text_feedback').removeAttr('disabled');
			feedbackDialog.drawConnectionLine(posY1,posY2,identifier);
			
		} else {
			console.log('TODO: action on existing feedback');
		}
		
	},

	drawTempLine : function (x1, y1, x2, y2) { 
		
		ctx_temp.clearRect(0,0,200,feedbackDialog.canvasHeight);
		
		ctx_temp.lineWidth = '2';
		ctx_temp.strokeStyle = "#2b6fb6";
		ctx_temp.lineCap = 'round';
		
		ctx_temp.beginPath();
		ctx_temp.moveTo(x1, y1);
		ctx_temp.lineTo(x2, y2);
		ctx_temp.stroke();
		
	},
	
	saveFeedback : function() {
		
		var pair = $('#feedback_pair').attr('value');
		var text = $('#feedback_text').attr('value');
		var sound = $('#fdb_sound').attr('value');
		tinyMCE.feedback[feedbackDialog.matchIdentifier].text[pair] = text;
		tinyMCE.feedback[feedbackDialog.matchIdentifier].sound[pair] = sound;
		$('#feedback_text').attr('style','width: 100%; background-color: #f0f0f0;');
		$('#feedback_text').attr('disabled','disabled');
		$('#feedback_text').attr('value', '');
		$('#add_text_feedback').attr('disabled','disabled');
		ctx_temp.clearRect(0,0,200,feedbackDialog.canvasHeight);
		
	}

};

tinyMCEPopup.onInit.add(feedbackDialog.init, feedbackDialog);
