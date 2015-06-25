"use strict";
var connect = require("../db");
var updateQuery = require("./updateQuery");
var sortQuery   = require("./sortQuery");

module.exports = {

	getAll: function(opts, cb) {
		var sortBy, sortString, mainString, queryString;

		if (opts.sortBy === "qty_items") {
			sortBy = opts.sortBy;
		} else {
			sortBy = "jobs." + (opts.sortBy || "shipping_date");
		}

		sortString = sortQuery(sortBy, opts.asc);

		mainString = "SELECT jobs.*, sum(job_items.qty_req) AS qty_items " +
									"FROM jobs " +
									"LEFT JOIN job_items ON (jobs.job_id = job_items.job_id) " +
									"GROUP BY jobs.job_id ";

		queryString = mainString + sortString;

		connect(function(err, client, done) {
			if (err) return cb(err);

			client.query(queryString, function(errGet, info) {
				done();

				if (errGet) cb(errGet);
				else        cb(null, info.rows);
			});
		});
	},

	getSingle: function(id, opts, cb) {
		var sortBy, sortDir, sortString, mainString, jobString, itemString, selectString;

		function select(table) {
			return "SELECT * FROM " + table + " WHERE job_id=($1) ";
		}

		jobString  = select("jobs");
		itemString = select("job_items") + "ORDER BY pdf_rank ASC, qty_req DESC";

		connect(function(err, client, done) {
			if (err) return cb(err);

			client.query(jobString, [id], function(errGet, jobInfo) {
				if (errGet) return cb(errGet);

				client.query(itemString, [id], function(itemErr, itemInfo) {
					done();

					if (itemErr) cb(itemErr);
					else         cb(null, jobInfo.rows[0], itemInfo && itemInfo.rows);
				});
			});
		});
	},

	create: function(cb) {
		var insertString = "INSERT INTO jobs DEFAULT VALUES RETURNING job_id";

		connect(function(err, client, done) {
			if (err) return cb(err);

			client.query(insertString, function(createErr, jobInfo) {
				done();

				if (createErr) cb(createErr);
				else           cb(null, jobInfo.rows[0]);
			});
		});
	},

	update: function(id, data, cb) {

		if (!data.shipping_date) {
			return cb("Shipping date cannot be blank");
		}

		delete data.createdat;
		delete data.qty_items;
		data.updatedat = new Date();

		var q = updateQuery("jobs", id, "job_id", data);

		connect(function(err, client, done) {
			if (err) return cb(err);

			client.query(q.command, q.data, function(updateErr, info) {
				done();

				if (updateErr) cb(updateErr);
				else           cb(null, info.rows[0]);
			});

		});
	}
};

