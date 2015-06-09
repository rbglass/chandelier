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

		var results = [];
		pg.connect(conString, function(err, client, done) {
			if (err) {
				console.log("getJobsTable handler error: ", err);
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

// // -------------------------------------------------- \\

	createJob : function(request, reply) {

		var results = [];
		var entry = request.payload;
		var jobData = {
			job_id: 						undefined,
			client: 						entry.client || "",
			project: 						entry.project || "",
			job_status: 				entry.job_status || "",
			order_type: 				entry.order_type || "",
			shipping_date: 			entry.shipping_date || "",
			num_of_job_items: 	entry.num_of_job_items || 0,
			parts_status: 			entry.parts_status || "",
			last_update: 				entry.last_update || new Date()
		};

		pg.connect(conString, function(err, client, done) {

			if (err) {
				console.log("createJob handler error: ", err);
			}

			client.query("INSERT INTO jobs (job_id, client, project, job_status, order_type, shipping_date, num_of_job_items, parts_status, last_update) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
							[jobData.id,
							jobData.client,
							jobData.project,
							jobData.job_status,
							jobData.order_type,
							jobData.shipping_date,
							jobData.num_of_job_items,
							jobData.parts_status,
							jobData.last_update]);

			var query = client.query("SELECT * FROM jobs ORDER BY last_update");

			query.on("row", function(row) {
				results.push(row);
			});

			query.on("end", function() {
				client.end();
				return reply(results);
			});
		});
	},

	updateJob : function(request, reply) {
		var results = [];

		var data = request.payload.job_status;
		var id = request.params.id;

		pg.connect(conString, function(err, client, done) {

			if (err) {
				console.log("updateJob handler error: ", err);
			}

			client.query("UPDATE jobs SET job_status=($1) WHERE job_id=($2)", [data, id]);

			var query = client.query("SELECT * FROM jobs WHERE job_id=($1)", [id]);

			query.on("row", function(row) {
				results.push(row);
			});

			query.on("end", function() {
				client.end();
				return reply(results);
			});
		});
	},

	deleteJob : function(request, reply) {
		var results = [];
		var id = request.payload.job_id;
		console.log("payload:", request.payload);
		console.log("params: ", request.params);

		pg.connect(conString, function(err, client, done) {

			if (err) {
				console.log("deleteJob handler error: ", err);
			}

			client.query("DELETE FROM jobs WHERE job_id=($1)", [id]);

			var query = client.query("SELECT * FROM jobs");
			query.on("row", function(row) {
				results.push(row);
			});

			query.on("end", function() {
				client.end();
				return reply().code(204);
				});
		});
	},


	getSingleJob : function(request, reply) {

		var results = [];
		var id = request.params.id;

		pg.connect(conString, function(err, client, done) {

			if (err) {
				console.log("getSingleJob handler error: ", err);
			}

			var query = client.query("SELECT * FROM jobs WHERE job_id=($1)", [id]);

			query.on("row", function(row) {
				results.push(row);
			});

			query.on("end", function() {
				client.end();
				return reply(results);
				});
			});
		},

// -------------------------------------------------- \\

	getJobItemsTable : function(request, reply) {
		var results = [];

		pg.connect(conString, function(err, client, done) {

			if (err) {
				console.log("getJobItemsTable handler error: ", err);
			}
			var query = client.query("SELECT * FROM job_items");

			query.on("row", function(row) {
				results.push(row);
			});

			query.on("end", function() {
				client.end();
				return reply(results);
			});
		});
	},

// -------------------------------------------------- \\

	getJobItems : function(request, reply) {

		var results = [];
		var id = request.params.id;

		pg.connect(conString, function(err, client, done) {

			if (err) {
				console.log("getJobItems handler error: ", err);
			}
			var query = client.query("SELECT * FROM job_items WHERE id=($1)", [id]);

			query.on("row", function(row) {
				results.push(row);
			});

			query.on("end", function() {
				client.end();
				return reply(results);
			});
		});

	},

	createJobItem : function(request, reply) {

	// 	var results = [];
	// 	var entry = request.payload;

	// 	var itemData = {
	// 		item_id: 			undefined,
	// 		job_id: 			entry.job_id,
	// 		product: 			entry.product 		|| "",
	// 		description: 	entry.description || "",
	// 		glass: 				entry.glass 			|| "",
	// 		metal: 				entry.metal 			|| "",
	// 		flex: 				entry.flex 				|| "",
	// 		bulb: 				entry.bulb 				|| "",
	// 		qty_req: 			entry.qty_req 		|| 0,
	// 		qty_hot: 			entry.qty_hot 		|| 0,
	// 		qty_cold: 		entry.qty_cold 		|| 0,
	// 		qty_assem: 		entry.qty_assem 	|| 0,
	// 		qty_packed: 	entry.qty_packed 	|| 0,
	// 		notes: 				entry.notes 			|| ""
	// 	};

	// 	pg.connect(conString, function(err, client, done) {

	// 		if (err) {
	// 			console.log("createJobItem handler error: ", err);
	// 		}

	// 		client.query("INSERT INTO job_items (item_id, job_id. product, description, glass, metal, flex, bulb, qty_req, qty_hot, qty_cold, qty_assem, qty_packed, notes) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $14)",
	// 			[itemData.id,
	// 			itemData.job_id,
	// 			itemData.product,
	// 			itemData.description,
	// 			itemData.glass,
	// 			itemData.metal,
	// 			itemData.flex,
	// 			itemData.bulb,
	// 			itemData.qty_req,
	// 			itemData.qty_cold,
	// 			itemData.assem,
	// 			itemData.packed,
	// 			itemData.notes]
	// 		);

	// 		var query = client.query("SELECT * FROM job_items WHERE job_id=($1)", [entry]);
	// 	});
	},

	updateJobItems : function(request, reply) {
		// console.log("req params: ", request.params);
		// console.log("req payload:", request.payload);
		// var results = [];

		// var data = request.payload.metal;
		// var id = request.params.id;

		// pg.connect(conString, function(err, client, done) {

		// 	if (err) {
		// 		console.log("updateJobItems handler error: ", err);
		// 	}

		// 	client.query("UPDATE job_items SET metal=($1) WHERE id=($2)", [data, id]);

		// 	var query = client.query("SELECT * FROM jobs WHERE id=($1)", [id]);

		// 	query.on("row", function(row) {
		// 		results.push(row);
		// 	});

		// 	query.on("end", function() {
		// 		client.end();
		// 		return reply(results);
		// 	});
		// });

	},

	deleteJobItems : function(request, reply) {
		var results = [];
		var id = request.params.item;

		pg.connect(conString, function(err, client, done) {

			if (err) {
				console.log("deleteJobItems handler error: ", err);
			}

			client.query("DELETE FROM job_items WHERE item_id=($1)", [id]);

			var query = client.query("SELECT * FROM job_items");
			query.on("row", function(row) {
				results.push(row);
			});

			query.on("end", function() {
				client.end();
				return reply(results);
				});
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

			if (err) {
				console.log("login error: ", err);
			}
			var query = client.query("SELECT * FROM users WHERE email=($1)", ["ben@wesort.co.uk"]);

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
					reply("You must be an authenticated user to use this application.");
				}
			});
		});
	},

	logout : function(request, reply) {

		request.auth.session.clear();
		reply("Succesfully logged out");
	}

};

module.exports = handler;
