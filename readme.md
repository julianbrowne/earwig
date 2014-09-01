# Earwig

Promiscuous HTTP listener that responds to any endpoint and HTTP method, logging what it discovers

## Usage

    node earwig [port]

## Configuration

In ``config.json file``:

    { 
        "name": "earwig",                      // Name of this server as seen by clients
        "usage": "usage: recvr [port]",        // Usage message
        "hostname": "localhost",               // IP to bind to
        "https": false,                        // use (or not) HTTPS
        "ssl": {                               
            "key": "ssl/server.pem",           // SSL details
            "crt": "ssl/server.crt"            // PEM passphrase for bundled cert is 'earwig'
        },
        "port": 8088,                          // port to listen on
        "httpResponse": 200,                   // HTTP code to return for all requests
        "supportedMethods": [                  // HTTP methods to respond to
            "get", 
            "put", 
            "post", 
            "head", 
            "del"
        ],
        "saveBody": { 
            "active": true,                    // Save (or not) incoming request body data
            "directory": "temp"                // If saving, where to save
        }
    }
