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
	  	reply("createJob");
		}).catch(function(err){
			if (err) return console.log(err);
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
		Job_items.findAll().on('success', function(){
			reply("getJobItemsTable");
		}).catch(function(err){
			if (err) return console.log(err);
		});
	},

// -------------------------------------------------- \\

  getJobItems : function(request, reply) {
  	reply("getJobItems");
  },

  createJobItems : function(request, reply) {
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
  		reply("createJobItems");
		}).catch(function(err){
			if (err) return console.log(err);
		});
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
