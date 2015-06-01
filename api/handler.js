module.exports = {

  home : function(request, reply) {
    console.log("home handler");

    if (!request.auth.isAuthenticated) {
      reply.redirect("/login");
    } else if (request.auth.isAuthenticated) {
      reply("Hello");
    }
  },

  login : function(request, reply) {
    console.log("login handler");

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
      reply("Succesfully logged in");
  },

  logout : function(request, reply) {
    console.log("logout handler");

    request.auth.session.clear();
    reply("Succesfully logged out");
  }

};
