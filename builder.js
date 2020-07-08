var Builder = function() {
	var applyFunction = function(x,y,func,numericValue) {
		var gridWidth, gridHeight, tileSize;
		var levelModelJson;
		var currentFunction = func || $('.function.selected').attr('data-function');
		if(typeof currentFunction === 'undefined' || currentFunction === '') {
			return;
		}
		var target = $(this).hasClass('tile') ? $(this) : $('[data-x=' + x + '][data-y=' + y + ']');
		target.removeClass().addClass('tile').html('');
		switch(currentFunction) {
			case 'plus':
				target.addClass('plus').html('+');
				break;
			case 'minus':
				target.addClass('minus').html('-');
				break;
			case 'times':
				target.addClass('times').html('x');
				break;
			case 'player':
				$('.tile.player').removeClass('player').addClass('placeholder');
				target.addClass('player');
				break;
			case 'barrier':
				target.addClass('barrier');
				break;
			case 'target':
				target.addClass('target');
				target.html('<input type="text" value="' + (numericValue || 1) + '"></input>');
				disableFunction();
				break;
			case 'number':
				target.addClass('number');
				target.html('<input type="text" value="' + (numericValue || 1) + '"></input>');
				disableFunction();
				break;
			case 'delete':
				target.addClass('placeholder');
				break;
		}
	},
	switchFunction = function() {
		var previous = $('.function.selected');
		previous.removeClass('selected');
		if(previous.attr('data-function') != $(this).attr('data-function')) {
			$(this).addClass('selected');
		}
	},
	disableFunction = function() {
		$('.function.selected').removeClass('selected');
	},
	resizeGrid = function(newWidth, newHeight) {
		var grid = $('#grid-wrap');
		var x=0, y=0;
		gridWidth = newWidth;
		gridHeight = newHeight;
		tileSize = (grid.width() / gridWidth) - 1;
		grid.html('');
		for(y=0; y < gridHeight; y++) {
			for(x=0; x < gridWidth; x++) {
				grid.append('<div data-x="' + x + '" data-y="' + y + '" class="tile placeholder" style="width: ' + tileSize + 'px; height: ' + tileSize + 'px; font-size: ' + tileSize * 0.7 + 'px; line-height: ' + tileSize * 0.8 +  'px;"></div>');
			}
		}
		$('div.tile').click(applyFunction);
	},
	layout = function(tileLayout) {
		var functionToApply, character, numericValue;
		for(y=0; y < gridHeight; y++) {
			for(x=0; x < gridWidth; x++) {
				character = tileLayout[y][x];
				if(character === '#') {
					functionToApply = 'barrier';
				}
				else if(character === '$') {
					functionToApply = 'player';
				}
				else if(character === '+') {
					functionToApply = 'plus';
				}
				else if(character === '-') {
					functionToApply = 'minus';
				}
				else if(character === '*') {
					functionToApply = 'times';
				}
				else if(!isNaN(parseInt(character))) {
					functionToApply = 'number';
					numericValue = parseInt(character);
				}
				else if(character >= 'a' && character <= 'z') {
					functionToApply = 'target';
					numericValue = character.charCodeAt(0) - 96; // a-> 1, b -> 2 etc
				}
				else if(character === ' ') {
					functionToApply = undefined;
				}
				applyFunction(x, y, functionToApply, numericValue);
			}
		}
	},
	getURLParameter = function(name) {
		  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	},
	exportAndroidJson = function() {
		var model = {
			width: gridWidth,
			height: gridHeight,
			blocks: []
		};
		var x, y;
		for(y=0; y < gridHeight; y++) {
			var row = [];
			for(x=0; x < gridWidth; x++) {
				var classes = $('[data-x=' + x + '][data-y=' + y + ']').attr('class');
				var value = $('[data-x=' + x + '][data-y=' + y + '] input').val();
				if(classes.indexOf('plus') >= 0) {
					model.blocks.push({
						type: "PLUS",
						x: x,
						y: y
					})
				}
				else if(classes.indexOf('minus') >= 0) {
					model.blocks.push({
						type: "MINUS",
						x: x,
						y: y
					})
				}
				else if(classes.indexOf('times') >= 0) {
					model.blocks.push({
						type: "TIMES",
						x: x,
						y: y
					})
				}
				else if(classes.indexOf('player') >= 0) {
					model.blocks.push({
						type: "DYLAN",
						x: x,
						y: y
					})
				}
				else if(classes.indexOf('barrier') >= 0) {
					model.blocks.push({
						type: "DEAD",
						x: x,
						y: y
					})
				}
				else if(classes.indexOf('target') >= 0) {
					model.blocks.push({
						type: "TARGET",
						x: x,
						y: y,
						value: parseInt(value)
					})
				}
				else if(classes.indexOf('number') >= 0) {
					model.blocks.push({
						type: "NUMBER",
						x: x,
						y: y,
						value: parseInt(value)
					})
				}
			}
		}
		$('#android-json').remove();
		$('#controls-wrap').append('<textarea id="android-json"></textarea>');
		$('#android-json').text(JSON.stringify(model));
	},
	generatePlayerModel = function() {
		var model = [];
		var x, y;
		for(y=0; y < gridHeight; y++) {
			var row = [];
			for(x=0; x < gridWidth; x++) {
				console.log(x + "," + y);
				var classes = $('[data-x=' + x + '][data-y=' + y + ']').attr('class');
				var value = $('[data-x=' + x + '][data-y=' + y + '] input').val();
				var symbol;
				if(classes.indexOf('plus') >= 0) {
					symbol = '+';
				}
				else if(classes.indexOf('minus') >= 0) {
					symbol = '-';
				}
				else if(classes.indexOf('times') >= 0) {
					symbol = '*';
				}
				else if(classes.indexOf('player') >= 0) {
					symbol = '$';
				}
				else if(classes.indexOf('barrier') >= 0) {
					symbol = '#';
				}
				else if(classes.indexOf('target') >= 0) {
					symbol = String.fromCharCode(96 + parseInt(value));
				}
				else if(classes.indexOf('number') >= 0) {
					symbol = value;
				}
				else {
					symbol = ' ';
				}
				row.push(symbol);
			}
			model.push(row);
		}
		levelModelJson = JSON.stringify(model);
		var url = window.location.protocol
			+ "//"
			+ window.location.host
			+ window.location.pathname
			+ '?g=' + encodeURIComponent(levelModelJson);
		history.pushState({dummy: true}, jQuery(document).find('title').text(), url);
	},
	launchPlayer = function() {
		generatePlayerModel();
		$(this).attr('href', 'http://sitati.dev/maths-sokoban/?g=' + encodeURIComponent(levelModelJson));
	},
	init = function(tileLayout) {
		$('#resize').click(function() {
			resizeGrid($('[name=width]').val(), $('[name=height]').val());
			var url = window.location.protocol
				+ "//"
				+ window.location.host
				+ window.location.pathname;
			history.pushState({dummy: true}, jQuery(document).find('title').text(), url);
		});
		$('.function').click(switchFunction);
		$('#save').click(generatePlayerModel);
		$('#export').click(exportAndroidJson);
		$('#test').click(launchPlayer);
		if(tileLayout !== undefined) {
			resizeGrid(tileLayout.length, tileLayout.length);
			layout(tileLayout);
		}
		else {
			resizeGrid(10, 10);
		}
		$(document).keyup(function(evt) {
			if(evt.keyCode === 74) {
				toAndroidJson();
			}
		});
	},
	toAndroidJson = function() {
		var model = {
			"width": gridWidth,
			"height": gridHeight,
			"blocks": []
		};
		for(y=0; y < gridHeight; y++) {
			for(x=0; x < gridWidth; x++) {
				var block = $('[data-x=' + x + '][data-y=' + y + ']');
				var gridElement = { "x": x, "y": (gridHeight - 1) - y };
				if(block.hasClass('plus')) {
					gridElement.type = 'PLUS';
				}
				else if(block.hasClass('minus')) {
					gridElement.type = 'MINUS';
				}
				else if(block.hasClass('times')) {
					gridElement.type = 'TIMES';
				}
				else if(block.hasClass('number')) {
					gridElement.type = 'NUMBER';
					gridElement.value = parseInt($(block).find('input').val());
				}
				else if(block.hasClass('target')) {
					gridElement.type = 'TARGET';
					gridElement.value = parseInt($(block).find('input').val());
				}
				else if(block.hasClass('barrier')) {
					gridElement.type = 'DEAD';
				}
				else if(block.hasClass('player')) {
					gridElement.type = 'DYLAN';
				}
				if(!block.hasClass('placeholder')) {
					model.blocks.push(gridElement);
				}
			}
		}
		console.log(JSON.stringify(model));
		$('#androidJsonTarget').html(JSON.stringify(model)).show().focus().select();
	};
	var grid = getURLParameter('g');
	if(grid === null) {
		init();
	}
	else {
		grid = JSON.parse(grid);
		init(grid);
	}
},

builder;
$(function() { builder = new Builder(); });
