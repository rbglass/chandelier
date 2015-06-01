module.exports = {

  home : function(request, reply) {
    console.log("home handler");
    // console.log(request);

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
      username    : creds.profile,
      auth_id     : creds.profile.raw.id,
      email       : creds.profile.email
    };

    request.auth.session.set(profile);
    reply.redirect("/login");

  },

  jobs : function(request, reply) {
      reply("Succesfully logged in");
  },

  logout : function(request, reply) {
    console.log("logout handler");

    request.auth.session.clear();
    reply.redirect("/");
  }

};
