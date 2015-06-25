"use strict";
var connect     = require("../db");
var updateQuery = require("./updateQuery");
var sortQuery   = require("./sortQuery");

module.exports = {

	getAll: function(opts, cb) {
		var sortBy, sortString, mainString, queryString;

		sortBy = opts && opts.sortBy || "name";
		sortString = sortQuery(sortBy, opts && opts.asc);

		mainString = "SELECT * FROM products ";

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

	create: function(data, cb) {
		var queryString = "INSERT INTO products DEFAULT VALUES RETURNING *";

		connect(function(err, client, done) {
			if(err) return cb(err);

			client.query(queryString, function(errInsert, info) {
				done();
				if (errInsert) cb(errInsert);
				else           cb(null, info.rows[0]);
			});
		});
	},

	update: function(id, data, cb) {
		delete data.id;
		var q = updateQuery("products", id, "id", data);

		connect(function(err, client, done) {
			if (err) return cb(err);

			client.query(q.command, q.data, function(updateErr, info) {
				done();
				if (updateErr) cb(updateErr);
				else           cb(null, info.rows[0]);
			});

		});
	},

	delete: function(id, cb) {
		var deleteString = "DELETE FROM products WHERE id=($1)";

		connect(function(err, client, done) {
			if (err) return cb(err);

			client.query(deleteString, [id], function(errDelete, info) {
				done();
				if (errDelete) cb(errDelete);
				else           cb(null, id);
			});
		});
	}
};
