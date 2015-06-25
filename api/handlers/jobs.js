"use strict";
var jobs       = require("../models/jobs");
var toPDF      = require("../utils/pdfMaker");
var formatter  = require("../utils/formatter");
var objToArray = require("../utils/objToArray");

module.exports = {

	getAll: function(req, reply) {
		var opts = {
			sortBy: req.query.field,
			asc   : req.query.asc
		};

		jobs.getAll(opts, function(err, allJobs) {
			if (err) reply(err).code(400);
			else     reply(allJobs.map(formatter.job));
		});
	},

	getSingle: function(req, reply) {
		var id = req.params.id;

		jobs.getSingle(id, null, function(err, singleJob, items) {
			if (err) return reply(err).code(400);

			function replyWithPDF(doc) {
				reply(doc)
					.type("application/pdf")
					.header("Content-Disposition", "inline; filename=" +
								"RB" + id + "_specification.pdf");
			}

			var wantsPDF  = req.query.pdf;
			var prettyJob = formatter.jobWithItems(singleJob, items);

			if (wantsPDF) toPDF(prettyJob, replyWithPDF);
			else          reply(prettyJob);
		});
	},

	create: function(req, reply) {
		jobs.create(function(err, singleJob) {
			if (err) reply(err).code(400);
			else     reply(formatter.job(singleJob));
		});
	},

	update: function(req, reply) {
		var id = req.params.id;
		var data = req.payload;

		jobs.update(id, data, function(err, newJob) {
			if (err) reply(err).code(400);
			else     reply(formatter.job(newJob));
		});
	}
};
