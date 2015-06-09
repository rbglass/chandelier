"use strict";

var path  = require("path");
var index = path.join(__dirname, "/../public/index.html");
var config = require("./config.js");
// var Users = require("./models/Users");
// var Jobs = require("./models/Jobs");
// var Job_items = require("./models/Job_items");
var pg = require("pg");
var pdfMaker = require("./utils/pdfMaker");
var client = require("./models/database");
var conString = process.env.DATABASE_URL || config.database.dburl;

var handler = {

	home : function(request, reply) {

    if (request.auth.isAuthenticated) {
      console.log("home handler");
      reply.file(index);
    } else if (!request.auth.isAuthenticated) {
			reply.redirect("/login");
    }
	},

// // -------------------------------------------------- \\

	getJobsTable : function(request, reply) {
		console.log("pg jobs table handler");

		var results = [];
		pg.connect(conString, function(err, client, done) {
			if (err) {
				console.log("getJobsTable error: ", err);
			}

			var query = client.query("SELECT * FROM jobs");

			query.on("row", function(row) {
				results.push(row);
			});

			query.on("end", function() {
				client.end();
				return reply(results);
			});
		});
	},

	// getJobsTable : function(request, reply) {
	// 	console.log("jobs table handler");
	// 	Jobs.findAll().then(function(jobs){
	// 			var formattedJobs = jobs.map(function(job) {
	// 				return {
	// 					job_id: job.job_id,
	// 					details: job
	// 				}
	// 			})
	// 			reply(formattedJobs);
	// 	}).catch(function(err){
	// 		if (err) return console.log(err);
	// 	});
	// },

// // -------------------------------------------------- \\

	createJob : function(request, reply) {

		var results = [];
		var entry = request.payload.data;
		var jobData = {
			job_id: 						undefined,
			client: 						entry.client || "",
			project: 						entry.project || "",
			job_status: 				entry.job_status || "",
			order_type: 				entry.order_type || "",
			shipping_date: 			entry.shipping_date || new Date(),
			num_of_job_items: 	entry.num_of_job_items || 0,
			parts_status: 			entry.parts_status || "",
			last_update: 				entry.last_update || new Date()
		};

		pg.connect(conString, function(err, client, done) {

			if (err) {
				console.log("createJob error: ", err);
			}

			client.query("INSERT INTO jobs (jobData) values ($1, $2)", [jobData.client,
																																	jobData.project,
																																	jobData.job_status,
																																	jobData.order_type,
																																	jobData.shipping_date,
																																	jobData.num_of_job_items,
																																	jobData.parts_status,
																																	jobData.last_update]);

			var query = client.query("SELECT * FROM jobs ORDER BY lastupdated");

			query.on("row", function(row) {
				results.push(row);
			});

			query.on("end", function() {
				client.end();
				return reply(results);
			});
		});
	},

// 	createJob : function(request, reply) {
// 		//create an empty row (the updateJob handler should then be triggered)
// 		var entry = request.payload;

// 		Jobs.create({
// 			job_id: 						undefined,
// 			client: 						entry.client || "",
// 			project: 						entry.project || "",
// 			job_status: 				entry.job_status || "",
// 			order_type: 				entry.order_type || "",
// 			shipping_date: 			entry.shipping_date || new Date(),
// 			num_of_job_items: 	entry.num_of_job_items || 0,
// 			parts_status: 			entry.parts_status || "",
// 			last_update: 				entry.last_update || new Date()
// 		}).then(function(job){
// 			//TODO need an oclick on the frontend to create an empty row.
// 				reply(job);
// 		}).catch(function(err){
// 			if (err) return console.log(err);
// 		});
// 	},

	updateJob : function(request, reply) {
		var results = [];

		var id = request.params.id;
		var data = request.payload.data;

		pg.connect(conString, function(err, client, done) {

			if (err) {
				console.log("updateJob handler error: ", err);
			}

			var query = client.query("UPDATE jobs SET ");

			query.on("row", function(row) {
				results.push(row);
			});

			query.on("end", function() {
				client.end();
				return reply(results);
			});
		});
	},

// 	updateJob : function(request, reply) {

// 		var target = request.payload[target];
// 			var value = request.payload.value;
// 			Jobs.update({
// 			target : value
// 		}, {
// 			where : {
// 				job_id : request.payload.job_id }
// 		}).then(function(job) {
// 			reply(job);
// 		}).catch(function(err) {
// 				if (err) return console.log(err);
// 			});
// 	},

	deleteJob : function(request, reply) {
		var results = [];
		var entry = request.payload.entry;

		pg.connect(conString, function(err, client, done) {

			if (err) {
				console.log("deleteJob handler error: ", err);
			}

			client.query("DELETE FROM jobs WHERE job_id=($1)", [entry]);

			var query = client.query("SELECT * FROM items");
		});
	},

// 	deleteJob : function(request, reply) {

// 		var entry = request.payload;
// 		Jobs.destroy({
// 			where : { job_id : entry.job_id }

// 		}).then(function(job) {
// 			reply(job);
// 		}).catch(function(err){
// 			if (err) return console.log(err);
// 		});
// 	},

	getSingleJob : function(request, reply) {
		//for the details on top of the job_items table
		var pdf = request.query.pdf;


  	var entry = request.payload;
  	Jobs.find({
  		where : { job_id: entry.job_id }
  	}).then(function(details) {
			Job_items.findAll({
				where : { job_id: entry.job_id }
			}).then(function(items){
				var job = {
					job_id: entry.job_id,
					details: details,
					items: items
				};
				if(pdf) {
					pdfMaker(job, reply);
				} else{
					reply(job);
				}
			});

		}).catch(function(err) {
			if (err) return console.log(err);
		});
	},

// -------------------------------------------------- \\
//************************ (might need to remove this for now)
	getJobItemsTable : function(request, reply) {
		Job_items.findAll().then(function(singleItems){
			reply(singleItems);
		}).catch(function(err){
			if (err) return console.log(err);
		});
	},

// -------------------------------------------------- \\

	getJobItems : function(request, reply) {

  	var entry = request.payload;
//		var JobID = "RB" + entry.job_id.toString();

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
			item_id: 			undefined,
			job_id: 			entry.job_id,
			product: 			entry.product 		|| "",
			description: 	entry.description || "",
			glass: 				entry.glass 			|| "",
			metal: 				entry.metal 			|| "",
			flex: 				entry.flex 				|| "",
			bulb: 				entry.bulb 				|| "",
			qty_req: 			entry.qty_req 		|| 0,
			qty_hot: 			entry.qty_hot 		|| 0,
			qty_cold: 		entry.qty_cold 		|| 0,
			qty_assem: 		entry.qty_assem 	|| 0,
			qty_packed: 	entry.qty_packed 	|| 0,
			notes: 				entry.notes 			|| ""
		}).then(function(job_item){
			reply(job_item);
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

// // -------------------------------------------------- \\

	login : function(request, reply) {

		var creds = request.auth.credentials;

		var profile = {
			auth_method : "google",
			username    : creds.profile.raw.name,
			auth_id     : creds.profile.raw.id,
			email       : creds.profile.raw.email
		};

		pg.connect(conString, function(err, client, done) {
			var results = [];
			var email = "ben@wesort.co.uk";
			console.log("req:", request);

			if (err) {
				console.log("login error: ", err);
			}
			var query = client.query("SELECT * FROM users WHERE email=($1)", [email]);

			query.on("row", function(row){
				results.push(row);
			});

			query.on("end", function() {
				client.end();
				if (results.length > 0) {
					console.log("authenticated!");
					request.auth.session.clear();
					request.auth.session.set(profile);
					reply.redirect("/");
				} else if (results.length <= 0) {
					console.log("not authenticated!");
					reply("You're not allowed to do that");
				}
			});
		});
	},

// 	login : function(request, reply) {

//     var creds = request.auth.credentials;

//     var profile = {
//       auth_method : "google",
//       username    : creds.profile.raw.name,
//       auth_id     : creds.profile.raw.id,
//       email       : creds.profile.raw.email
//     };

// 		 Users.findOne({
// 			 where: {email: profile.email}
// 		 }).then(function(email) {
// 			 console.log("email: ", email);
// 			if (email) {
// 				request.auth.session.clear();
// 				request.auth.session.set(profile);
// 				reply.redirect("/");
// 			} else {
// 				reply("not a valid user");
// 			}
// 		 }).catch(function(err){
// 			 if (err) return console.log(err);
// 		 });
//   },

	logout : function(request, reply) {

		request.auth.session.clear();
		reply("Succesfully logged out");
	}

};

module.exports = handler;
