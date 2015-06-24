"use strict";
var pg         = require("pg");
var conStr     = require("../db");
var formatter  = require("../utils/formatter");

module.exports = {

	getAll: function(req, reply) {

		pg.connect(conStr, function(err, client, done) {
			if (err) {
				done();
				return reply("getSelections handler error", err).code(400);
			}

			client.query("SELECT * FROM selections", function (getErr, info) {
				done();
				if (getErr) {
					console.log(getErr);
					return reply(getErr).code(400);
				} else {
					var formattedSelections = {};
					info.rows.forEach(function(selection) {
						if(!formattedSelections[selection.type]) {
							formattedSelections[selection.type] = [];
						}
						formattedSelections[selection.type].push(selection);
					});
					return reply(formattedSelections);
				}
			});
		});
	},

	create: function(req, reply) {
		var data = req.payload;

		pg.connect(conStr, function(err, client, done) {
			if (err) {
				done();
				return reply("createSelection handler error: ", err).code(400);
			}

			client.query("INSERT INTO selections (type, label) values ($1, $2) RETURNING *",
				[data.type, data.label], function(insertErr, info) {
					done();
					if (insertErr) {
						return reply(insertErr).code(400);
					} else {
						return reply(info.rows[0]);
					}
				});
			});
	}

};
