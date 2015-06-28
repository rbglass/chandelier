"use strict";
var Joi         = require("joi");
var assign      = require("object-assign");
var connect     = require("../db");
var insertQuery = require("./insertQuery");
var updateQuery = require("./updateQuery");
var deleteQuery = require("./deleteQuery");
var sortQuery   = require("./sortQuery");

module.exports = function(config) {
	var table        = config.tableName;
	var sort         = config.defaultSort;
	var pkey         = config.primaryKey;
	var customSelect = config.customSelect;
	var formatterM   = config.formatterM;
	var formatterS   = config.formatterS;

	function validate(data) {
		if (!config.schema) return data;

		var result = Joi.validate(data, config.schema, {stripUnknown: true});
		if (result.error) return false;
		else              return result.value;
	}

	return {
		getAll: function(opts, cb) {
			var sortBy, sortString, mainString, queryString;

			sortBy      = opts && opts.sortBy || sort;
			sortString  = sortQuery(sortBy, opts && opts.asc);
			mainString  = customSelect || "SELECT * FROM " + table + " ";
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
			var before = data || {};
			var result = validate(data);

			if (result === false) return cb("Validation failure");

			var q = insertQuery(table, result);

			connect(function(err, client, done) {
				if(err) return cb(err);

				client.query(q.command, q.data, function(errInsert, info) {
					done();
					if (errInsert) cb(errInsert);
					else           cb(null, (formatterS && formatterS(assign(before, info.rows[0]))) ||
																		assign(before, info.rows[0]));
				});
			});
		},

		update: function(id, data, cb) {
			var before = data;
			var result = validate(data);

			if (result === false) return cb("Validation failure");

			var q = updateQuery(table, id, pkey, result);

			connect(function(err, client, done) {
				if (err) return cb(err);

				client.query(q.command, q.data, function(updateErr, info) {
					done();
					if (updateErr) cb(updateErr);
					else           cb(null, formatterS && formatterS(assign(before, info.rows[0])) ||
																	assign(before, info.rows[0]));
						// vile, split that shit up
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
