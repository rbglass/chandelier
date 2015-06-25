"use strict";
var jobitems   = require("../models/jobitems");

module.exports = {

	getAll: function(req, reply) {
		var opts = {
			sortBy: req.query.field,
			asc   : req.query.asc
		};

		jobitems.getAll(opts, function(err, allItems) {
			if (err) reply(err).code(400);
			else     reply(allItems);
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
		var id = req.params.id;

		jobitems.update(id, data, function(err, updatedItem) {
			if (err) reply(err).code(400);
			else     reply(updatedItem);
		});
	},

	delete: function(req, reply) {
		var id = req.params.id;

		jobitems.delete(id, function(err, deletedId) {
			if (err) reply(err).code(400);
			else     reply(id).code(204);
		});
	}
};
