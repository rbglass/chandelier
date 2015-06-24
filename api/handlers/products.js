"use strict";
var pg         = require("pg");
var conStr     = require("../db");

module.exports = {

	getAll: function(req, reply) {
		var saleable = req.query.saleable;
		var sortBy = req.query.field || "name";
		var sortDir = req.query.asc === "false" ? "DESC" : "ASC";
		var sortString = sortBy + " " + sortDir;

		pg.connect(conStr, function(err, client, done) {
			if (err) {
				done();
				return reply(err).code(400);
			}

			var queryString = "SELECT * FROM products";
			if(saleable) {
				queryString += " WHERE saleable=true";
			}
			queryString += " ORDER BY " + sortString;

			client.query(queryString, function(getErr, info) {
				done();
				if (getErr) {
					return reply(getErr).code(400);
				} else {
					return reply(info.rows);
				}
			});
		});
	},

	create: function(req, reply) {
		var data = req.payload;
		var newProduct = [
			data.type || "Other",
			data.name,
			data.description || "",
			data.active || true,
			data.saleable || true
		];

		pg.connect(conStr, function(err, client, done) {
			if (err) {
				done();
				return reply("createProduct handler error:", err).code(400);
			}

			client.query("INSERT INTO products (type, name, description, active, saleable) values ($1, $2, $3, $4, $5) RETURNING *",
				newProduct, function(createErr, info) {
					done();
					if (createErr) {
						return reply(createErr).code(400);
					} else {
						return reply(info.rows[0]);
					}
			});
		});
	},

	update: function(req, reply) {
		var data = req.payload;
		var product = req.params.id;

		var fieldsToUpdate;

		try {
			fieldsToUpdate = Object.keys(data);
		} catch(e) {
			return reply("No fields passed").code(400);
		}

		if(fieldsToUpdate.length === 0) {
			return reply("No fields passed").code(400);
		}

		pg.connect(conStr, function(err, client, done) {

			if (err) {
				done();
				console.log("updateProduct handler error: ", err);
				return reply().code(400);
			}

			var string = "UPDATE products SET ";

			var items = fieldsToUpdate.map(function(cell, i) {
				string += cell + "=($" + (i + 2) + ") ";
				if (i < fieldsToUpdate.length - 1) {
					string += ", ";
				}
				return data[cell];
			});

			client.query(string + "WHERE id=($1) RETURNING *", [product].concat(items), function(errInsert, info, res) {
				done();
				if(errInsert) {
					return reply().code(400);
				} else if(info.rowCount === 1) {
					return reply(info.rows[0]);
				} else {
					return reply(errInsert);
				}
			});
		});
	},

	delete: function(req, reply) {
		var id = req.params.id;

		pg.connect(conStr, function(err, client, done) {
			if (err) {
				done();
				return reply("deleteProduct handler error:", err).code(400);
			}

			client.query("DELETE FROM products WHERE id=($1)", [id], function(errDelete, info) {
				done();
				if (errDelete) {
					return reply(errDelete);
				} else {
					return reply().code(204);
				}
			});
		});
	}
};
