"use strict";

module.exports = function(model) {

	return {
		getAll: function(req, reply) {
			var opts = {
				sortBy: req.query.field,
				asc   : req.query.asc
			};

			model.getAll(opts, function(err, all) {
				if (err) reply(err).code(400);
				else     reply(all);
			});
		},

		create: function(req, reply) {
			var data = req.payload;

			model.create(data, function(err, item) {
				if (err) reply(err).code(400);
				else     reply(item);
			});
		},

		update: function(req, reply) {
			var data = req.payload;
			var id = req.params.id;

			model.update(id, data, function(err, updated) {
				if (err) reply(err).code(400);
				else     reply(updated);
			});
		},

		delete: function(req, reply) {
			var id = req.params.id;

			model.delete(id, function(err, deleted) {
				if (err) reply(err).code(400);
				else     reply(deleted).code(204);
			});
		}
	};
};
