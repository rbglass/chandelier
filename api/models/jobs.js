"use strict";
var assign      = require("object-assign");
var connect     = require("../db");
var schema      = require("./schema");
var formatter   = require("../utils/formatter");
var updateQuery = require("../lib/updateQuery");
var sortQuery   = require("../lib/sortQuery");
var crud        = require("../lib/crud");

var jobsModel = crud({
	tableName : "jobs",
	primaryKey: "job_id",
	formatterS: formatter.job,
	schema    : schema.jobs
});

jobsModel.getAll = function(opts, cb) {
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
			else        cb(null, info.rows.map(formatter.job));
		});
	});
};

jobsModel.getSingle = function(id, opts, cb) {
	var jobString, itemString;

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
				else         cb(null, formatter.jobWithItems(jobInfo.rows[0], itemInfo.rows));
			});
		});
	});
};

module.exports = jobsModel;
