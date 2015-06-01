var path  = require("path");
var index = path.resolve(__dirname + "/../public/index.html");

var handler = {

  home : function(request, reply) {

    if (request.auth.isAuthenticated) {
      reply.file(index);
    } else if (!request.auth.isAuthenticated) {
      reply.redirect("/login");
    }
  },


  login : function(request, reply) {

    var creds = request.auth.credentials;

    var profile = {
      auth_method : "google",
      username    : creds.profile.raw.name,
      auth_id     : creds.profile.raw.id,
      email       : creds.profile.raw.email
    };

    request.auth.session.clear();
    request.auth.session.set(profile);
    reply.redirect("/");

  },


  jobs : function(request, reply) {
    if (request.auth.isAuthenticated) {
      console.log("authenticated")
    } else if (!request.auth.isAuthenticated) {
      reply().code(403);
    }
  },


  logout : function(request, reply) {

    request.auth.session.clear();
    reply("Succesfully logged out");
  }


};

module.exports = handler;
