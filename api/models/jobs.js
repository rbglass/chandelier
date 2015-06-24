"use strict";
var connect = require("../db");

module.exports = {

	getAll: function(opts, cb) {
		var sortBy, sortDir, sortString, mainString, queryString;

		if (opts.sortBy === "qty_items") {
			sortBy = opts.sortBy;
		} else {
			sortBy = "jobs." + (opts.sortBy || "shipping_date");
		}

		sortDir = opts.asc === "false" ? "DESC" : "ASC";
		sortString = "ORDER BY" + sortBy + " " + sortDir + " NULLS LAST";
		mainString = "SELECT jobs.*, sum(job_items.qty_req) AS qty_items " +
									"FROM jobs " +
									"LEFT JOIN job_items ON (jobs.job_id = job_items.job_id) " +
									"GROUP BY jobs.job_id ";

		queryString = mainString + sortString;

		connect(function(err, client, done) {
			if (err) return cb(err);

			client.query(queryString, function(jobErr, info) {
				done();

				if (jobErr) cb(jobErr);
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
		itemString = select("job_items") + "ORDER BY qty_req DESC";

		connect(function(err, client, done) {
			if (err) return cb(err);

			client.query(jobString, [id], function(jobErr, jobInfo) {
				if (jobErr) return cb(jobErr);

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
		var fieldsToUpdate, stuff, updateString;

		delete data.createdat;
		delete data.qty_items;
		data.updatedAt = new Date();

		fieldsToUpdate = Object.keys(data);
		updateString = "UPDATE jobs SET ";

		stuff = fieldsToUpdate.map(function(cell, i) {
			updateString += cell + "=($" + (i + 2) + ") ";
			if (i < fieldsToUpdate.length - 1) {
				updateString += ", ";
			} else {
				updateString += "WHERE job_id=($1) RETURNING *";
			}
			return data[cell];
		});

		connect(function(err, client, done) {
			if (err) return cb(err);

			client.query(updateString, [id].concat(stuff), function(updateErr, info) {
				done();

				if (updateErr) cb(updateErr);
				else           cb(null, info.rows[0]);
			});

		});
	}
};

