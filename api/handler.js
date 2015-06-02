"use strict";

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

// -------------------------------------------------- \\


  findJobs : function(request, reply) {
    if (request.auth.isAuthenticated) {
      console.log("authenticated");
    // DB query to jobs table, return details for all jobs
    } else if (!request.auth.isAuthenticated) {
      reply().code(403);
    }
  },

  addJob : function(request, reply) {
  	if (request.auth.isAuthenticated) {
  		console.log("authenticated");
  	// Add whole row to jobs DB table
  	} else if (!request.auth.isAuthenticated) {
  		reply().code(403);
  	}
  },

// -------------------------------------------------- \\


  findSingleJob : function(request, reply) {
    if (request.auth.isAuthenticated) {
      console.log("authenticated");

    } else if (!request.auth.isAuthenticated) {
      reply().code(403);
    }
  },

  createSingleJob : function(request, reply) {
    if (request.auth.isAuthenticated) {
      console.log("authenticated");

    } else if (!request.auth.isAuthenticated) {
      reply().code(403);
    }
  },

  updateSingleJob : function(request, reply) {
    if (request.auth.isAuthenticated) {
      console.log("authenticated");

    } else if (!request.auth.isAuthenticated) {
      reply().code(403);
    }
  },

  removeSingleJob : function(request, reply) {
    if (request.auth.isAuthenticated) {
      console.log("authenticated");

    } else if (!request.auth.isAuthenticated) {
      reply().code(403);
    }
  },

// -------------------------------------------------- \\


  findSingleItem : function(request, reply) {
    if (request.auth.isAuthenticated) {
      console.log("authenticated");

    } else if (!request.auth.isAuthenticated) {
      reply().code(403);
    }
  },

  updateSingleItem : function(request, reply) {
    if (request.auth.isAuthenticated) {
      console.log("authenticated");

    } else if (!request.auth.isAuthenticated) {
      reply().code(403);
    }
  },

  removeSingleItem : function(request, reply) {
    if (request.auth.isAuthenticated) {
      console.log("authenticated");

    } else if (!request.auth.isAuthenticated) {
      reply().code(403);
    }
  },

// -------------------------------------------------- \\


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


  logout : function(request, reply) {

    request.auth.session.clear();
    reply("Succesfully logged out");
  }


};

module.exports = handler;
