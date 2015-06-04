"use strict";

var path  = require("path");
var index = path.resolve(__dirname + "/../public/index.html");
var Users = require("./models/Users");
var Jobs = require("./models/Jobs");
var Job_items = require("./models/Job_items");

var handler = {

  home : function(request, reply) {

    if (request.auth.isAuthenticated) {
    	console.log("home handler");
      reply.file(index);
    } else if (!request.auth.isAuthenticated) {
      reply.redirect("/login");
    }
  },

// -------------------------------------------------- \\

  getJobsTable : function(request, reply) {
		reply("getJobsTable");
	},

// -------------------------------------------------- \\


  createJob : function(request, reply) {

  	Jobs.create(request).success(function() {
  		console.log("Job succesfully saved");
	  	reply("createJob");
  	});
  },

  updateJob : function(request, reply) {
  	reply("updateJob");
  },

  deleteJob : function(request, reply) {
  	reply("deleteJob");
  },

  getSingleJob : function(request, reply) {

  	Jobs.find(request.payload.id).success(function() {
  	console.log("Job succesfully created");
  	reply("getSingleJob");
  	});
  },

// -------------------------------------------------- \\

	getJobItemsTable : function(request, reply) {
		reply("getJobItemsTable");
	},

// -------------------------------------------------- \\

  getJobItems : function(request, reply) {
  	reply("getJobItems");
  },

  createJobItems : function(request, reply) {
  	reply("createJobItems");
	},

  updateJobItems : function(request, reply) {
		reply("updateJobItems");
  },

  deleteJobItems : function(request, reply) {
  	reply("deleteJobItems");
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

		 Users.findOrCreate({
			 where:
				 {email: profile.email}
		 }).spread(function(){
			request.auth.session.clear();
			request.auth.session.set(profile);
			reply.redirect("/");
		 });
  },

  logout : function(request, reply) {

    request.auth.session.clear();
    reply("Succesfully logged out");
  }


};

module.exports = handler;
