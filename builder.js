var Builder = function() {
	var applyFunction = function() {

	},
	resizeGrid = function(gridSize) {
		var grid = $('#grid-wrap');
		var tileSize = grid.width() / gridSize;
		grid.html('');
		var x=0, y=0;
		for(y=0; y < gridSize; y++) {
			for(x=0; x < gridSize; x++) {
				grid.append('<div data-x="' + x + '" data-y="' + y + '" class="tile placeholder" style="width: ' + tileSize + 'px; height: ' + tileSize + 'px;"></div>');
			}
		}
	},
	init = function() {
		$('#resize').click(function() {
			resizeGrid($('[name=size]').val());
		});
	};
	init();
},

builder;
$(function() { builder = new Builder(); });
