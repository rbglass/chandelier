"use strict";
var Joi         = require("joi");
var assign      = require("object-assign");
var connect     = require("../db");
var insertQuery = require("./insertQuery");
var updateQuery = require("./updateQuery");
var deleteQuery = require("./deleteQuery");
var sortQuery   = require("./sortQuery");

// TODO - schema for update and create

module.exports = function(config) {
	var table = config.tableName;
	var sort  = config.defaultSort;
	var pkey  = config.primaryKey;

	var customSelect = config.customSelect;

	var formatterM = config.formatterM;
	var formatterS = config.formatterS;
	var schema   = config.schema;

	return {
		getAll: function(opts, cb) {
			var sortBy, sortString, mainString, queryString;

			sortBy = opts && opts.sortBy || sort;
			sortString = sortQuery(sortBy, opts && opts.asc);
			mainString = customSelect || "SELECT * FROM " + table + " ";
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
			var newData = data;
			var result;

			if (schema) {
				result = Joi.validate(data, schema, {stripUnknown: true});
				if (result.error) return cb(result.error);
				else newData = result.value;
			}

			var q = insertQuery(table, newData);

			connect(function(err, client, done) {
				if(err) return cb(err);

				client.query(q.command, q.data, function(errInsert, info) {
					console.log(errInsert);
					done();
					if (errInsert) cb(errInsert);
					else           cb(null, (formatterS && formatterS(assign(before, info.rows[0]))) ||
																		assign(before, info.rows[0]));
				});
			});
		},

		update: function(id, data, cb) {
			var before = data;
			var newData = data;
			var result;

			if (schema) {
				result = Joi.validate(data, schema, {stripUnknown: true});
				if (result.error) return cb(result.error);
				else newData = result.value;
			}

			var q = updateQuery(table, id, pkey, newData);


			connect(function(err, client, done) {
				if (err) return cb(err);

				client.query(q.command, q.data, function(updateErr, info) {
					done();
					console.log(updateErr);
					if (updateErr) cb(updateErr);
					else           cb(null, formatterS && formatterS(assign(before, info.rows[0])) ||
																	assign(before, info.rows[0]));
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
