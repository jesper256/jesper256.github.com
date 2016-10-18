window.ViewModel = {
	MusicGrid:{
		ActiveSoundsCells: [],
		Sounds: [],
		CanvasWidth: 1000,
		CanvasHeight: 700,
		CanvasElement: document.getElementById("music-grid-canvas"),
		CanvasContext: document.getElementById("music-grid-canvas").getContext("2d"),
		LoadSounds: function(){
			var _sounds = [];
			
			var mp3s = ["BD0000.mp3","BD0010.mp3","CB.mp3","CL.mp3","CP.mp3","CY0000.mp3","CY0010.mp3","MA.mp3","OH00.mp3","OH10.mp3","OH25.mp3","RS.mp3","SD0000.mp3","SD0010.mp3","SD0025.mp3","SD0050.mp3"];
			
			for(var i = 0; i != mp3s.length; i++){
				var sound = new Sound(i);
				sound.Audio.src = "Sounds/" + mp3s[i];	
				_sounds.push(sound);	
			}
			
			for(var i = 0; i != mp3s.length; i++){
				var sound = new Sound(i + 16);
				sound.Audio.src = "Sounds/" + mp3s[i];	
				_sounds.push(sound);	
			}
			
			ViewModel.MusicGrid.Sounds = _sounds;
			ViewModel.MusicGrid.ActiveSoundsCells = [];
			ViewModel.MusicGrid.Draw();
		},
		Draw: function(){
			for(var soundIndex = 0; soundIndex != this.Sounds.length; soundIndex++){
				for(var cellIndex = 0; cellIndex != this.Sounds[soundIndex].Cells.length; cellIndex++){		
					var cell = this.Sounds[soundIndex].Cells[cellIndex];
					cell.Draw();
				}	
			}
		},
		GetCellFromPosition: function(xPos, yPos){
			
			for(var soundIndex = 0; soundIndex != this.Sounds.length; soundIndex++){
				for(var cellIndex = 0; cellIndex != this.Sounds[soundIndex].Cells.length; cellIndex++){
					var cell = this.Sounds[soundIndex].Cells[cellIndex];
					if(cell.PositionX <= xPos && (cell.PositionX + cell.Width) >= xPos && cell.PositionY <= yPos && (cell.PositionY + cell.Height) >= yPos)
						return cell;
					
					if(cell.PositionX === xPos && yPos === undefined)
						return cell;
				}
			}
			
			return null;
		},
		GetActiveSoundCellsFromStartPosition: function(startPosition){
			var cells = [];
			
			for(var cellIndex = 0; cellIndex != this.ActiveSoundsCells.length; cellIndex++){
				var cell = this.ActiveSoundsCells[cellIndex];
				if(cell.PositionX === startPosition)
					cells.push(cell);
			}
					
			return cells;
		},
		MoveBoard: function(scrollUp){
			ViewModel.MusicGrid.ClearCanvas();
			$.each(ViewModel.MusicGrid.Sounds, function(index, sound){
				$.each(sound.Cells, function(index, cell){
					if(scrollUp){
						cell.PositionX = cell.PositionX + cell.Width;
					}
					else{
						cell.PositionX = cell.PositionX - cell.Width;
					}
					
					//console.log(cell.PositionX);
					cell.Draw();
				});
			});
			
		},
		ClearCanvas: function(){
			ViewModel.MusicGrid.CanvasContext.clearRect(0, 0, ViewModel.MusicGrid.CanvasElement.width, ViewModel.MusicGrid.CanvasElement.height);
		}
	},	
	Controls: {
		Play: function(){
			ViewModel.Player.Play();
		},
		Stop: function(){
			ViewModel.Player.Stop();
		},
		Reset: function(){
			ViewModel.MusicGrid.LoadSounds();
		}
	},
	Player: {
		CurrentPosition: ko.observable(0),
		Playing: ko.observable(false),
		PlayingId: 0,
		Speed: 1,
		Play: function(){
			if(ViewModel.Player.Playing()){
				return;
			}
			ViewModel.Player.Playing(true);
			ViewModel.Player.PlayingId = setInterval(ViewModel.Player.MovePositionMarker, ViewModel.Player.Speed);			
		},		
		Stop: function(){
			ViewModel.Player.Playing(false);
			ViewModel.Player.CurrentPosition(0);
			clearInterval(ViewModel.Player.PlayingId);
		},		
		MovePositionMarker: function() {
			
			var position = ViewModel.Player.CurrentPosition();
			//console.log(position);
			if (position >= ViewModel.MusicGrid.CanvasWidth) {
				ViewModel.Player.CurrentPosition(0);
			} else {		
				position++;
				ViewModel.Player.CurrentPosition(position);	
			}
		}
	},
	Utils: {
		GenerateGuid: function(){
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});
		}
	}
};

ViewModel.Player.CurrentPosition.subscribe(function(newValue){
	var cells = ViewModel.MusicGrid.GetActiveSoundCellsFromStartPosition(newValue);
	if(cells.length === 0)
		return;
	//console.log(cells.length);
	for(var i = 0; i != cells.length; i++){
		var cell = cells[i];
		if(cell.Active()){
			cell.Play();
		}
	}
});


	

var SoundCell = function(){
	var self = this;
	self.PositionX = 0,
	self.PositionY = 0,
	self.Width = ViewModel.MusicGrid.CanvasWidth / 40;
	self.Height =  ViewModel.MusicGrid.CanvasHeight / 16;
	self.Play = function(){};	
	self.Id = ViewModel.Utils.GenerateGuid();		
	self.Active = ko.observable(false);		
	self.BackgroundColor = function(){
		if(self.Active())
			return "#32a8ed";
		
		return "#FFFFFF";
	};
	self.Draw = function(){		
		var canvasContext = ViewModel.MusicGrid.CanvasContext;
		canvasContext.beginPath();		
		canvasContext.rect(self.PositionX, self.PositionY, self.Width, self.Height);	
		canvasContext.fillStyle = self.BackgroundColor();
		canvasContext.fill();
		canvasContext.strokeRect(self.PositionX, self.PositionY, self.Width, self.Height);	
		canvasContext.closePath();
		
		canvasContext.beginPath();	
		canvasContext.fillStyle = 'red';
		canvasContext.textAlign="center"; 
		canvasContext.fillText(self.PositionX,self.PositionX + self.Width / 2, self.PositionY + self.Height / 2);
		canvasContext.closePath();
	};
	self.Click = function(){
		
		if(!self.Active()){
			self.Play();
			var copy = $.extend({}, self);					
			ViewModel.MusicGrid.ActiveSoundsCells.push(copy);
		}	
		else{
			ViewModel.MusicGrid.ActiveSoundsCells = $.grep(ViewModel.MusicGrid.ActiveSoundsCells, function(item) {
				return item.Id !== self.Id;
			});
		}
		
		
		self.Active(!self.Active());	
		self.Draw();
	};
};

var Sound = function(rowIndex){
	var self = this;
	
	self.SoundId = 0;	
	self.RowPosistion = rowIndex;	
	self.Audio = new Audio();	
	self.AudioLoaded = ko.observable(false);
	self.Audio.onloadeddata = function(){		
		
	};
	self.Color = "#FFFFFF";
	self.Cells = [];
	self.Play = function(){		
		self.Audio.pause();
		self.Audio.currentTime = 0;
		self.Audio.play();
	};	

	for (var i = 0; i < 40; i++){	
		var cell = new SoundCell();
		cell.PositionX = i * cell.Width;
		cell.PositionY = self.RowPosistion * cell.Height;
		cell.Play = self.Play;		
		self.Cells.push(cell);
	}
};

ko.applyBindings(window.ViewModel, document.getElementById("JGMusicMaker"));


ViewModel.MusicGrid.CanvasElement.onmousedown = function(mouseEvent){
	var cell = ViewModel.MusicGrid.GetCellFromPosition(mouseEvent.offsetX, mouseEvent.offsetY);	
	
	if(cell === null)
		return;
	cell.Click();		
};

ViewModel.MusicGrid.CanvasElement.onmousewheel = function(wheelEvent){
	ViewModel.MusicGrid.MoveBoard(wheelEvent.deltaY < 0);
};

ViewModel.MusicGrid.LoadSounds();