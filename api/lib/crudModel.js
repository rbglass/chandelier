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
	var secondSort   = config.secondSort;

	function validate(data) {
		if (!config.schema) return data;

		if (config.preValidate) {
			data = config.preValidate(data);
		}

		var result = Joi.validate(data, config.schema, {stripUnknown: true});
		if (result.error) return false;
		else              return result.value;
	}

	function createOrUpdate(cb, command, data, before) {
		connect(function(err, cl, done) {
			if(err) return cb(err);

			cl.query(command, data, function(errC, info) {
				var formatted, combined;

				done();
				if (errC) {
					cb(errC);
				} else {
					combined = assign(before, info.rows[0]);
					formatted = formatterS ? formatterS(combined) : combined;
					cb(null, formatted);
				}
			});
		});
	}

	return {
		getAll: function(opts, cb) {
			var sortBy, sortString, mainString, queryString;

			sortBy      = opts && opts.sortBy || sort;
			sortString  = sortQuery(sortBy, opts && opts.asc, secondSort);
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

			createOrUpdate(cb, q.command, q.data, before);
		},

		update: function(id, data, cb) {
			var before = data;
			var result = validate(data);

			if (result === false) return cb("Validation failure");

			var q = updateQuery(table, id, pkey, result);

			createOrUpdate(cb, q.command, q.data, before);
		},

		delete: function(id, cb) {
			var q = deleteQuery(table, id, pkey);

			connect(function(err, client, done) {
				if (err) return cb(err);

				client.query(q.command, q.data, function(errDelete, info) {
					done();
					if (errDelete) cb(errDelete);
					else           cb(null, id);
				});
			});
		}
	};
};
