var NumberAllowedHorizontal = function(randomNumber){
	console.log(randomNumber);
	
	viewModel.cells.indexOf()
	
};

var getBoxNumber = function(column, row){
	if(column <= 3 && row <= 3)
		return 1;
	if(column <= 6 && row <= 3)
		return 2;
	if(column <= 9 && row <= 3)
		return 3;
	if(column <= 3 && row <= 6)
		return 4;
	if(column <= 6 && row <= 6)
		return 5;
	if(column <= 9 && row <= 6)
		return 6;
	if(column <= 3 && row <= 9)
		return 7;
	if(column <= 6 && row <= 9)
		return 8;
	if(column <= 9 && row <= 9)
		return 9;
};

var cells = [];
			

for (var col = 0; col < 9; col++){
	for (var row = 0; row < 9; row++){
		cells.push({
			column: col,
			row: row,
			box: getBoxNumber(col, row),
			'number': ((col*3 + Math.floor(col/3) + row) % 9 + 1)
		});
	}				
}

for(var i = 0; i < 42; i++) {
	var n1 = Math.ceil(Math.random() * 9);
	var n2;
	do {
		n2 = Math.ceil(Math.random() * 9);
	}
	while(n1 == n2);
    
	for(var row = 0; row < 9; row++) {
		for(var col = 0; col < 9; col++) {
			if(cells[row * 9 + col]["number"] == n1)
				cells[row * 9 + col]["number"] = n2;
			else if(cells[row * 9 + col]["number"] == n2)
				cells[row * 9 + col]["number"] = n1;
		}
	}
}

var viewModel = {
	cells: ko.observableArray(cells)
};

var numberIsNotAllowed = function(rowNumber, columnNumber, boxNumber, cellNumber){
	var items = ko.utils.arrayFilter(viewModel.cells(), function (c) {
		return (c.box === boxNumber || c.row === rowNumber || c.column === columnNumber) && cellNumber === c.number;
	});
	return items.length > 0;
};		

ko.applyBindings(viewModel, document.getElementById("suduko-wrapper"));