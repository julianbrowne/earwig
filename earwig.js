
var fs = require('fs');
var util = require('util');
var restify = require('restify');
var config = require('./config.json');
var calls = 0;
var hostname = config.hostname;
var port = process.argv[2] || config.port;

var serverOptions = { name: config.name };
if(config.https) { 
    serverOptions.key = fs.readFileSync(config.ssl.key);
    serverOptions.certificate = fs.readFileSync(config.ssl.crt);
};
var server = restify.createServer(serverOptions);

server.use(restify.bodyParser({ mapParams: false }));

config.supportedMethods.forEach(function(method) { 
    server[method](/^.*$/, listen(method));
});

server.listen(port, hostname, function() { 
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
/**
        Object.keys(request.headers).forEach(function(header) {
             console.log("earwig: http header %s = %s", header, request.headers[header]);
        });
**/
        console.log("%s", JSON.stringify(request.body)); //util.inspect(request.body, { depth: null, colors: true }));
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
            response.header("Access-Control-Allow-Origin", "*");
        response.send(config.httpResponse);
    }
};
