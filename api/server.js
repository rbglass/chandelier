"use strict";
var bell    = require("bell");
var Server  = require("hapi").Server;
var cookie  = require("hapi-auth-cookie");
var config  = require("./config");
var routes  = require("./routing/routes");

var server  = new Server();

server.connection({
  port : Number(process.env.PORT) || 8080
});

server.register([bell, cookie], function(err) {

  if (err) {
    throw new Error("Error registering authorization: ", err);
  }

  server.auth.strategy("google", "bell", {
    provider       : "google",
    password       : config.bell.password,
    clientId       : config.bell.clientID,
    clientSecret   : config.bell.clientSecret,
    isSecure       : true,
    providerParams : {
      redirect_uri : server.info.uri + "/login"
    }
  });

  server.auth.strategy("session", "cookie", {
    password   : config.cookie.password,
    cookie     : "sid",
    redirectTo : "/",
    isSecure   : "false",
    isHttpOnly : false
  });

  server.auth.default("session");
	server.route(routes);
});


module.exports = server;
