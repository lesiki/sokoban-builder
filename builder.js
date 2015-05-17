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
		tileSize = (grid.width() / gridSize) - 1;
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
	generatePlayerModel = function() {
		var model = [];
		var x, y;
		for(y=0; y < gridSize; y++) {
			var row = [];
			for(x=0; x < gridSize; x++) {
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
					symbol = String.fromCharCode(96 + parseInt(val));
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
		console.log(JSON.stringify(model));
		var url = window.location.protocol
			+ "//"
			+ window.location.host
			+ window.location.pathname
			+ '?g=' + encodeURIComponent(JSON.stringify(model));
		history.pushState({dummy: true}, jQuery(document).find('title').text(), + url);
	},
	init = function(tileLayout) {
		$('#resize').click(function() {
			resizeGrid($('[name=size]').val());
		});
		$('.function').click(switchFunction);
		$('#save').click(generatePlayerModel);
		if(tileLayout !== undefined) {
			resizeGrid(tileLayout.length);
			layout(tileLayout);
		}
		else {
			resizeGrid(8);
		}
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
