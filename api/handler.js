module.exports = {

  home : function(request, reply) {
    console.log("home handler");
    reply("Hello");
  },

  login : function(request, reply) {
    console.log("login handler");

  },

  logout : function(request, reply) {
    console.log("logout handler");
    request.auth.session.clear();
    reply.redirect("/");
  }

};
