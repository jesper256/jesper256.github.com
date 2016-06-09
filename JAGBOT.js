var JAGBOT = function(){
	var pub = { Events: [], EventTimeOuts: [], IsRecording: false };	
	var priv = {};
	
	var Constants = {
		EventTypes: {
			None: 0,
			Keyboard: 1,
			Mouse: 2
		}
	};
	
	var Models = {				
		Event: function(){
			return {
				EventType: Constants.EventTypes.None,
				Time: 0,
				OriginalEvent: undefined
			}
		}			
	};	
		
	priv.TriggerMouseEvent = function(mouseEvent){
		
		var eventToTrigger = new MouseEvent(mouseEvent.type, {
			screenX: mouseEvent.pageX, 
			screenY: mouseEvent.pageY
		});
		
		var elementToClickOn = document.elementFromPoint(mouseEvent.pageX - window.pageXOffset, mouseEvent.pageY - window.pageYOffset);
		elementToClickOn.dispatchEvent(eventToTrigger);
	};
	
	priv.updateEventsList = function(){
		var eventDiv = document.getElementById("JAGBOT_EVENTS");
		eventDiv.innerHTML = "";
		
		for(var i = 0; i != pub.Events.length; i++){
			var event = document.createElement("p");
			event.style = "font-size: 14px;border-bottom: 1px solid grey;";
			event.id = "JAGBOT_EVENT_" + pub.Events[i].OriginalEvent.type + "_" + pub.Events[i].Time;
			event.innerHTML = pub.Events[i].OriginalEvent.type + " x:" + pub.Events[i].OriginalEvent.x+ " y:" + pub.Events[i].OriginalEvent.y;
			eventDiv.appendChild(event); 
		}		
	};
	
	priv.mouseEvent = function(ev)
	{
		if(!pub.IsRecording){
			return;
		}
		
		var newEvent = new Models.Event();			
		newEvent.Time = new Date().getTime();
		newEvent.OriginalEvent = ev;
		newEvent.EventType = Constants.EventTypes.Mouse;			
		pub.Events.push(newEvent);
		priv.updateEventsList();			
	};
	
	priv.Record = function(){		

		if(pub.IsRecording)	{
			return;
		}
		
		console.log("Recording...");
				
		document.onmousedown = priv.mouseEvent;			
		document.onmouseup = priv.mouseEvent;		
		document.onclick = priv.mouseEvent;		
		
		setTimeout(function(){
			pub.IsRecording = true;	
		}, 200);			
	};
	
	priv.Stop = function (){
		console.log("Stopped...");	
		pub.IsRecording = false;
		document.onmousedown = function(){};
		document.onmouseup = function(){};
		document.onclick = function(){};
				
		for(var i = 0; i != pub.EventTimeOuts.length; i++){	
			clearTimeout(pub.EventTimeOuts[i]);
		}
		
		pub.EventTimeOuts = [];
	};
	
	priv.Play = function(){
		console.log("Play...");	
		var now = new Date().getTime();
		
		var lastEventTime = 0;
		var totalTime = 0;
		
		for(var i = 0; i != pub.Events.length; i++){
			var eventEl = document.getElementById("JAGBOT_EVENT_" + pub.Events[i].OriginalEvent.type + "_" + pub.Events[i].Time);
			eventEl.style = "background:white;font-size: 14px;border-bottom: 1px solid grey;";	
		}
		
		for(var i = 0; i != pub.Events.length; i++){				
			
			if(lastEventTime !== 0){
				totalTime += (pub.Events[i].Time - lastEventTime);
			}			
			
			lastEventTime = pub.Events[i].Time;	
			
			var timeout = setTimeout(function(){				
				var eventEl = document.getElementById("JAGBOT_EVENT_" + this.OriginalEvent.type + "_" + this.Time);
				eventEl.style = "background:lightblue;font-size: 14px;border-bottom: 1px solid grey;";				
				priv.TriggerMouseEvent(this.OriginalEvent);
			}.bind(pub.Events[i]), totalTime);
			
			pub.EventTimeOuts.push(timeout);
		}
	};
	
	priv.Reset = function(){
		console.log("Reset...");	
		pub.Events = [];
		priv.updateEventsList();
	};
	
	pub.Record = priv.Record;		
	pub.Stop = priv.Stop;		
	pub.Play = priv.Play;		
	pub.Reset = priv.Reset;	


	var container =  document.createElement("div");
	container.id="JAGBOT_GUI";	
	container.style = "position:fixed; top:0;left:0; padding:5px; background:#FFF;z-index:99999;border:4px solid lightgrey;";
	
	var playButton =  document.createElement("button");
	playButton.innerHTML = "Play";
	playButton.onclick  = priv.Play;
	container.appendChild(playButton);
	
	var stopButton =  document.createElement("button");
	stopButton.innerHTML = "Stop";
	stopButton.onclick  = priv.Stop;
	container.appendChild(stopButton);
	
	var recordButton =  document.createElement("button");
	recordButton.innerHTML = "Record";
	recordButton.onclick  = priv.Record;
	container.appendChild(recordButton);
	
	var resetButton =  document.createElement("button");
	resetButton.innerHTML = "Reset";
	resetButton.onclick  = priv.Reset;
	container.appendChild(resetButton);	
	
	
	var events = document.createElement("div");
	events.id = "JAGBOT_EVENTS";
	container.appendChild(events);	
	
	document.body.appendChild(container);
	
	return pub;
}();

