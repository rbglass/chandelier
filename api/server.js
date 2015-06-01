var Hapi   = require*("hapi");
var server = new Hapi.Server();

server.connection({
  port : process.env.PORT || 8000
});
