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
		reply("findJobs");
  },

  addJob : function(request, reply) {
  	reply("addJob");
  },

// -------------------------------------------------- \\


  findSingleJob : function(request, reply) {
  	reply("findSingleJob");
  },

  createSingleJob : function(request, reply) {
  	reply("createSingleJob");
  },

  updateSingleJob : function(request, reply) {
  	reply("updateSingleJob");
  },

  removeSingleJob : function(request, reply) {
  	reply("removeSingleJob");
  },

// -------------------------------------------------- \\


  findSingleItem : function(request, reply) {
  	reply("findSingleItem");
  },

  updateSingleItem : function(request, reply) {
		reply("updateSingleItem");
  },

  removeSingleItem : function(request, reply) {
  	reply("removeSingleItem");
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
