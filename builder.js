var Builder = function() {
	var applyFunction = function() {
		var gridSize, tileSize;
		var currentFunction = $('.function.selected').attr('data-function');
		if(typeof currentFunction === 'undefined' || currentFunction === '') {
			return;
		}
		$(this).removeClass().addClass('tile').html('');
		switch(currentFunction) {
			case 'plus':
				$(this).addClass('plus').html('+');
				break;
			case 'minus':
				$(this).addClass('minus').html('-');
				break;
			case 'times':
				$(this).addClass('times').html('x');
				break;
			case 'player':
				$('.tile.player').removeClass('player').addClass('placeholder');
				$(this).addClass('player');
				break;
			case 'barrier':
				$(this).addClass('barrier');
				break;
			case 'target':
				$(this).addClass('target');
				$(this).html('<input type="text" value="1"></input>');
				disableFunction();
				break;
			case 'number':
				$(this).addClass('number');
				$(this).html('<input type="text" value="1"></input>');
				disableFunction();
				break;
			case 'delete':
				$(this).addClass('placeholder');
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
	init = function() {
		$('#resize').click(function() {
			resizeGrid($('[name=size]').val());
		});
		$('.function').click(switchFunction);
		resizeGrid(10);
	};
	init();
},

builder;
$(function() { builder = new Builder(); });
