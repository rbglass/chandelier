"use strict";

var path  = require("path");
var index = path.join(__dirname, "/../public/index.html");
var config = require("./config.js");
var pg = require("pg");
var pdfMaker = require("./utils/pdfMaker");
var conString = process.env.DATABASE_URL || config.database.dburl;

var handler = {

	home : function(request, reply) {

    if (request.auth.isAuthenticated) {
      return reply.file(index);
    } else if (!request.auth.isAuthenticated) {
			return reply.redirect("/login");
    }
	},

// // -------------------------------------------------- \\

	getJobsTable : function(request, reply) {

		pg.connect(conString, function(err, client, done) {
			if (err) {
				console.log("getJobsTable handler error: ", err);
			}

			var query = client.query("SELECT * FROM jobs", function(jobErr, info) {
				if (jobErr) {
					return reply(jobErr).code(400);
				} else {
					return reply(info.rows.map(function(row) {
						return {
							job_id : row.job_id,
							details : row
						};
					}));
				}
			});
		});
	},

// // -------------------------------------------------- \\

	createJob : function(request, reply) {

		var entry = request.payload;
		var jobData = {
			client: 						entry.client || "",
			project: 						entry.project || "",
			job_status: 				entry.job_status || "TBC",
			order_type: 				entry.order_type || "Standard",
			shipping_date: 			entry.shipping_date,
			shipping_notes:     entry.shipping_notes || "",
			parts_status: 			entry.parts_status || "",
			parts_notes:        entry.parts_notes || "",
			invoice_notes:      entry.invoice_notes || "",
			payment:            entry.payment || "Awaiting Payment",
			notes:              entry.notes || "",
			last_update: 				entry.last_update || new Date(),
			createdat: 		new Date(),
			updatedat: 		new Date()
		};

		pg.connect(conString, function(err, client, done) {

			if (err) {
				console.log("createJob handler error: ", err);
			}

			client.query("INSERT INTO jobs (client, project, job_status, order_type, " +
				"shipping_date, shipping_notes, parts_status, parts_notes, invoice_notes, " +
				"payment, notes, last_update, createdat, updatedat) values " +
				"($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING job_id",
				[
					jobData.client,
					jobData.project,
					jobData.job_status,
					jobData.order_type,
					jobData.shipping_date,
					jobData.shipping_notes,
					jobData.parts_status,
					jobData.invoice_notes,
					jobData.payment,
					jobData.notes,
					jobData.last_update,
					jobData.createdat,
					jobData.updatedat
				], function(errInsert, info) {
					if (errInsert) {
						return reply(errInsert).code(400);
					} else if (info.rowCount === 1) {
						console.log(info.rows[0]);
						return reply({
							job_id: info.rows[0].job_id,
							details: info.rows[0]
						});
					} else {
						return reply(errInsert);
					}
				});
		});
	},

	updateJob : function(request, reply) {

		var data = request.payload;
		var job_id = request.params.id;
		var fieldsToUpdate = Object.keys(data);

		pg.connect(conString, function(err, client, done) {

			if (err) {
				console.log("updateJob handler error: ", err);
			}

			var string = "UPDATE jobs SET ";

			var items = fieldsToUpdate.map(function(cell, i) {
				string += cell + "=($" + (i + 2) + ") ";
				if (i < fieldsToUpdate.length - 1) {
					string += ", ";
				}
				return data[cell];
			});

			client.query(string + "WHERE job_id=($1) RETURNING *", [job_id].concat(items), function(errInsert, info, res) {
				if(info.rowCount === 1) {
					return reply(info.rows[0]);
				} else {
					return reply(errInsert);
				}
			});
		});
	},

	deleteJob : function(request, reply) {

		var id = request.payload.job_id;

		pg.connect(conString, function(err, client, done) {

			if (err) {
				console.log("deleteJob handler error: ", err);
			}

			client.query("DELETE FROM jobs WHERE job_id=($1)", [id], function(delErr, info) {
				if (delErr) {
					return reply(delErr).code(404);
				} else {
					return reply().code(204);
				}
			});
		});
	},


	getSingleJob : function(request, reply) {

		var id = request.params.id;
		var pdf = request.query.pdf;

		pg.connect(conString, function(err, client, done) {

			if (err) {
				console.log("getSingleJob handler error: ", err);
			}

			var query = client.query("SELECT * FROM jobs WHERE job_id=($1)", [id], function(errJob, info) {
				if (errJob) {
					return reply().code(404);
				} else {
					client.query("SELECT * FROM job_items WHERE job_id=($1)", [id], function(errItems, moreInfo) {
						var jobObj = {
							job_id: id,
							details : info.rows[0],
							items : moreInfo && moreInfo.rows || []
						};
						console.log(errItems);

						if (pdf) {
							pdfMaker(jobObj, reply);
						} else {
							reply(jobObj);
						}
					});
				}
			});
		});
	},

// -------------------------------------------------- \\

	getJobItemsTable : function(request, reply) {

		pg.connect(conString, function(err, client, done) {

			if (err) {
				console.log("getJobItemsTable handler error: ", err);
			}

			var queryString = "SELECT job_items.*, jobs.shipping_date, jobs.job_status " +
												"FROM job_items INNER JOIN jobs " +
												"ON job_items.job_id = jobs.job_id";

			var query = client.query(queryString, function(queryErr, info) {
				if (queryErr) {
					console.log(queryErr);
					return reply(queryErr).code(400);
				} else {
					console.log(info.rows);
					return reply(info.rows);
				}
			});
		});
	},

// -------------------------------------------------- \\

	// getJobItems : function(request, reply) {

	// 	var results = [];
	// 	var id = request.params.id;

	// 	pg.connect(conString, function(err, client, done) {

	// 		if (err) {
	// 			console.log("getJobItems handler error: ", err);
	// 		}
	// 		var query = client.query("SELECT * FROM job_items WHERE id=($1)", [id]);

	// 		query.on("row", function(row) {
	// 			results.push(row);
	// 		});

	// 		query.on("end", function() {
	// 			client.end();
	// 			return reply(results);
	// 		});
	// 	});
	// },

	createJobItem : function(request, reply) {

		var entry = request.payload;

		var itemData = {
			job_id : 			entry.job_id,
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
			notes: 				entry.notes 			|| "",
			createdat: 		new Date(),
			updatedat: 		new Date()
		};

		pg.connect(conString, function(err, client, done) {

			if (err) {
				console.log("createJobItem handler error: ", err);
			}

			var item = [
				itemData.job_id,
				itemData.product,
				itemData.description,
				itemData.glass,
				itemData.metal,
				itemData.flex,
				itemData.bulb,
				itemData.qty_req,
				itemData.qty_hot,
				itemData.qty_cold,
				itemData.qty_assem,
				itemData.qty_packed,
				itemData.notes,
				itemData.createdat,
				itemData.updatedat
				];

			client.query("INSERT INTO job_items (job_id, product, description, glass, metal, " +
				"flex, bulb, qty_req, qty_hot, qty_cold, qty_assem, qty_packed, notes, createdat, updatedat) values" +
				"($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *",
				item,	function(errInsert, info, res) {
					if (errInsert) {
						console.log("err: ", errInsert);
					}
					if (info.rowCount === 1) {
						reply(info.rows[0]);
					} else {
						reply(errInsert);
					}
				});
		});
	},

	updateJobItem : function(request, reply) {

		var data = request.payload;
		var item_id = request.params.item;

		var fieldsToUpdate = Object.keys(data);

		if(fieldsToUpdate.length === 0) {
			return reply("No fields passed");
		}

		pg.connect(conString, function(err, client, done) {

			if (err) {
				console.log("updateJobItems handler error: ", err);
			}

			var string = "UPDATE job_items SET updatedat=" + new Date() + " ";

			var items = fieldsToUpdate.map(function(cell, i) {
				string += cell + "=($" + (i + 2) + ") ";
				if (i < fieldsToUpdate.length - 1) {
					string += ", ";
				}
				return data[cell];
			});

			client.query(string + "WHERE item_id=($1) RETURNING *", [item_id].concat(items), function(errInsert, info, res) {
				console.log(errInsert, info, res);
				if(info.rowCount === 1) {
					return reply(info.rows[0]);
				} else {
					return reply(errInsert);
				}
			});
		});
	},

	deleteJobItem : function(request, reply) {
		var id = request.params.item;

		pg.connect(conString, function(err, client, done) {

			if (err) {
				console.log("deleteJobItems handler error: ", err);
			}

			client.query("DELETE FROM job_items WHERE item_id=($1)", [id], function(errDelete, info) {
				if (errDelete) {
					return reply(errDelete);
				} else {
					return reply().code(204);
				}
			});
		});
	},

// // -------------------------------------------------- \\

	getSelections : function(request, reply) {

		pg.connect(conString, function(err, client, done) {
			if (err) {
				return reply("getSelections handler error", err).code(400);
			}

			client.query("SELECT * FROM selections", function (getErr, info) {
					if (getErr) {
						return reply(getErr).code(400);
					} else {
						var formattedSelections = {};
						info.rows.forEach(function(selection) {
							if(!formattedSelections[selection.type]) {
								formattedSelections[selection.type] = [];
							}
							formattedSelections[selection.type].push(selection);
						});
						return reply(formattedSelections);
					}
			});
		});
	},

	createSelection : function(request, reply) {

		var data = request.payload;

		pg.connect(conString, function(err, client, done) {
			if (err) {
				reply("createSelection handler error: ", err).code(400);
			}

			client.query("INSERT INTO selections (type, label) values ($1, $2) RETURNING *",
				[data.type, data.label], function(insertErr, info) {
					if (insertErr) {
						return reply(insertErr).code(400);
					} else {
						return reply(info.rows[0]);
					}
				});
			});
		},

// // -------------------------------------------------- \\

	getProductsTable : function(request, reply) {

		var saleable = request.query.saleable;

		pg.connect(conString, function(err, client, done) {
			if (err) {
				console.log(err);
				reply(err).code(400);
			}

			var queryString = "SELECT * FROM products";
			if(saleable) {
				queryString += " WHERE saleable=true";
			}

			client.query(queryString, function(getErr, info) {
				if (getErr) {
					return reply(getErr).code(400);
				} else {
					return reply(info.rows);
				}
			});
		});
	},

	createProduct : function(request, reply) {

		var data = request.payload;
		var newProduct = [
			data.type,
			data.name,
			data.description || "",
			data.active || true,
			data.saleable
		];

		pg.connect(conString, function(err, client, done) {
			if (err) {
				reply("createProduct handler error:", err).code(400);
			}

			client.query("INSERT INTO products (type, name, description, active, saleable) values ($1, $2, $3, $4, $5) RETURNING *",
				newProduct, function(createErr, info) {
					if (createErr) {
						return reply(createErr).code(400);
					} else {
						return reply(info.rows[0]);
					}
				});
		});
	},


	updateProduct : function(request, reply) {

		var data = request.payload;
		var product = request.params.id;

		var fieldsToUpdate = Object.keys(data);

		if(fieldsToUpdate.length === 0) {
			return reply("No fields passed");
		}

		pg.connect(conString, function(err, client, done) {

			if (err) {
				console.log("updateProduct handler error: ", err);
			}

			var string = "UPDATE products SET ";

			var items = fieldsToUpdate.map(function(cell, i) {
				string += cell + "=($" + (i + 2) + ") ";
				if (i < fieldsToUpdate.length - 1) {
					string += ", ";
				}
				return data[cell];
			});
			console.log(string);

			client.query(string + "WHERE item_id=($1) RETURNING *", [product].concat(items), function(errInsert, info, res) {
				console.log(errInsert, info, res);
				if(info.rowCount === 1) {
					return reply(info.rows[0]);
				} else {
					return reply(errInsert);
				}
			});
		});
	},

	deleteProduct : function(request, reply) {

		var id = request.payload.id;

		pg.connect(conString, function(err, client, done) {
			if (err) {
				reply("deleteProduct handler error:", err).code(400);
			}

			client.query("DELETE FROM products WHERE id=($1)", [id], function(errDelete, info) {
				if (errDelete) {
					return reply(errDelete);
				} else {
					return reply().code(204);
				}
			});
		});
	},

// // -------------------------------------------------- \\

	getContactsTable : function(request, reply) {

		pg.connect(conString, function(err, client, done) {
			if (err) {
				reply("getContactsTable handler error:", err).code(400);
			}

			client.query("SELECT * FROM contacts", function(getErr, info) {
				if (getErr) {
					return reply(getErr).code(400);
				} else {
					return reply(info.rows);
				}
			});
		});
	},

	createContact : function(request, reply) {

		var data = request.payload;

		var newContact = [
			data.id,
			data.type,
			data.name,
			data.active || true
		];

		pg.connect(conString, function(err, client, done) {
			if (err) {
				reply("createContact handler error:", err).code(400);
			}

			client.query("INSERT INTO contacts (id, type, name, active) values ($1, $2, $3, $4) RETURNING *",
				newContact, function(createErr, info) {
					if (createErr) {
						return reply(createErr).code(400);
					} else {
						return reply(info.rows[0]);
					}
				});
		});
	},

	updateContact : function(request, reply) {

		var data = request.payload;
		var contact = request.params.id;

		var fieldsToUpdate = Object.keys(data);

		if(fieldsToUpdate.length === 0) {
			return reply("No fields passed");
		}

		pg.connect(conString, function(err, client, done) {

			if (err) {
				console.log("updateContact handler error: ", err);
			}

			var string = "UPDATE contacts SET ";

			var items = fieldsToUpdate.map(function(cell, i) {
				string += cell + "=($" + (i + 2) + ") ";
				if (i < fieldsToUpdate.length - 1) {
					string += ", ";
				}
				return data[cell];
			});
			console.log(string);

			client.query(string + "WHERE item_id=($1) RETURNING *", [contact].concat(items), function(errInsert, info, res) {
				console.log(errInsert, info, res);
				if(info.rowCount === 1) {
					return reply(info.rows[0]);
				} else {
					return reply(errInsert);
				}
			});
		});
	},

	deleteContact : function(request, reply) {

		var id = request.payload.id;

		pg.connect(conString, function(err, client, done) {
			if (err) {
				reply("deleteContact handler error:", err).code(400);
			}

			client.query("DELETE FROM contacts WHERE id=($1)", [id], function(errDelete, info) {
				if (errDelete) {
					return reply(errDelete);
				} else {
					return reply().code(204);
				}
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
					request.auth.session.clear();
					request.auth.session.set(profile);
					return reply.redirect("/");
				} else if (results.length <= 0) {
					return reply("You must be an authenticated user to use this application.");
				}
			});
		});
	},

	logout : function(request, reply) {

		request.auth.session.clear();
		return reply("Succesfully logged out");
	}

};

module.exports = handler;
