
self.addEventListener("message", function(event) {
    self.postMessage(self.parse(event.data)());
}, false);


self.serialize = function (f, env) {
    return JSON.stringify({ src: f.toString(), env: env });
};

self.parse = function (serialized) {
	var parsed = JSON.parse(serialized);
	return createFunction(parsed.src, parsed.env);
};

self.createFunction = function (src, env) {
	return (new Function(createFunctionBody(src, env))(env));
};

self.createFunctionBody = function (src, env) {
	return '"use strict";\n' + Object.keys(env).reduceRight(addVar, 'return ' + src + ';');
};

self.addVar = function (s, k) {
	return 'var ' + k + ' = arguments[0].' + k + ';\n' + s;
};