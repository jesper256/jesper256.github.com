var ProcessMe = function(){
	var self = this;
	self.workers = [];
	self.methods = [];
	
	self.serialize = function (f, env) {
		return JSON.stringify({ src: f.toString(), env: env });
	};
	
	self.defaultOnMessage = function(data){
		console.log("Message:");
		console.log(data);

		data.currentTarget.terminate();
	};
	self.defaultOnError = function(data){
		console.log("Error:");
		console.log(data);
		data.currentTarget.terminate();
	};

	self.add = function(method, onmessage, onerror) {		
		self.methods.push(self.serialize(method, this));	


		var worker = new Worker("worker.js");
		worker.onmessage = onmessage || self.defaultOnMessage;
		worker.onerror = onerror || self.defaultOnError;
		self.workers.push(worker)

	};


	self.runAll = function(){
		self.workers.forEach(function(worker, index) {
			worker.postMessage(self.methods[index]);
		}, this);		
	};
	
	return self;
};

var _pm = new ProcessMe();

var heavyMethod = function(){
	var sum = 0;
	for (var i = 0; i !== 10000; i++) {
		sum = sum + i;
	}

	return sum;
};

for (var i = 0; i !== 10; i++) {
	_pm.add(heavyMethod);
}

//_pm.runAll();