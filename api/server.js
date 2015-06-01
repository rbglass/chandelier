var Hapi    = require("hapi");
var bell    = require("bell");
var server  = new Hapi.Server();
var handler = require("./handler");
var config  = require("./config");

server.connection({
  port : process.env.PORT || 8000
});

server.register([require("bell"), require("hapi-auth-cookie")], function(err) {

  if (err) {
    console.log("Error registering authorization: ", err);
    return;
  }

  server.auth.strategy("google", "bell", {
    provider       : "google",
    password       : config.bell.password,
    clientId       : config.bell.clientID,
    clientSecret   : config.bell.clientSecret,
    isSecure       : false,
    providerParams : {
      redirect_uri : server.info.uri + "/"
    }
  });

  server.auth.strategy("session", "cookie", {
    password   : config.cookie.password,
    cookie     : "sid",
    redirectTo : "/jobs",
    isSecure   : "false"
  });
});


server.route([

  {
    path    : "/",
    method  : "GET",
    config  : {
      handler : handler.home,
    }
  },

  {
    path    : "/jobs",
    method  : "GET",
    handler : handler.jobs
  },

  {
    path   : "/login",
    method : ["GET", "POST"],
    config : {
      auth    : "google",
      handler : handler.login,
    }
  },

  {
    path    : "/logout",
    method  : "GET",
    config  : {
      handler : handler.logout,
      auth    : "session"
    }
  }



]);

module.exports = server;
