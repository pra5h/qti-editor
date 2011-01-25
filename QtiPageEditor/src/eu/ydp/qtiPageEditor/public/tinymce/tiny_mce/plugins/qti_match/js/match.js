tinyMCEPopup.requireLangPack();

var matchDialog = {

	imagesElementHeight : 45,
	textElementHeight : 45,
	rightCoordinates : new Array,
	leftCoordinates : new Array,
	mouseX : 0,
	mouseY : 0,
	mDownX : 0,
	mDownY : 0,
	canvasHeight : 200,

	init : function(ed) {
		
		var ed = ed;
		var f = document.forms[0]; 
		var data = tinyMCEPopup.getWindowArg("matchdata");
		matchDialog.data = data;
		
		var maxElementCount = 2;
		
		// exercise
		if(data != undefined && data[0] != undefined) {
			f.question.value = data[0];
		}
		
		// match identidfier
		if(data != undefined && data[1] != undefined) {
			f.identifier.value = data[1];
			matchDialog.identifier = data[1];
		} else {
			var randid = Math.random();
			randid = String(randid);
			var rg = new RegExp('0.([0-9]*)',"gi");
			exec = rg.exec(randid);
			f.identifier.value = 'id_' + exec[1];
			matchDialog.identifier = 'id_' + exec[1];
		}
		
		// shuffle
		if(data != undefined && data[2] != undefined) {
			if(data[2] == 'true') {
				f.shuffle.checked = true;
			}
		}
		
		// left set elements
		if(data != undefined && data[3].length > 0 && data[3].length == data[4].length) {
			
			maxElementCount = data[3].length;
			for(q=0; q<data[3].length;q++) {
				var newDiv = document.createElement('div');
				newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
				newDiv.setAttribute('id', data[4][q]);
				if(data[7][q] == 'true') {
					fixed = ' checked';
				} else {
					fixed = '';
				}
				var odp = data[3][q];
				if(odp.match(/^<img[^>]*\/?>$/i)) {
					f.images.checked = true;
					odp = odp.replace(/^<img src="([^"]*)"[^>]*\/?>$/, '$1');
					src = odp.split('/');
					src = src[src.length - 1];
					var odpfull = '<img src="' + odp + '">';
					newDiv.innerHTML = '<table cellpadding=0 cellspacing=0>\n\
						<tr><td width="70px">\n\
							<input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" />\n\
						</td><td width="70px">\n\
							<input type="checkbox" id="switch_image_text_chbx" name="switch_image_text_chbx" onclick="switch_text_images(this, false);" checked="checked"/>\n\
						</td><td width="50px" align="center">\n\
							<input id="fixed_left_' + q + '" type="checkbox" name="fixed_left[]" style="margin: 0; padding: 0;" ' + fixed + '/>\n\
						</td><td width="200px" style="" align="right">\n\
							<input type="hidden" id="id_left_' + q + '" name="ids_left[]" value="' + data[4][q] + '"/>\n\
							<div style="width: 120px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;" onclick="tinyMCE.execCommand(\'mceAppendImageToExercise\', false, {src:\'' + src + '\',div:this});">\n\
								<input type="hidden" id="answer_left_' + q + '" name="answers_left[]" style="" value=""/>\n\
								<img style="max-height: 40px; max-width: 80px;" src="' + odp + '"/>\n\
							</div>\n\
						</td></tr></table>';
					document.getElementById('left_container').appendChild(newDiv);
					document.getElementById('answer_left_' + q).setAttribute('value', odpfull);
				} else {
					f.images.checked = false;
					newDiv.innerHTML = '<table cellpadding=0 cellspacing=0>\n\
						<tr><td width="70px">\n\
							<input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" />\n\
						</td><td width="70px">\n\
							<input type="checkbox" id="switch_image_text_chbx" name="switch_image_text_chbx" onclick="switch_text_images(this, false);" />\n\
						</td><td width="50px" align="center">\n\
							<input id="fixed_left_' + q + '" type="checkbox" name="fixed_left[]" style="margin: 0; padding: 0;" ' + fixed + '/>\n\
						</td><td width="200px" style="" align="right">\n\
							<input type="hidden" id="id_left_' + q + '" name="ids_left[]" value="' + data[4][q] + '"/>\n\
							<div style="width: 120px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;">\n\
								<input type="text" id="answer_left_' + q + '" name="answers_left[]" style="width: 100%; margin-right: 5px; margin-top: 12px;" value="' + odp + '"/>\n\
							</div>\n\
						</td></tr></table>';
					document.getElementById('left_container').appendChild(newDiv);
				}
			
			}
		
		} else {
			
			var newSetLeft = new Array;
			
			var randid = Math.random();
			randid = String(randid);
			var rg = new RegExp('0.([0-9]*)',"gi");
			exec = rg.exec(randid);
			var id_0 = 'id_' + exec[1];
			newSetLeft.push(id_0);
			
			var randid = Math.random();
			randid = String(randid);
			var rg = new RegExp('0.([0-9]*)',"gi");
			exec = rg.exec(randid);
			var id_1 = 'id_' + exec[1];
			newSetLeft.push(id_1);
			
			var newDiv = document.createElement('div');
			newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
			newDiv.setAttribute('id', id_0);
			newDiv.innerHTML = '<table cellpadding=0 cellspacing=0>\n\
				<tr><td width="70px">\n\
					<input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" />\n\
				</td><td width="70px">\n\
					<input type="checkbox" id="switch_image_text_chbx" name="switch_image_text_chbx" onclick="switch_text_images(this, false);" />\n\
				</td><td width="50px" align="center">\n\
					<input id="fixed_left_0" type="checkbox" name="fixed_left[]" style="margin: 0; padding: 0;"/>\n\
				</td><td width="200px" style="" align="right">\n\
					<input type="hidden" id="id_left_0" name="ids_left[]" value="' + id_0 + '"/>\n\
					<div style="width: 120px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;">\n\
						<input type="text" id="answer_left_0" name="answers_left[]" style="width: 100%; margin-right: 5px; margin-top: 12px;" value=""/>\n\
					</div>\n\
				</td></tr></table>';
			document.getElementById('left_container').appendChild(newDiv);
			
			var newDiv = document.createElement('div');
			newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
			newDiv.setAttribute('id', id_1);
			newDiv.innerHTML = '<table cellpadding=0 cellspacing=0>\n\
				<tr><td width="70px">\n\
					<input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" />\n\
				</td><td width="70px">\n\
					<input type="checkbox" id="switch_image_text_chbx" name="switch_image_text_chbx" onclick="switch_text_images(this, false);" />\n\
				</td><td width="50px" align="center">\n\
					<input id="fixed_left_1" type="checkbox" name="fixed_left[]" style="margin: 0; padding: 0;"/>\n\
				</td><td width="200px" style="" align="right">\n\
					<input type="hidden" id="id_left_1" name="ids_left[]" value="' + id_1 + '"/>\n\
					<div style="width: 120px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;">\n\
						<input type="text" id="answer_left_1" name="answers_left[]" style="width: 100%; margin-right: 5px; margin-top: 12px;" value=""/>\n\
					</div>\n\
				</td></tr></table>';
			document.getElementById('left_container').appendChild(newDiv);
			
		}
		
		// right set elements
		if(data != undefined && data[5].length > 0 && data[5].length == data[6].length) {
			
			if(data[5].length > maxElementCount) {
				maxElementCount = data[5].length;
			}
			for(q=0; q<data[5].length;q++) {
				var newDiv = document.createElement('div');
				newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
				newDiv.setAttribute('id', data[6][q]);
				if(data[8][q] == 'true') {
					fixed = ' checked';
				} else {
					fixed = '';
				}
				var odp = data[5][q];
				if(odp.match(/^<img[^>]*\/?>$/i)) {
					f.images.checked = true;
					odp = odp.replace(/^<img src="([^"]*)"[^>]*\/?>$/, '$1');
					src = odp.split('/');
					src = src[src.length - 1];
					var odpfull = '<img src="' + odp + '">';
					newDiv.innerHTML = '<table cellpadding=0 cellspacing=0>\n\
						<tr><td width="200px" style="" align="left">\n\
							<input type="hidden" id="id_right_' + q + '" name="ids_right[]" value="' + data[6][q] + '"/>\n\
							<div style="width: 120px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;" onclick="tinyMCE.execCommand(\'mceAppendImageToExercise\', false, {src:\'' + src + '\',div:this});">\n\
								<input type="hidden" id="answer_right_' + q + '" name="answers_right[]" style="" value=""/>\n\
								<img style="max-height: 40px; max-width: 80px;" src="' + odp + '"/>\n\
							</div>\n\
						</td><td width="50px" align="center">\n\
							<input id="fixed_right_' + q + '" type="checkbox" name="fixed_right[]" style="margin: 0; padding: 0;" ' + fixed + '/>\n\
						</td><td width="70px">\n\
							<input type="checkbox" id="switch_image_text_chbx" name="switch_image_text_chbx" onclick="switch_text_images(this, false);" checked="checked"/>\n\
						</td><td width="70px">\n\
							<input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" />\n\
						</td></tr></table>';
					document.getElementById('right_container').appendChild(newDiv);
					document.getElementById('answer_right_' + q).setAttribute('value', odpfull);

				} else {
					f.images.checked = false;
					newDiv.innerHTML = '<table cellpadding=0 cellspacing=0>\n\
						<tr><td width="200px" style="" align="left">\n\
							<input type="hidden" id="id_right_' + q + '" name="ids_right[]" value="' + data[6][q] + '"/>\n\
							<div style="width: 120px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;">\n\
								<input type="text" id="answer_right_' + q + '" name="answers_right[]" style="width: 100%; margin-right: 15px; margin-top: 12px;" value="' + odp + '"/>\n\
							</div>\n\
						</td><td width="50px" align="center">\n\
							<input id="fixed_right_' + q + '" type="checkbox" name="fixed_right[]" style="margin: 0; padding: 0;" ' + fixed + '/>\n\
						</td><td width="70px">\n\
							<input type="checkbox" id="switch_image_text_chbx" name="switch_image_text_chbx" onclick="switch_text_images(this, false);" />\n\
						</td><td width="70px">\n\
							<input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" />\n\
						</td></tr></table>';
					document.getElementById('right_container').appendChild(newDiv);
				}
			}
		
		} else {
		
			var newSetRight = new Array;
			
			var randid = Math.random();
			randid = String(randid);
			var rg = new RegExp('0.([0-9]*)',"gi");
			exec = rg.exec(randid);
			var id_0 = 'id_' + exec[1];
			newSetRight.push(id_0);
			
			var randid = Math.random();
			randid = String(randid);
			var rg = new RegExp('0.([0-9]*)',"gi");
			exec = rg.exec(randid);
			var id_1 = 'id_' + exec[1];
			newSetRight.push(id_1);
			
			var newDiv = document.createElement('div');
			newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
			newDiv.setAttribute('id', id_0);
			newDiv.innerHTML = '<table cellpadding=0 cellspacing=0>\n\
				<tr><td width="200px" style="" align="left">\n\
					<input type="hidden" id="id_right_0" name="ids_right[]" value="' + id_0 + '"/>\n\
					<div style="width: 120px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;">\n\
						<input type="text" id="answer_right_0" name="answers_right[]" style="width: 100%; margin-right: 15px; margin-top: 12px;" value=""/>\n\
					</div>\n\
				</td><td width="50px" align="center">\n\
					<input id="fixed_right_0" type="checkbox" name="fixed_right[]" style="margin: 0; padding: 0;"/>\n\
				</td><td width="70px">\n\
					<input type="checkbox" id="switch_image_text_chbx" name="switch_image_text_chbx" onclick="switch_text_images(this, false);" />\n\
				</td><td width="70px">\n\
					<input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" />\n\
				</td></tr></table>';
			document.getElementById('right_container').appendChild(newDiv);
			
			var newDiv = document.createElement('div');
			newDiv.setAttribute('style', 'width: 100%; margin: 3px;');
			newDiv.setAttribute('id', id_1);
			newDiv.innerHTML = '<table cellpadding=0 cellspacing=0>\n\
				<tr><td width="200px" style="" align="left">\n\
					<input type="hidden" id="id_right_1" name="ids_right[]" value="' + id_1 + '"/>\n\
					<div style="width: 120px; height: 40px; cursor: pointer; border: 1px solid #b0b0b0;">\n\
						<input type="text" id="answer_right_1" name="answers_right[]" style="width: 100%; margin-right: 15px; margin-top: 12px;" value=""/>\n\
					</div>\n\
				</td><td width="50px" align="center">\n\
					<input id="fixed_right_1" type="checkbox" name="fixed_right[]" style="margin: 0; padding: 0;"/>\n\
				</td><td width="70px">\n\
					<input type="checkbox" id="switch_image_text_chbx" name="switch_image_text_chbx" onclick="switch_text_images(this, false);" />\n\
				</td><td width="70px">\n\
					<input type="button" id="remove_answer" name="remove_answer" value="Remove" onclick="remove_answer_row(this);" />\n\
				</td></tr></table>';
			document.getElementById('right_container').appendChild(newDiv);
			
		}
		
		matchDialog.setCanvas();
		
		matchDialog.resizeCanvas(f.images.checked, maxElementCount);
		
		if(data != undefined) {
			matchDialog.setElementFields(data[4],data[6], f.images.checked);
		} else {
			matchDialog.setElementFields(newSetLeft,newSetRight, f.images.checked);
		}
		
		// connections
		if(data != undefined && data[9].length > 0) {
			
			var pair = new Array;
			var pairs = data[9];
			var leftElements = data[4];
			var rightElements = data[6];
			
			for(p in pairs) {
				
				pair = pairs[p].split(' ');
				$('#middle_container').append('<input id="' + pairs[p] + '" type="hidden" name="pair[]" value="' + pairs[p] + '">');
				indexOfLeft = leftElements.indexOf(pair[0]);
				indexOfRight = rightElements.indexOf(pair[1]);
				this.drawConnectionLine(indexOfLeft, indexOfRight, pairs[p], f.images.checked);
				
			}
			
		}
		
		// adding new match section
		if(data == undefined) {
			
			$('form').append('<input type="hidden" name="addnew" value="1">');
			
			var removeButton = document.getElementById('remove_button');
			removeButton.parentNode.removeChild(removeButton);
			
			var insertButton = document.getElementById('insert');
			insertButton.setAttribute('value', 'Insert');
			
			//var feedbacksButton = document.getElementById('feedbacks_button');
			//feedbacksButton.parentNode.removeChild(feedbacksButton);
		
		}
		
	},
	
	// setting canvas objects
	setCanvas : function() {
		
		document.onmousemove = matchDialog.getMousePos;
		canvas = document.getElementById("canvas");
		canvas_temp = document.getElementById("canvas_temp");
		ctx = canvas.getContext("2d");
		ctx_temp = canvas_temp.getContext("2d");

	},
	
	// resizing canvas
	resizeCanvas : function(images, maxElementCount) {
		
		//if(images) {
			matchDialog.canvasHeight = matchDialog.imagesElementHeight * maxElementCount;
		//} else {
		//	matchDialog.canvasHeight = matchDialog.textElementHeight * maxElementCount;
		//}
		
		document.getElementById('canvas').setAttribute('height', String(matchDialog.canvasHeight) + 'px');
		document.getElementById('canvas_temp').setAttribute('height', String(matchDialog.canvasHeight) + 'px');
		
	},
	
	// setting element fields
	setElementFields : function(leftElements, rightElements, images) {
		
		matchDialog.leftCoordinates = new Array;
		matchDialog.rightCoordinates = new Array;
		
		for (el in leftElements) {
			ctx.fillStyle = 'green';
			ctx.beginPath();
			if(images) {
				ctx.fillRect(0, (el * matchDialog.imagesElementHeight) + 20,10,10);
				matchDialog.leftCoordinates.push( {min: (el * matchDialog.imagesElementHeight)+20, max: (el * matchDialog.imagesElementHeight) + 20 + 10, middle: (el * matchDialog.imagesElementHeight) + 20 + 5} );
			} else {
				ctx.fillRect(0, (el * matchDialog.textElementHeight) + 20,10,10);
				matchDialog.leftCoordinates.push( {min: (el * matchDialog.textElementHeight) + 20, max: (el * matchDialog.textElementHeight) + 20 + 10, middle: (el * matchDialog.textElementHeight) + 20 + 5} );
			}
			ctx.stroke();
		}
		
		for (el in rightElements) {
			ctx.fillStyle = 'green';
			ctx.beginPath();
			if(images) {
				ctx.fillRect(190, (el * matchDialog.imagesElementHeight) + 20,10,10);
				matchDialog.rightCoordinates.push( {min: (el * matchDialog.imagesElementHeight) + 20, max: (el * matchDialog.imagesElementHeight) + 20 + 10, middle: (el * matchDialog.imagesElementHeight) + 20 + 5} );
			} else {
				ctx.fillRect(190, (el * matchDialog.textElementHeight) + 20,10,10);
				matchDialog.rightCoordinates.push( {min: (el * matchDialog.textElementHeight) + 20, max: (el * matchDialog.textElementHeight) + 20 + 10, middle: (el * matchDialog.textElementHeight) + 20 + 5} );
			}
			ctx.stroke();
		}
		
	},
	
	drawConnectionLine : function(indexOfLeft,indexOfRight, identifier, images) {
		
		y0 = matchDialog.leftCoordinates[indexOfLeft].middle;
		y1 = matchDialog.rightCoordinates[indexOfRight].middle;
		
		ctx.lineWidth = '2'; 
		ctx.strokeStyle = "#2b6fb6";
		ctx.lineCap = 'round';
	
		ctx.beginPath();
		ctx.moveTo(10, y0);
		ctx.lineTo(190,y1);
		ctx.stroke();
		
	},
	
	remakeConnectionLines : function(images) {
		
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
			
			matchDialog.drawConnectionLine(leftIndexes.indexOf(elements[0]), rightIndexes.indexOf(elements[1]), pair, images);
			
		});
		
	},
	
	checkLeftCoordinates : function (coord) {
		
		for (i in matchDialog.leftCoordinates) {
			if(coord > matchDialog.leftCoordinates[i].min && coord < matchDialog.leftCoordinates[i].max) {
				return true;
			}
		}
		return false;
		
	},

	checkRightCoordinates : function(coord) {
		
		for (i in matchDialog.rightCoordinates) {
			if(coord > matchDialog.rightCoordinates[i].min && coord < matchDialog.rightCoordinates[i].max) {
				return true;
			}
		}
		return false;
		
	},
	
	getMousePos : function(e) {
		
		var canvas = $('#canvas');
		var cpn = canvas.parent().get(0);
		if((matchDialog.mDownX > 0 && matchDialog.mDownX < 10) && matchDialog.checkLeftCoordinates(matchDialog.mDownY) || 
			(matchDialog.mDownX > 190 && matchDialog.mDownX < 200) && matchDialog.checkRightCoordinates(matchDialog.mDownY)) {
			matchDialog.drawTempLine(matchDialog.mDownX,matchDialog.mDownY,matchDialog.mouseX,matchDialog.mouseY);
		}
		matchDialog.mouseX = e.clientX - cpn.offsetLeft;
		matchDialog.mouseY = e.clientY - cpn.offsetTop;
		
	},
	
	mouseDown : function() {
		
		matchDialog.mDownX = matchDialog.mouseX;
		matchDialog.mDownY = matchDialog.mouseY;
		
	},

	mouseUp : function() {
		
		if(matchDialog.mouseX == matchDialog.mDownX && matchDialog.mouseY == matchDialog.mDownY) {
			
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
			
			existingConnections.each(function(c) {
				var pairId = existingConnections[c].getAttribute('id');
				var pair = pairId.split(' ');
				
				var leftPos = leftEl.indexOf(pair[0]);
				var rightPos = rightEl.indexOf(pair[1]);;
				
				ctx_temp.fillStyle = '#ff0000';
				ctx_temp.beginPath();
				ctx_temp.moveTo(10, matchDialog.leftCoordinates[leftPos].middle - 2);
				ctx_temp.lineTo(10, matchDialog.leftCoordinates[leftPos].middle + 2);
				ctx_temp.lineTo(190,matchDialog.rightCoordinates[rightPos].middle + 2);
				ctx_temp.lineTo(190,matchDialog.rightCoordinates[rightPos].middle - 2);
				ctx_temp.closePath();
				ctx_temp.fill();
				
				if(ctx_temp.isPointInPath(matchDialog.mouseX, matchDialog.mouseY)) {
					//if(confirm('Remove this connection?')) {
						$('#middle_container > input[id=\'' + pairId + '\']').remove();
						var images = $('#images');
						images = images[0].checked;
						ctx.clearRect(0,0,200,matchDialog.canvasHeight);
						matchDialog.setElementFields(leftEl,rightEl, images);
						matchDialog.remakeConnectionLines(images);
					//}
					ctx_temp.clearRect(0,0,200,matchDialog.canvasHeight);
					return;
				}
				
				ctx_temp.clearRect(0,0,200,matchDialog.canvasHeight);
				
			});
			
		} else {
			if(((matchDialog.mDownX > 0 && matchDialog.mDownX < 10) && matchDialog.checkLeftCoordinates(matchDialog.mDownY)) && ((matchDialog.mouseX > 190 && matchDialog.mouseX < 200) && matchDialog.checkRightCoordinates(matchDialog.mouseY))) {
				matchDialog.makeNewConnection(matchDialog.mDownX,matchDialog.mDownY,matchDialog.mouseX,matchDialog.mouseY);
			} else if(((matchDialog.mDownX > 190 && matchDialog.mDownX < 200) && matchDialog.checkRightCoordinates(matchDialog.mDownY)) && ((matchDialog.mouseX > 0 && matchDialog.mouseX < 10) && matchDialog.checkLeftCoordinates(matchDialog.mouseY))) {
				matchDialog.makeNewConnection(matchDialog.mouseX,matchDialog.mouseY,matchDialog.mDownX,matchDialog.mDownY);
			} else {
				ctx_temp.clearRect(0,0,200,matchDialog.canvasHeight);
			}
		}
		matchDialog.mDownX = 0;
		matchDialog.mDownY = 0;
		
	},
	
	makeNewConnection : function(x1, y1, x2, y2) { 
		
		ctx_temp.clearRect(0,0,200,matchDialog.canvasHeight);
		
		var images = $('#images');
		images = images[0].checked;
		
		if(images) {
			var posY1 = y1 - 20;
			posY1 = posY1/matchDialog.imagesElementHeight;
			posY1 = Math.floor(posY1);
			var posY2 = y2 - 20;
			posY2 = posY2/matchDialog.imagesElementHeight;
			posY2 = Math.floor(posY2);
		} else {
			var posY1 = y1 - 5;
			posY1 = posY1/matchDialog.textElementHeight;
			posY1 = Math.floor(posY1);
			var posY2 = y2 - 5;
			posY2 = posY2/matchDialog.textElementHeight;
			posY2 = Math.floor(posY2);
		}
		
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
			$('#middle_container').append('<input id="' + identifier + '" type="hidden" name="pair[]" value="' + identifier + '">');
			matchDialog.drawConnectionLine(posY1,posY2,identifier,images);
		}
		
	},

	drawTempLine : function (x1, y1, x2, y2) { 
		
		ctx_temp.clearRect(0,0,200,matchDialog.canvasHeight);
		
		ctx_temp.lineWidth = '2';
		ctx_temp.strokeStyle = "#2b6fb6";
		ctx_temp.lineCap = 'round';
		
		ctx_temp.beginPath();
		ctx_temp.moveTo(x1, y1);
		ctx_temp.lineTo(x2, y2);
		ctx_temp.stroke();
		
	},
	
	insertMatchSection : function(form) {
	
		var question = '';
		var identifier = '';
		var responseDeclaration = '';
		var shuffle = '';
		var multiple = '';
		var images = '';
		var answers_left = new Array();
		var answers_right = new Array();
		var points = new Array();
		var ids_left = new Array();
		var ids_right = new Array();
		var fixed_left = new Array();
		var fixed_right = new Array();
		var elements = form.elements;
		var pairs = new Array;
		var i = 0;
		var adding = 0;
		var skip_point = 0;
		
		while(elements[i] != undefined) {
			var element = elements[i];
			
			if(element.getAttribute('name') == 'pair[]') {
				pairs.push(element.value);
			}
			if(element.getAttribute('name') == 'question') {
				question = element.value;
			}
			if(element.getAttribute('name') == 'identifier') {
				identifier = element.value;
			}
			if(element.getAttribute('name') == 'shuffle') {
				shuffle = element.checked;
			}
//			if(element.getAttribute('name') == 'images') {
//				images = element.checked;
//			}
			if(element.getAttribute('name') == 'answers_left[]') {
				if(element.value != '') {
					if(images == true) {
						answers_left.push('<img src="' + element.value + '"/>');
					} else {
						answers_left.push(element.value);
					}
				} else {
					skip_point = 1;
				}
			}
			if(element.getAttribute('name') == 'answers_right[]') {
				if(element.value != '') {
					if(images == true) {
						answers_right.push('<img src="' + element.value + '"/>');
					} else {
						answers_right.push(element.value);
					}
				} else {
					skip_point = 1;
				}
			}
			if(element.getAttribute('name') == 'ids_left[]') {
				if(skip_point == 0) {
					ids_left.push(element.value);
				} else {
					skip_point = 0;
				}
			}
			if(element.getAttribute('name') == 'ids_right[]') {
				if(skip_point == 0) {
					ids_right.push(element.value);
				} else {
					skip_point = 0;
				}
			}
			if(element.getAttribute('name') == 'points[]') {
				if(skip_point == 0) {
					points.push(element.value);
				} else {
					skip_point = 0;
				}
			}
			if(element.getAttribute('name') == 'fixed_left[]') {
				if(skip_point == 0) {
					if(element.checked == true) {
						fixed_left.push(1);
					} else {
						fixed_left.push(0);
					}
				} else {
					skip_point = 0;
				}
			}
			if(element.getAttribute('name') == 'fixed_right[]') {
				if(skip_point == 0) {
					if(element.checked == true) {
						fixed_right.push(1);
					} else {
						fixed_right.push(0);
					}
				} else {
					skip_point = 0;
				}
			}
			if(element.getAttribute('name') == 'addnew' && element.getAttribute('value') == '1') {
				adding = 1;
			}
			i++;
		}
		
		if(question == '' 
			|| answers_left.length < 1 
			|| answers_left.length != ids_left.length 
			|| answers_right.length < 1 
			|| answers_right.length != ids_right.length) {
				return false;
		}
		
		// dodawanie nowego match
		if(adding == 1) {
			
			var matchSection = '<p>&nbsp;</p><!-- <matchInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '" maxAssociations="' + String(answers_left.length * answers_right.length) + '"> --><div id="matchInteraction" class="mceNonEditable" style="border: 1px solid blue; color: blue; padding: 5px; background-color: #f0f0f0;">';
			matchSection += '<p id="matchInteraction">' + question + '</p><table width="100%" border=0 style="border: none;"><tbody><tr valign="top" style="border: none;">';
			
			// rozpocz�cie lewego matchset
			matchSection += '<!-- <simpleMatchSet> --><td align="center" width="50%" style="border: none;"><table class="mceNonEditable" width="100%" border=0 style="border: none;"><tbody>';
			for(i in answers_left) {
				matchSection += '<!-- <simpleAssociableChoice identifier="' + ids_left[i] + '"';
				if(fixed_left[i] == 1) {
					var fx = 'true';
					matchSection += ' fixed="true" ';
				} else {
					var fx = 'false';
				}
				matchSection += ' matchMax="0">' + answers_left[i];
				if(tinyMCE.feedback != undefined && tinyMCE.feedback[identifier] != undefined && tinyMCE.feedback[identifier].text != undefined) {
					for(j in tinyMCE.feedback[identifier].text) {
						jArr = j.split(' ');
						if(jArr[0] == ids_left[i]) {
							matchSection += '<feedbackInline ';
							var found = false;
							for(x in pairs) {
								if(j == pairs[x]) {
									found = true;
								}
							}
							if(found == true) {
								matchSection += 'mark="CORRECT"';
							} else {
								matchSection += 'mark="WRONG"';
							}
							matchSection += ' senderIdentifier="^' + identifier + '$" outcomeIdentifier="' + identifier + '-LASTCHANGE" identifier="+' + j + '" showHide="show">' + tinyMCE.feedback[identifier].text[j] + '</feedbackInline>';
						}
					}
				} 
				matchSection += '</simpleAssociableChoice> --><tr style="border: none;"><td align="center" style="border: none;"><span id="span_identifier" style="display: none;">' + ids_left[i] + '</span><span id="span_fixed" style="display: none;">' + fx + '</span><span id="matchInteraction" style="border: 1px solid blue; color: blue;">';
				if(answers_left[i].match(/<img[^>]*\/>/i)) {
					var an = answers_left[i].replace(/([^<]*)<img([^>]*)\/>([^<]*)/i, '$1<img$2 height="16px"/>$3');
					matchSection += an + '</span></td></tr>';
				} else {
					matchSection += answers_left[i] + '</span></td></tr>';
				}
			}
			matchSection += '<!-- </simpleMatchSet> --></tbody></table></td>';
			matchSection += '<td id="canvas_td" width="200px" style="border: none;"><canvas id="canvas" width="200px" style="border: 1px solid blue;"></canvas></td>';
			// rozpoczecie prawego matchset
			matchSection += '<!-- <simpleMatchSet> --><td align="center" width="50%" style="border: none;"><table class="mceNonEditable" width="100%" border=0 style="border: none;"><tbody>';
			for(i in answers_right) {
				matchSection += '<!-- <simpleAssociableChoice identifier="' + ids_right[i] + '"';
				if(fixed_right[i] == 1) {
					var fx = 'true';
					matchSection += ' fixed="true" ';
				} else {
					var fx = 'false';
				}
				matchSection += ' matchMax="0">' + answers_right[i] + '</simpleAssociableChoice> --><tr style="border: none;"><td align="center" style="border: none;"><span id="span_identifier" style="display: none;">' + ids_right[i] + '</span><span id="span_fixed" style="display: none;">' + fx + '</span><span id="matchInteraction" style="border: 1px solid blue; color: blue;">';
				if(answers_right[i].match(/<img[^>]*\/>/i)) {
					var an = answers_right[i].replace(/([^<]*)<img([^>]*)\/>([^<]*)/i, '$1<img$2 height="16px"/>$3');
					matchSection += an + '</span></td></tr>';
				} else {
					matchSection += answers_right[i] + '</span></td></tr>';
				}
			}
			matchSection += '<!-- </simpleMatchSet> --></tbody></table></td>';
			
			matchSection += '</tr></tbody></table></div><!-- end of matchInteraction -->';
			matchSection += '<p>&nbsp;</p>';
			
			// tutaj osobno dodac sprawdzanie polaczen i tworzenie responseDeclaration
			responseDeclaration = '<!-- <responseDeclaration identifier="' + identifier + '" cardinality="multiple" baseType="directedPair"><correctResponse>';
			for(i in pairs) {
				responseDeclaration += '<value>' + pairs[i] + '</value>';
			}
			responseDeclaration += '</correctResponse><mapping defaultValue="0">';
			for(i in pairs) {
				responseDeclaration += '<mapEntry mapKey="' + pairs[i] + '" mappedValue="1" />';
			}
			responseDeclaration += '</mapping></responseDeclaration> -->';
						
			var ed = tinymce.EditorManager.activeEditor;
			var bm = ed.selection.getBookmark();
			ed.selection.moveToBookmark(bm);
			
			tinyMCE.execCommand('mceInsertContent', false, matchSection);
			
			body = ed.selection.getNode();
			while(body.nodeName != 'BODY') {
				body = body.parentNode;
			}
			regexp = new RegExp('(<!-- <itemBody> -->)','gi');
			body.innerHTML = body.innerHTML.replace(regexp, responseDeclaration + '$1');
			
			ed.selection.moveToBookmark(bm);
			
		// edycja istniej�cego match
		} else {
			
			var ed = tinymce.EditorManager.activeEditor;
			var nd = tinyMCE.selectedNode;
			var bm = ed.selection.getBookmark();
			var matchSection = '';
			
			while(nd.nodeName != 'DIV' || nd.id != 'matchInteraction') {
				nd = nd.parentNode;
			}
			
			if(nd.previousSibling.nodeName == "P") {
				var regexp = new RegExp('<!-- <matchInteraction responseIdentifier="' + identifier + '" shuffle="[^"]*" maxAssociations="[^"]*"> -->','gi');
				nd.previousSibling.innerHTML = nd.previousSibling.innerHTML.replace(regexp, '<!-- <matchInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '" maxAssociations="' + String(answers_left.length * answers_right.length) + '"> -->');
			} else {
				var regexp = new RegExp(' <matchInteraction responseIdentifier="' + identifier + '" shuffle="[^"]*" maxAssociations="[^"]*"> ','gi');
				nd.previousSibling.data = nd.previousSibling.data.replace(regexp, ' <matchInteraction responseIdentifier="' + identifier + '" shuffle="' + String(shuffle) + '" maxAssociations="' + String(answers_left.length * answers_right.length) + '"> ');
			}
			
			matchSection += '<p id="matchInteraction">' + question + '</p><table width="100%" border=0 style="border: none;"><tbody><tr valign="top" style="border: none;">';
			
			// rozpocz�cie lewego matchset
			matchSection += '<!-- <simpleMatchSet> --><td align="center" width="50%" style="border: none;"><table class="mceNonEditable" width="100%" border=0 style="border: none;"><tbody>';
			for(i in answers_left) {
				matchSection += '<!-- <simpleAssociableChoice identifier="' + ids_left[i] + '"';
				if(fixed_left[i] == 1) {
					var fx = 'true';
					matchSection += ' fixed="true" ';
				} else {
					var fx = 'false';
				}
				matchSection += ' matchMax="0">' + answers_left[i];
				if(tinyMCE.feedback != undefined && tinyMCE.feedback[identifier] != undefined && tinyMCE.feedback[identifier].text != undefined) {
					for(j in tinyMCE.feedback[identifier].text) {
						jArr = j.split(' ');
						if(jArr[0] == ids_left[i]) {
							matchSection += '<feedbackInline ';
							var found = false;
							for(x in pairs) {
								if(j == pairs[x]) {
									found = true;
								}
							}
							if(found == true) {
								matchSection += 'mark="CORRECT"';
							} else {
								matchSection += 'mark="WRONG"';
							}
							matchSection += ' senderIdentifier="^' + identifier + '$" outcomeIdentifier="' + identifier + '-LASTCHANGE" identifier="+' + j + '" showHide="show">' + tinyMCE.feedback[identifier].text[j] + '</feedbackInline>';
						}
					}
				} 
				matchSection += '</simpleAssociableChoice> --><tr style="border: none;"><td align="center" style="border: none;"><span id="span_identifier" style="display: none;">' + ids_left[i] + '</span><span id="span_fixed" style="display: none;">' + fx + '</span><span id="matchInteraction" style="border: 1px solid blue; color: blue;">';
				if(answers_left[i].match(/<img[^>]*\/>/i)) {
					var an = answers_left[i].replace(/([^<]*)<img([^>]*)\/>([^<]*)/i, '$1<img$2 height="16px"/>$3');
					matchSection += an + '</span></td></tr>';
				} else {
					matchSection += answers_left[i] + '</span></td></tr>';
				}
				
			}
			matchSection += '<!-- </simpleMatchSet> --></tbody></table></td>';
			matchSection += '<td id="canvas_td" width="200px" style="border: none;"><canvas id="canvas" width="200px" style="border: 1px solid blue;"></canvas></td>';
			// rozpoczecie prawego matchset
			matchSection += '<!-- <simpleMatchSet> --><td align="center" width="50%" style="border: none;"><table class="mceNonEditable" width="100%" border=0 style="border: none;"><tbody>';
			for(i in answers_right) {
				matchSection += '<!-- <simpleAssociableChoice identifier="' + ids_right[i] + '"';
				if(fixed_right[i] == 1) {
					var fx = 'true';
					matchSection += ' fixed="true" ';
				} else {
					var fx = 'false';
				}
				matchSection += ' matchMax="0">' + answers_right[i] + '</simpleAssociableChoice> --><tr style="border: none;"><td align="center" style="border: none;"><span id="span_identifier" style="display: none;">' + ids_right[i] + '</span><span id="span_fixed" style="display: none;">' + fx + '</span><span id="matchInteraction" style="border: 1px solid blue; color: blue;">';
				if(answers_right[i].match(/<img[^>]*\/>/i)) {
					var an = answers_right[i].replace(/([^<]*)<img([^>]*)\/>([^<]*)/i, '$1<img$2 height="16px"/>$3');
					matchSection += an + '</span></td></tr>';
				} else {
					matchSection += answers_right[i] + '</span></td></tr>';
				}
			}
			matchSection += '<!-- </simpleMatchSet> --></tbody></table></td>';
			
			nd.innerHTML = matchSection;
			
			responseDeclaration = '<correctResponse>';
			for(i in pairs) {
				responseDeclaration += '<value>' + pairs[i] + '</value>';
			}
			responseDeclaration += '</correctResponse><mapping defaultValue="0">';
			for(i in pairs) {
				responseDeclaration += '<mapEntry mapKey="' + pairs[i] + '" mappedValue="1" />';
			}
			responseDeclaration += '</mapping>';
			body = nd;
			while(body.nodeName != 'BODY') {
				body = body.parentNode;
			}
			regexp = new RegExp('(<!-- <responseDeclaration identifier="' + identifier + '"[^>]*>)[^<]*<correctResponse>[^<]*(?:[^<]*<value>[^<]*<\/value>[^<]*)*<\/correctResponse>[^<]*<mapping[^>]*>[^<]*(?:[^<]*<mapEntry[^>]*>[^<]*)*<\/mapping>[^<]*(<\/responseDeclaration> -->)','gi');
			body.innerHTML = body.innerHTML.replace(regexp, '$1' + responseDeclaration + '$2');
			
			ed.selection.moveToBookmark(bm);
			
		}
		
		if(tinyMCE.canvasParams[identifier] == undefined) {
			tinyMCE.canvasParams[identifier] = {maxElements: 2, connections: new Array};
		}
		tinyMCE.canvasParams[identifier].maxElements = answers_left.length;
		if(answers_right.length > answers_left.length) {
			tinyMCE.canvasParams[identifier].maxElements = answers_right.length;
		}
		tinyMCE.canvasParams[identifier].connections = new Array;
		for(i in pairs) {
			var pair = pairs[i].split(' ');
			tinyMCE.canvasParams[identifier].connections.push(String(ids_left.indexOf(pair[0]) + ' ' + ids_right.indexOf(pair[1])))
		}
		
		tinyMCE.activeEditor.dom.drawInCanvas();
		
		// Remove illegal text before headins
		var beforeHeadings = ed.selection.dom.doc.body.innerHTML.match(/(.*?)(?=<!-- \?xml)/);
		if(beforeHeadings != undefined && beforeHeadings[1] != '') {
			ed.selection.dom.doc.body.innerHTML = ed.selection.dom.doc.body.innerHTML.replace(/(.*?)(?=<!-- \?xml)/,'');
		}
		if(beforeHeadings && beforeHeadings[1] != '') {
			ed.selection.dom.doc.body.innerHTML = ed.selection.dom.doc.body.innerHTML.replace(/<itemBody> -->/,'<itemBody> -->' + beforeHeadings[1]);
		}
		
		if(tinyMCE.feedback != undefined) {
			
			var rg = new RegExp('<!-- <modalFeedback[^>]*senderIdentifier="' + identifier + '"[^>]*>[^<]*</modalFeedback> -->','gi');
			if(rg.exec(tinyMCE.activeEditor.dom.doc.body.innerHTML) != '') {
				tinyMCE.activeEditor.dom.doc.body.innerHTML = tinyMCE.activeEditor.dom.doc.body.innerHTML.replace(rg,'');
			}
			
			if(tinyMCE.feedback[identifier] != undefined) {
				
				var mf = '';
				for (i in tinyMCE.feedback[identifier].sound) {
					if(tinyMCE.feedback[identifier].sound[i] != '') {
						mf += '<!-- <modalFeedback senderIdentifier="' + identifier + '" identifier="' + i + '" showHide="show"';
						if(tinyMCE.feedback[identifier].sound[i] != undefined && tinyMCE.feedback[identifier].sound[i] != '') {
							mf += ' sound="' + tinyMCE.feedback[identifier].sound[i] + '"';
						}
						mf += '></modalFeedback> -->'
					}
				}
				tinyMCE.activeEditor.dom.doc.body.innerHTML = tinyMCE.activeEditor.dom.doc.body.innerHTML.replace(/(<!-- <\/itemBody> -->)/i, '$1' + mf);
				tinyMCE.feedback = new Array;
				
			}
			
		} 
		
		tinyMCEPopup.close();
		return true;
		
	}

};

tinyMCEPopup.onInit.add(matchDialog.init, matchDialog);

