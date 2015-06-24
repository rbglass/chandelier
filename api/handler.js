"use strict";

var path  = require("path");
var index = path.join(__dirname, "/../public/index.html");
var config = require("./config.js");
var objectAssign = require("object-assign");
var pg = require("pg");
var pdfMaker = require("./utils/pdfMaker");
var formatter = require("./utils/formatter");
var conString = require("./models/database");

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

		var sortBy = request.query.field || "shipping_date";
		var sortDir = request.query.asc === "false" ? "DESC" : "ASC";
		var sortString = sortBy + " " + sortDir;

		pg.connect(conString, function(err, client, done) {
			if (err) {
				done();
				console.log("getJobsTable handler error: ", err);
				return reply().code(400);
			}

			var queryString = "SELECT * FROM jobs ORDER BY " + sortString + " NULLS LAST";

			var query = client.query(queryString, function(jobErr, info) {
				done();
				if (jobErr) {
					return reply(jobErr).code(400);
				} else {
					return reply(info.rows.map(formatter.job));
				}
			});
		});
	},

// // -------------------------------------------------- \\

	createJob : function(request, reply) {

		var entry = request.payload;
		var jobData = {
			client: 				entry.client || "",
			project: 				entry.project || "",
			job_status: 		entry.job_status || "TBC",
			order_type: 		entry.order_type || "Standard",
			shipping_date: 	entry.shipping_date,
			shipping_notes: entry.shipping_notes || "",
			parts_status: 	entry.parts_status || "Not Started",
			parts_notes:    entry.parts_notes || "",
			invoice_notes:  entry.invoice_notes || "",
			payment:        entry.payment || "",
			notes:          entry.notes || "",
			createdat: 		  new Date(),
			updatedat: 		  new Date()
		};

		pg.connect(conString, function(err, client, done) {

			if (err) {
				done();
				console.log("createJob handler error: ", err);
				return reply().code(400);
			}

			client.query("INSERT INTO jobs (client, project, job_status, order_type, " +
				"shipping_date, shipping_notes, parts_status, parts_notes, invoice_notes, " +
				"payment, notes, createdat, updatedat) values " +
				"($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING job_id",
				[
					jobData.client,
					jobData.project,
					jobData.job_status,
					jobData.order_type,
					jobData.shipping_date,
					jobData.shipping_notes,
					jobData.parts_status,
					jobData.parts_notes,
					jobData.invoice_notes,
					jobData.payment,
					jobData.notes,
					jobData.createdat,
					jobData.updatedat
				], function(errInsert, info) {
					done();
					if (errInsert) {
						console.log(errInsert);
						return reply(errInsert).code(400);
					} else if (info.rowCount === 1) {
						return reply(formatter.job(info.rows[0]));
					} else {
						return reply(errInsert);
					}
				});
		});
	},

	updateJob : function(request, reply) {

		var data = request.payload;

		delete data.createdat;
		data.updatedat = new Date();

		var job_id = request.params.id;
		var fieldsToUpdate = Object.keys(data);
		pg.connect(conString, function(err, client, done) {

			if (err) {
				done();
				console.log("updateJob handler error: ", err);
				return reply().code(400);
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
				done();
				if (errInsert) {
					console.log(errInsert);
					return reply(errInsert).code(400);
				} else if(info.rowCount === 1) {
					return reply(formatter.job(info.rows[0]));
				} else {
					return reply(errInsert).code(400);
				}
			});
		});
	},

	deleteJob : function(request, reply) {

		var id = request.payload.job_id;

		pg.connect(conString, function(err, client, done) {

			if (err) {
				done();
				console.log("deleteJob handler error: ", err);
				return reply().code(400);
			}

			client.query("DELETE FROM jobs WHERE job_id=($1)", [id], function(delErr, info) {
				done();
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
				done();
				console.log("getSingleJob handler error: ", err);
				return reply.code(400);
			}

			var query = client.query("SELECT * FROM jobs WHERE job_id=($1)", [id], function(errJob, info) {
				if (errJob) {
					return reply().code(404);
				} else {
					client.query("SELECT * FROM job_items WHERE job_id=($1) ORDER BY qty_req DESC", [id], function(errItems, moreInfo) {
						var jobObj = formatter.jobWithItems(info.rows[0], moreInfo && moreInfo.rows);
						done();

						function setReplyAsPDF(doc) {
							reply(doc)
								.type("application/pdf")
								.header("Content-Disposition", "inline; filename=" +
											"RB" + id + "_specification.pdf");
						}

						if (pdf) {
							pdfMaker(jobObj, setReplyAsPDF);
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

		var sortBy = request.query.field || "shipping_date";
		var sortDir = request.query.asc === "false" ?  "DESC" : "ASC";
		var sortString = sortBy + " " + sortDir;

		pg.connect(conString, function(err, client, done) {

			if (err) {
				done();
				console.log("getJobItemsTable handler error: ", err);
				return reply().code(400);
			}

			var queryString = "SELECT job_items.*, jobs.shipping_date, jobs.job_status, jobs.payment, jobs.client " +
												"FROM job_items INNER JOIN jobs " +
												"ON job_items.job_id = jobs.job_id ORDER BY " + sortString + " NULLS LAST";

			var query = client.query(queryString, function(queryErr, info) {
				done();
				if (queryErr) {
					console.log(queryErr);
					return reply(queryErr).code(400);
				} else {
					return reply(info.rows);
				}
			});
		});
	},

// -------------------------------------------------- \\


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
			notes: 				entry.notes 			|| "",
			createdat: 		new Date(),
			updatedat: 		new Date()
		};

		pg.connect(conString, function(err, client, done) {

			if (err) {
				done();
				console.log("createJobItem handler error: ", err);
				return reply().code(400);
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
				itemData.notes,
				itemData.createdat,
				itemData.updatedat
				];

			client.query("INSERT INTO job_items (job_id, product, description, glass, metal, " +
				"flex, bulb, qty_req, qty_hot, qty_cold, qty_assem, notes, createdat, updatedat) values" +
				"($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
				item,	function(errInsert, info, res) {
					var joinedItem;
					done();
					if (errInsert) {
						console.log("err: ", errInsert);
					} else if (info.rowCount === 1) {
						joinedItem = objectAssign(entry, info.rows[0]);
						reply(joinedItem);
					} else {
						reply(errInsert);
					}
				});
		});
	},

	updateJobItem : function(request, reply) {

		var data = request.payload;
		var item_id = request.params.item;

		delete data.job_id;
		delete data.item_id;
		delete data.updatedat;
		delete data.createdat;
		delete data.shipping_date;
		delete data.job_status;
		delete data.payment;
		delete data.client;

		var fieldsToUpdate;

		try {
			fieldsToUpdate = Object.keys(data);
		} catch(e) {
			return reply("No fields passed").code(400);
		}

		if(fieldsToUpdate.length === 0) {
			return reply("No fields passed").code(400);
		}

		pg.connect(conString, function(err, client, done) {
			if (err) {
				done();
				console.log("updateJobItems handler error: ", err);
				return reply().code(400);
			}

			var string = "UPDATE job_items SET ";

			var items = fieldsToUpdate.map(function(cell, i) {
				string += cell + "=($" + (i + 2) + ") ";
				if (i < fieldsToUpdate.length - 1) {
					string += ", ";
				}
				return data[cell];
			});

			client.query(string + "WHERE item_id=($1)", [item_id].concat(items), function(errInsert, info, res) {
				done();
				if(errInsert) {
					console.log(errInsert);
					return reply(errInsert).code(400);
				} else if(info && info.rowCount === 1) {
					return reply().code(200);
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
				done();
				console.log("deleteJobItems handler error: ", err);
				return reply().code(400);
			}

			client.query("DELETE FROM job_items WHERE item_id=($1)", [id], function(errDelete, info) {
				done();
				if (errDelete) {
					console.log(errDelete);
					return reply(errDelete);
				} else {
					return reply(id).code(204);
				}
			});
		});
	},

// // -------------------------------------------------- \\

	getSelections : function(request, reply) {

		pg.connect(conString, function(err, client, done) {
			if (err) {
				done();
				return reply("getSelections handler error", err).code(400);
			}

			client.query("SELECT * FROM selections", function (getErr, info) {
				done();
				if (getErr) {
					console.log(getErr);
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
				done();
				return reply("createSelection handler error: ", err).code(400);
			}

			client.query("INSERT INTO selections (type, label) values ($1, $2) RETURNING *",
				[data.type, data.label], function(insertErr, info) {
					done();
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
		var sortBy = request.query.field || "name";
		var sortDir = request.query.asc === "false" ? "DESC" : "ASC";
		var sortString = sortBy + " " + sortDir;

		pg.connect(conString, function(err, client, done) {
			if (err) {
				done();
				return reply(err).code(400);
			}

			var queryString = "SELECT * FROM products";
			if(saleable) {
				queryString += " WHERE saleable=true";
			}
			queryString += " ORDER BY " + sortString;

			client.query(queryString, function(getErr, info) {
				done();
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
			data.type || "Other",
			data.name,
			data.description || "",
			data.active || true,
			data.saleable || true
		];

		pg.connect(conString, function(err, client, done) {
			if (err) {
				done();
				return reply("createProduct handler error:", err).code(400);
			}

			client.query("INSERT INTO products (type, name, description, active, saleable) values ($1, $2, $3, $4, $5) RETURNING *",
				newProduct, function(createErr, info) {
					done();
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

		var fieldsToUpdate;

		try {
			fieldsToUpdate = Object.keys(data);
		} catch(e) {
			return reply("No fields passed").code(400);
		}

		if(fieldsToUpdate.length === 0) {
			return reply("No fields passed").code(400);
		}

		pg.connect(conString, function(err, client, done) {

			if (err) {
				done();
				console.log("updateProduct handler error: ", err);
				return reply().code(400);
			}

			var string = "UPDATE products SET ";

			var items = fieldsToUpdate.map(function(cell, i) {
				string += cell + "=($" + (i + 2) + ") ";
				if (i < fieldsToUpdate.length - 1) {
					string += ", ";
				}
				return data[cell];
			});

			client.query(string + "WHERE id=($1) RETURNING *", [product].concat(items), function(errInsert, info, res) {
				done();
				if(errInsert) {
					return reply().code(400);
				} else if(info.rowCount === 1) {
					return reply(info.rows[0]);
				} else {
					return reply(errInsert);
				}
			});
		});
	},

	deleteProduct : function(request, reply) {

		var id = request.params.id;

		pg.connect(conString, function(err, client, done) {
			if (err) {
				done();
				return reply("deleteProduct handler error:", err).code(400);
			}

			client.query("DELETE FROM products WHERE id=($1)", [id], function(errDelete, info) {
				done();
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
				done();
				return reply("getContactsTable handler error:", err).code(400);
			}

			client.query("SELECT * FROM contacts", function(getErr, info) {
				done();
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
				done();
				return reply("createContact handler error:", err).code(400);
			}

			client.query("INSERT INTO contacts (id, type, name, active) values ($1, $2, $3, $4) RETURNING *",
				newContact, function(createErr, info) {
					done();
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

		var fieldsToUpdate;

		try {
			fieldsToUpdate = Object.keys(data);
		} catch(e) {
			return reply("No fields passed").code(400);
		}

		if(fieldsToUpdate.length === 0) {
			return reply("No fields passed").code(400);
		}

		pg.connect(conString, function(err, client, done) {

			if (err) {
				done();
				console.log("updateContact handler error: ", err);
				return reply().code(400);
			}

			var string = "UPDATE contacts SET ";

			var items = fieldsToUpdate.map(function(cell, i) {
				string += cell + "=($" + (i + 2) + ") ";
				if (i < fieldsToUpdate.length - 1) {
					string += ", ";
				}
				return data[cell];
			});

			client.query(string + "WHERE item_id=($1) RETURNING *", [contact].concat(items), function(errInsert, info, res) {
				done();
				if(errInsert) {
					return reply().code(400);
				} else if(info.rowCount === 1) {
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
				done();
				return reply("deleteContact handler error:", err).code(400);
			}

			client.query("DELETE FROM contacts WHERE id=($1)", [id], function(errDelete, info) {
				done();
				if (errDelete) {
					reply(errDelete);
				} else {
					reply().code(204);
				}
			});
		});
	},


// // -------------------------------------------------- \\

	login : function(request, reply) {

		var creds = request.auth.credentials;

		var profile = {
			auth_method : "google",
			email       : creds.profile.raw.email
		};

		pg.connect(conString, function(err, client, done) {
			var results = [];

			if (err) {
				done();
				console.log("login error: ", err);
			}

			var query = client.query("SELECT * FROM users WHERE email=($1)", [profile.email]);

			query.on("row", function(row){
				results.push(row);
			});

			query.on("end", function() {
				done();
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

function setReplyHeaders(reply) {

}
