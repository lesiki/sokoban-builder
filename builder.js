var Builder = function() {
	var applyFunction = function(x,y,func,numericValue) {
		var gridSize, tileSize;
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
	resizeGrid = function(newSize) {
		var grid = $('#grid-wrap');
		var x=0, y=0;
		gridSize = newSize;
		tileSize = grid.width() / gridSize;
		grid.html('');
		for(y=0; y < gridSize; y++) {
			for(x=0; x < gridSize; x++) {
				grid.append('<div data-x="' + x + '" data-y="' + y + '" class="tile placeholder" style="width: ' + tileSize + 'px; height: ' + tileSize + 'px; font-size: ' + tileSize * 0.7 + 'px; line-height: ' + tileSize * 0.8 +  'px;"></div>');
			}
		}
		$('div.tile').click(applyFunction);
	},
	layout = function(tileLayout) {
		var functionToApply, character, numericValue;
		for(y=0; y < gridSize; y++) {
			for(x=0; x < gridSize; x++) {
				character = tileLayout[y][x];
				if(character === 'x') {
					functionToApply = 'barrier';
				}
				else if(character === 'p') {
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
				else if(character === '0') {
					functionToApply = undefined;
				}
				applyFunction(x, y, functionToApply, numericValue);
			}
		}
	},
	init = function(initGridSize, tileLayout) {
		$('#resize').click(function() {
			resizeGrid($('[name=size]').val());
		});
		$('.function').click(switchFunction);
		resizeGrid(initGridSize || 10);
		if(tileLayout !== undefined) {
			layout(tileLayout);
		}
	};
	init(4, [['x', 'x', 'x', 'x'], ['p', 'x', 'x', 'x',], ['x', '3', '2', 'x'], ['x', 'x', '+', 'e']]);
},

builder;
$(function() { builder = new Builder(); });
