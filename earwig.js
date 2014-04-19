
var restify = require('restify');
var config = require('./config.json');
var calls = 0;
var port = process.argv[2] || config.port;

var server = restify.createServer({ 
    name: config.name
});

server.use(restify.bodyParser({ mapParams: false }));

config.supportedMethods.forEach(function(method) { 
    server[method](/^.*$/, listen(method));
});

server.listen(port, function() { 
  console.log("%s listening at %s on %s", server.name, server.url, server.port);
});

function listen(method) { 
    console.log("registering listener for method %s", method.toUpperCase());
    return function respond(request, response, next) { 
        console.log("%d: %s %s", calls++, request.method, request.url);
        console.log("body: %s", JSON.stringify(request.body));
        response.send(config.httpResponse);
    }
};
