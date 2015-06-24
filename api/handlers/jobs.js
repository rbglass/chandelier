"use strict";
var pg         = require("pg");
var conStr     = require("../db");
var toPDF      = require("../utils/pdfMaker");
var formatter  = require("../utils/formatter");
var objToArray = require("../utils/objToArray");

module.exports = {

	getAll: function(req, reply) {
		var sortBy = req.query.field || "shipping_date";

		if (sortBy !== "qty_items") {
			sortBy = "jobs." + sortBy;
		}

		var sortDir = req.query.asc === "false" ? "DESC" : "ASC";
		var sortString = sortBy + " " + sortDir;
		var joinString = "SELECT jobs.*, count(job_items.job_id) as qty_items from jobs " +
											"left join job_items on (jobs.job_id = job_items.job_id) " +
											"group by jobs.job_id ";

		pg.connect(conStr, function(err, client, done) {
			if (err) {
				done();
				console.log("getJobsTable handler error: ", err);
				return reply().code(400);
			}

			var queryString = joinString + "ORDER BY " + sortString + " NULLS LAST";

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

	getSingle: function(req, reply) {
		var id = req.params.id;
		var wantsPDF = req.query.pdf;

		var ordering = objToArray(req.query);

		pg.connect(conStr, function(err, client, done) {

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

						if (wantsPDF) {
							toPDF(jobObj, ordering, setReplyAsPDF);
						} else {
							reply(jobObj);
						}
					});
				}
			});
		});
	},

	create: function(req, reply) {
		var entry = req.payload;
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

		pg.connect(conStr, function(err, client, done) {

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

	update: function(req, reply) {
		var data = req.payload;

		delete data.createdat;
		delete data.qty_items;
		data.updatedat = new Date();

		var job_id = req.params.id;
		var fieldsToUpdate = Object.keys(data);
		pg.connect(conStr, function(err, client, done) {

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
	}
};
