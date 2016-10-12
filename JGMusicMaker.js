
window.ViewModel = {
	MusicGrid:{
		Sounds: ko.observableArray([]),
		Loading: ko.pureComputed(function(){
			if(!window.ViewModel){
				return true;
			}
			
			var sounds = window.ViewModel.MusicGrid.Sounds();
			
			for(var i = 0; i != sounds.length; i++){
				if(!sounds[i].AudioLoaded()){
					return true;
				}
			}
			
			return false;
		})		
	},	
	Controls: {
		Play: function(){
			ViewModel.Player.Play();
		},
		Stop: function(){
			ViewModel.Player.Stop();
		}
	},
	Player: {
		CurrentPosition: ko.observable(0),
		Playing: ko.observable(false),
		PlayingId: 0,
		Speed: 10,
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
			//debugger;
			var position = ViewModel.Player.CurrentPosition();
			if (position == 10000) {
				clearInterval(ViewModel.Player.PlayingId);
			} else {		
				var newPosition = position;
				newPosition++;
				ViewModel.Player.CurrentPosition(newPosition);	
			}
		}
	}
};


var _sounds = [];	

var SoundCell = function(){
	var self = this;
	self.StartPosition = 0,
	self.EndPosition = 0,
	self.Play = function(){};	
	self.Active = ko.observable(false);	
	self.IsPlaying = ko.computed(function(){	
		var isPlaying = ViewModel.Player.CurrentPosition() > self.StartPosition && ViewModel.Player.CurrentPosition() <= self.EndPosition && self.Active();
		
		if(isPlaying){
			self.Play();
		}
		
		return isPlaying;
	});
};

var Sound = function(){
	var self = this;
	
	self.SoundId = 0;	
	self.Audio = new Audio();
	self.Width = ko.observable(20);
	self.AudioLoaded = ko.observable(false);
	self.Audio.onloadeddata = function(){
		//self.Width(self.Audio.duration * ViewModel.Player.Speed);
		for (var i = 0; i < 100; i++){	
			var startPosistion = i * self.Width();		
			var cell = new SoundCell();
			cell.StartPosition = startPosistion;
			cell.EndPosition = startPosistion + self.Width();		
			cell.Play = self.Play;		
			self.Cells.push(cell);
		}
		self.AudioLoaded(true);
	};
	self.Color = "#FFFFFF";
	self.Cells = ko.observableArray([]);
	self.Play = function(){		
		self.Audio.play();
	};	
	
};

ko.applyBindings(window.ViewModel, document.getElementById("JGMusicMaker"));


var mp3s = ["BD0000.mp3","BD0010.mp3","CB.mp3","CL.mp3","CP.mp3","CY0000.mp3","CY0010.mp3","MA.mp3","OH00.mp3","OH10.mp3","OH25.mp3","RS.mp3","SD0000.mp3","SD0010.mp3","SD0025.mp3","SD0050.mp3"];
for(var i = 0; i != mp3s.length; i++){
	var sound = new Sound();
	sound.Audio.src = "Sounds/" + mp3s[i];
	_sounds.push(sound);	
}
for(var i = 0; i != mp3s.length; i++){
	var sound = new Sound();
	sound.Audio.src = "Sounds/" + mp3s[i];
	_sounds.push(sound);	
}


window.ViewModel.MusicGrid.Sounds(_sounds);
