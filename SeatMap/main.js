var SeatMap = function(){
	var self = this;
	var canvas = document.getElementById("seatMap");	
	var ctx = canvas.getContext("2d");
	var priv = {}
	
	priv.seats = [];
	
	self.draw = function(){
		priv.seats.forEach(function(seat) {
			seat.draw(ctx);
		}, this);		
	};	
	
	self.init = function() {		
		priv.seats.push(new Seat({ x: 0, y: 0, SeatNumber: "13A"}));
		priv.seats.push(new Seat({ x: 50, y: 0, SeatNumber: "13B"}));
		priv.seats.push(new Seat({ x: 100, y: 0, SeatNumber: "13C"}));

		self.draw();
	};
	
	return self;
};

var Seat = function(data){
	var self = this;

	self.x = data.x;
	self.y = data.y;
	self.SeatNumber = data.SeatNumber;

	self.draw = function(ctx){
		ctx.rect(self.x, self.y, 50, 50);
		ctx.stroke();
		ctx.fillText(self.SeatNumber, self.x + 25, self.y + 25);
	};

	return self;
};

new SeatMap().init();