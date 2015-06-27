"use strict";
var connect     = require("../db");
var updateQuery = require("./updateQuery");
var sortQuery   = require("./sortQuery");
var formatter   = require("../utils/formatter");

module.exports = {

	getAll: function(opts, cb) {
		var queryString = "SELECT * FROM selections ";

		connect(function(err, client, done) {
			if (err) return cb(err);

			client.query(queryString, function(errGet, info) {
				done();

				if (errGet) cb(errGet);
				else        cb(null, formatter.products(info.rows));
			});
		});
	}
};
