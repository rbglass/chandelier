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
		console.log("jobs table handler");
		Jobs.findAll().on('success', function(){
				reply("getJobsTable");
		}).catch(function(err){
			if (err) return console.log(err);
		});
	},

// -------------------------------------------------- \\

  createJob : function(request, reply) {
		//create an empty row (the updateJob handler should then be triggered)
  	Jobs.create({
			job_id: 						" ",
			client: 						" ",
			project: 						" ",
			job_status: 				" ",
			order_type: 				" ",
			shipping_date: 			" ",
			num_of_job_items: 	" ",
			parts_status: 			" ",
			last_update: 				" "
		}).then(function(){
			//TODO need an oclick on the frontend to create an empty row.
				reply("createJob");
		}).catch(function(err){
			if (err) return console.log(err);
  	});
  },

  updateJob : function(request, reply) {

  	var target = request.payload[target];
			var value = request.payload.value;
			Jobs.update({
  		target : value
  	}, {
  		where : {
  			target : {
					$ne: value
					//update where original value is NOT the updated value
				}
  		}
  	}).then(function(job) {
			reply(job);
  	}).catch(function(err) {
				if (err) return console.log(err);
			});

  },

  deleteJob : function(request, reply) {

  	var entry = request.payload;
  	Jobs.destroy({
  		where : { job_id : entry.job_id }

  	}).then(function() {
	  	reply("job deleted");
  	}).catch(function(err){
			if (err) return console.log(err);
		});
  },

  getSingleJob : function(request, reply) {
		//for the details on top of the job_items table

  	var entry = request.payload;
  	Jobs.find({
  		where : { job_id: entry.job_id }
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
		console.log("i hit the create handler");

		Job_items.create({
			item_id: 			"new",
			product: 			" ",
			description: 	" ",
			glass: 				" ",
			metal: 				" ",
			flex: 				" ",
			bulb: 				" ",
			qty_req: 			" ",
			qty_hot: 			" ",
			qty_cold: 		" ",
			qty_assem: 		" ",
			qty_packed: 	" ",
			notes: 				" "
		}).then(function(){
  		reply("createJobItem");
		}).catch(function(err){
			if (err) return console.log(err);
		});
	},

  updateJobItems : function(request, reply) {
			var target = request.payload[target];
			var value = request.payload.value;
			Job_items.update({
  		target : value
  	}, {
  		where : {
  			target : {
					$ne: value
					//update where original value is NOT the updated value
				}
  		}
  	}).then(function(jobItem) {
			reply(jobItem);
  	}).catch(function(err) {
				if (err) return console.log(err);
			});

  },

  deleteJobItems : function(request, reply) {

		var entry = request.payload;
		//delete rows with this job id
		Job_items.destroy({
			where : {
				job_id : entry.job_id
			}
		}).then(function(jobItem) {
			reply(jobItem);
		}).catch(function(err){
			if (err) return console.log(err);
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
