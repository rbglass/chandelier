"use strict";

var path = require("path");

var database = require("./models/database");
var index    = path.resolve(__dirname + "/../public/index.html");

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
  	database.Jobs.findAll().then(function(jobs) {
			reply(jobs);
  	});
	},

// -------------------------------------------------- \\

  createJob : function(request, reply) {

  	// SHOULD WE CREATE A NEW EMPTY JOB THEN INPUT FIELDS WITH PUT REQUESTS?
  	database.Jobs.create().then(function(job) {
  		console.log("Job succesfully saved");
	  	reply(job);
  	});
  // },

  	// OR POST ALL DETAILS IN ONE GO WHEN JOB IS FIRST CREATED?
  	database.Jobs.create({
  		where : {
  			key1 : "val1",
  			key2 : "val2",
  			key3 : "val3"
  		}
  	}).then(function(job) {
  		reply(job);
  	});
  },

  updateJob : function(request, reply) {

  	// UPDATE jobs SET [field = input] WHERE jobID = RB125

  	var input = request.payload["value"];
  	var field = request.payload["field"];
  	var jobID = request.payload["jobID"];

  	database.Jobs.update({
  		field : input,
  	}, {
  		where : {
  			jobID : jobID
  		}
  	}).then(function(job) {
  		console.log("job updated");
	  	reply(job);
  	});
  },

  deleteJob : function(request, reply) {

  	var jobID = request.payload["jobID"];

  	database.Jobs.destroy({
  		where : {
  			jobID : "jobID"
  		}
  	}).then(function(job) {
  		console.log("job deleted");
	  	reply(job);
  	});
  },

  getSingleJob : function(request, reply) {

  	var jobID = request.payload["jobID"];

  	database.Job.find({
  		where : {
  			jobID : jobID
  		}
  	}).then(function(job) {
  		console.log("job found");
	  	reply(job);
  	});
  },

// -------------------------------------------------- \\

	getJobItemsTable : function(request, reply) {
		database.Job_items.find().then(function(jobItems) {
			reply(jobItems);
		});
	},

// -------------------------------------------------- \\

  getJobItems : function(request, reply) {

  	var jobID = request.payload["jobID"];

  	database.Job_items.findAll({
  		where : {
  			jobID : jobID
  		}
  	}).then(function(jobItems) {
  		reply(jobItems);
  	});
  },

  createJobItem : function(request, reply) {
  	database.Job_items.create().then(function(jobItem) {
  		reply(jobItem);
  	});
	},

  updateJobItems : function(request, reply) {

  	var jobID = request.payload["jobID"];
  	var input = request.payload["value"];
  	var field = request.payload["field"];

  	database.Job_items.update({
  		field : input
  	}, {
  		where : {
  			jobID : jobID
  		}
  	}).then(function(jobItem) {
			reply(jobItem);
  	});
  },

  deleteJobItems : function(request, reply) {

		var jobID = request.payload["jobID"];

		database.Job_items.destroy({
			where : {
				jobID : jobID
			}
		}).then(function(jobItem) {
			reply(jobItem);
		});
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

		database.Users.find({
			where: {
				email: profile.email
			}
		}).spread(function(user) {
			if (user) {
				request.auth.session.clear();
				request.auth.session.set(profile);
				reply.redirect("/");
			} else if (!user) {
			// WILL THIS BE A VALID WAY TO CHECK IF A USER EXISTS IN OUR DATABASE?? \\
				reply("Not a valid account");
			}
		});
  },

  logout : function(request, reply) {

    request.auth.session.clear();
    reply("Succesfully logged out");
  }


};

module.exports = handler;
