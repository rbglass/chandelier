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
    provider     : "google",
    password     : config.bell.password,
    isSecure     : false,
    clientId     : config.bell.clientID,
    clientSecret : config.bell.clientSecret

  });

  server.auth.strategy("session", "cookie", {
    password   : config.cookie.password,
    cookie     : "sid",
    // redirectTo : "/",
    isSecure   : "false"
  });
});


server.route([

  {
    path    : "/",
    method  : "GET",
    config  : {
      handler : handler.home,
      auth    : "session"
    }
  },

  {
    path   : "/login",
    method : "POST",
    config : {
      auth    : "google",
      handler : handler.login,
      plugins : {
        "hapi-auth-cookie" : {
          redirectTo : false
        }
      }
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
