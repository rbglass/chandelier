"use strict";
var jobs  = require("../models/jobs");
var crud  = require("../lib/crudHandlers");
var toPDF = require("../utils/pdfMaker");

var jobsHandler = crud(jobs);

jobsHandler.getSingle = function(req, reply) {
	var id = req.params.id;

	jobs.getSingle(id, null, function(err, jobWithItems) {
		if (err) return reply(err).code(400);

		function replyWithPDF(doc) {
			reply(doc)
				.type("application/pdf")
				.header("Content-Disposition", "inline; filename=" +
							"RB" + id + "_specification.pdf");
		}

		var wantsPDF  = req.query.pdf;

		if (wantsPDF) toPDF(jobWithItems, replyWithPDF);
		else          reply(jobWithItems);
	});
};

module.exports = jobsHandler;
