var JAG = {};

JAG.SnowMachine = function(){
	var self = this;

	self.canvasStyle = "position:absolute;top:0;bottom:0;left:0;right:0;z-index:99999;pointer-events:none;";
	
	self.canvasElement = null;
	self.canvasContext = null;	
	
	self.numberOfSnowFlakes = 200;
	self.updateRate = 30;
	self.snowFlakes = [];
	
	self.drawSnowFlakes = function(){
		self.canvasContext.clearRect(0, 0, self.canvasContext.canvas.width, self.canvasContext.canvas.height);
		self.snowFlakes.forEach(function(snowFlake){						
			snowFlake.draw.call(self.canvasContext);
			snowFlake.nextMove();
		});
	};
	
	self.start = function(){
				
		var canvasElement = document.createElement("canvas");
		canvasElement.style = self.canvasStyle;
		self.canvasElement = canvasElement;		
		
		self.canvasContext = self.canvasElement.getContext("2d");
		
		self.canvasContext.canvas.width  = document.body.clientWidth;
		self.canvasContext.canvas.height = document.body.clientHeight;	
		document.body.appendChild(self.canvasElement);		
		
		for(var i = 0; i !== self.numberOfSnowFlakes; i++){		
			var snowFlake = new JAG.SnowFlake(self.canvasContext);
			self.snowFlakes.push(snowFlake);
		}
		
		setInterval(self.drawSnowFlakes, self.updateRate);
	};	

	return self;
};

JAG.SnowFlake = function(canvasContext){
	var self = this;
	
	self.x = JAG.Helper.GetRandomNumber(0, canvasContext.canvas.width);
	self.y = JAG.Helper.GetRandomNumber(0, canvasContext.canvas.height) * -1;		
	
	self.draw = function(){
		var ctx = this;
		ctx.beginPath();
		ctx.moveTo(self.x, self.y);		
		var x = self.x;
		var y = self.y;		
		x = x + 4;
		y = y + 4;
		ctx.lineTo(x, y);		
		x = x  - 2;
		y = y - 2;
		ctx.lineTo(x, y);		
		x = x - 2;
		y = y + 2;
		ctx.lineTo(x, y);		
		x = x + 4;
		y = y - 4;
		ctx.lineTo(x, y);
		ctx.strokeStyle = "#FFFFFF";
		ctx.stroke();
	};
	
	self.nextMove = function(){
		
		if(self.y >= canvasContext.canvas.height){
			self.y = 0;
		}else{
			self.y = self.y + ((Math.random() * 1) + 0.4);
		}
				
		var move = JAG.Helper.GetRandomNumber(0,5);
		
		if(move === 0){
			self.x = self.x + (Math.random() * 0.8);
		}
		else if (move === 1){
			self.x = self.x - (Math.random() * 0.8);
		}
	};
	
	return self;
};

JAG.Helper = {
	GetRandomNumber: function(from, to){
		return Math.floor(Math.random() * to) + from;
	}	
};

new JAG.SnowMachine().start();