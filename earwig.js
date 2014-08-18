
var fs = require('fs');
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
  console.log("earwig: %s listening on %s", server.name, server.url);
});

server.on('error', function(error) { 
    if(error.code === "EADDRINUSE")
        console.log("earwig: error - port %s is already in use", port);
    else
        console.log(error.code);
    process.exit;
});

function listen(method) { 
    console.log("earwig: registering listener for method %s", method.toUpperCase());
    return function respond(request, response, next) { 
        console.log("earwig: %d: %s %s", calls++, request.method, request.url);
        Object.keys(request.headers).forEach(function(header) {
             console.log("earwig: http header %s = %s", header, request.headers[header]);
        });
        console.log("earwig: body: %s", JSON.stringify(request.body));
        if(config.saveBody.active) { 
            if(!fs.existsSync(config.saveBody.directory)) {
                fs.mkdirSync(config.saveBody.directory, 0766, function(err) { 
                    if(err) {
                        console.log(err);
                        process.exit();
                    }
                });
            }
            fs.writeFileSync(config.saveBody.directory + '/' + calls + ".json", JSON.stringify(request.body));
        }
        if(request.headers["origin"])
            response.header("Access-Control-Allow-Origin", "*"); //request.headers["origin"]);
        response.send(config.httpResponse);
    }
};
