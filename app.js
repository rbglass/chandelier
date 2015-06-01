var server = require('./api/server');

server.start(function(){
    console.log("Server running at port:", server.info.port);
});
