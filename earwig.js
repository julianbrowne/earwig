
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
  console.log("earwig: %s listening at %s on %s", server.name, server.url, server.port);
});

function listen(method) { 
    console.log("earwig: registering listener for method %s", method.toUpperCase());
    return function respond(request, response, next) { 
        console.log("earwig: %d: %s %s", calls++, request.method, request.url);
        Object.keys(request.headers).forEach(function(header) {
             console.log("earwig: http header %s = %s", header, request.headers[header]);
        });
        console.log("earwig: body: %s", JSON.stringify(request.body));
        response.send(config.httpResponse);
    }
};
