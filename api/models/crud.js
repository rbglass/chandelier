"use strict";
var connect     = require("../db");
var updateQuery = require("./updateQuery");
var deleteQuery = require("./deleteQuery");
var sortQuery   = require("./sortQuery");

module.exports = function(config) {
	var table = config.tableName;
	var sort = config.defaultSort;
	var pkey = config.primaryKey;
	var formatterM = config.formatterM;
	var formatterS = config.formatterS;

	return {
		getAll: function(opts, cb) {
			var sortBy, sortString, mainString, queryString;

			sortBy = opts && opts.sortBy || sort;
			sortString = sortQuery(sortBy, opts && opts.asc);
			mainString = "SELECT * FROM " + table + " ";
			queryString = mainString + sortString;

			connect(function(err, client, done) {
				if (err) return cb(err);

				client.query(queryString, function(errGet, info) {
					done();

					if (errGet) cb(errGet);
					else        cb(null, (formatterM && formatterM(info.rows)) ||
																info.rows);
				});
			});
		},

		create: function(data, cb) {
			var queryString = "INSERT INTO " + table + " DEFAULT VALUES RETURNING *";

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
			var q = updateQuery(table, id, pkey, data);

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
			var deleteString = deleteQuery(table, pkey);

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
};
