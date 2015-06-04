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
		Jobs.findAll().on('success', function(){
				reply("getJobsTable");
		}).catch(function(err){
			if (err) return console.log(err);
		});
	},

// -------------------------------------------------- \\

  createJob : function(request, reply) {
		var entry = request.payload;
  	Jobs.create({
			job_id: 						entry.job_id,
			client: 						entry.client,
			project: 						entry.project,
			job_status: 				entry.job_status,
			order_type: 				entry.order_type,
			shipping_date: 			entry.shipping_date,
			num_of_job_items: 	entry.num_of_job_items,
			parts_status: 			entry.parts_status,
			last_update: 				entry.last_update
		}).then(function(){
			//TODO need an oclick on the frontend to create an empty row.
				reply("createJob");
		}).catch(function(err){
			if (err) return console.log(err);
  	});
  },

  updateJob : function(request, reply) {

  	// UPDATE jobs SET [field = input] WHERE jobID = RB125

  	var input = request.payload["value"];
  	var field = request.payload["field"];
  	var jobID = request.payload["jobID"];

  	Jobs.update({
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

  	var entry = request.payload;
  	Jobs.destroy({
  		where : { job_id : entry.job_id }

  	}).then(function() {
	  	reply("job deleted");
  	});
  },

  getSingleJob : function(request, reply) {

  	var entry = request.payload;
  	Jobs.find({
  		where : { job_id : entry.job_id }
  	}).then(function(job) {
  		reply(job);
		}).catch(function(err) {
			if (err) return console.log(err);
		});
  },

// -------------------------------------------------- \\

	getJobItemsTable : function(request, reply) {
		Job_items.findAll().on('success', function(){
			reply("getJobItemsTable");
		}).catch(function(err){
			if (err) return console.log(err);
		});
	},

// -------------------------------------------------- \\

  getJobItems : function(request, reply) {

  	var entry = request.payload;
  	Job_items.findAll({
  		where : {
  			job_id : entry.job_id
  		}
  	}).then(function(jobItems) {
  		reply(jobItems);
  	}).catch(function(err){
			if (err) return console.log(err);
		});
  },

  createJobItem : function(request, reply) {
		var entry = request.payload;
		Job_items.create({
			item_id: 			entry.item,
			product: 			entry.product,
			description: 	entry.description,
			glass: 				entry.glass,
			metal: 				entry.metal,
			flex: 				entry.flex,
			bulb: 				entry.bulb,
			qty_req: 			entry.qty_req,
			qty_hot: 			entry.qty_hot,
			qty_cold: 		entry.qty_cold,
			qty_assem: 		entry.qty_assem,
			qty_packed: 	entry.qty_packed,
			notes: 				entry.notes
		}).then(function(){
  		reply("createJobItem");
		}).catch(function(err){
			if (err) return console.log(err);
		});
	},

  updateJobItems : function(request, reply, field) {
			var entry = request.payload;
			Job_items.update({
  		field : entry.field
  	}, {
  		where : {
  			job_id : entry.job_id
  		}
  	}).then(function(jobItem) {
			reply(jobItem);
  	});

  },

  deleteJobItems : function(request, reply) {

		var entry = request.payload;

		Job_items.destroy({
			where : {
				job_id : entry.job_id
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

		 Users.findOrCreate({
			 where: {email: profile.email}
		 }).spread(function(){
				request.auth.session.clear();
				request.auth.session.set(profile);
				reply.redirect("/");
		 }).catch(function(err){
			 if (err) return console.log(err);
		 });
  },

  logout : function(request, reply) {

    request.auth.session.clear();
    reply("Succesfully logged out");
  }


};

module.exports = handler;
