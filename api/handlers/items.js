"use strict";
var jobitems   = require("../models/jobitems");
var toPDF      = require("../utils/pdfMaker");
var formatter  = require("../utils/formatter");

module.exports = {

	getAll: function(req, reply) {
		var opts = {
			sortBy: req.query.field,
			asc   : req.query.asc
		};

		jobitems.getAll(opts, function(err, allJobs) {
			if (err) reply(err).code(400);
			else     reply(allJobs.map(formatter.job));
		});
	},

	create: function(req, reply) {
		var data = req.payload;

		jobitems.create(data, function(err, job) {
			if (err) reply(err).code(400);
			else     reply(job);
		});
	},

	update: function(req, reply) {
		var data = req.payload;
		var item_id = req.params.item;

		jobitems.update(item_id, data, function(err, updatedItem) {
			if (err) reply(err).code(400);
			else     reply(updatedItem);
		});
	},

	delete: function(req, reply) {
		var id = req.params.item;

		jobitems.delete(function(err, deletedId) {
			if (err) reply(err).code(400);
			else     reply(id).code(204);
		});
	}
};
