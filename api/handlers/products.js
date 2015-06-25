"use strict";
var products = require("../models/products");

module.exports = {

	getAll: function(req, reply) {
		var opts = {
			sortBy: req.query.field,
			asc   : req.query.asc
		};

		products.getAll(opts, function(err, allProducts) {
			if (err) reply(err).code(400);
			else     reply(allProducts);
		});
	},

	create: function(req, reply) {
		var data = req.payload;

		products.create(data, function(err, product) {
			if (err) reply(err).code(400);
			else     reply(product);
		});
	},

	update: function(req, reply) {
		var data = req.payload;
		var id = req.params.id;

		products.update(id, data, function(err, updatedProduct) {
			if (err) reply(err).code(400);
			else     reply(updatedProduct);
		});
	},

	delete: function(req, reply) {
		var id = req.params.id;

		products.delete(id, function(err, deletedId) {
			if (err) reply(err).code(400);
			else     reply(id).code(204);
		});
	}
};
