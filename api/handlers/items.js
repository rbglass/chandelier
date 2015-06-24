"use strict";
var pg         = require("pg");
var assign     = require("object-assign");
var conStr     = require("../db");
var toPDF      = require("../utils/pdfMaker");
var formatter  = require("../utils/formatter");

module.exports = {

	getAll: function(req, reply) {
		var sortBy = req.query.field || "shipping_date";
		var sortDir = req.query.asc === "false" ?  "DESC" : "ASC";
		var sortString = sortBy + " " + sortDir;

		pg.connect(conStr, function(err, client, done) {

			if (err) {
				done();
				console.log("getJobItemsTable handler error: ", err);
				return reply().code(400);
			}

			var queryString = "SELECT job_items.*, jobs.shipping_date, jobs.job_status, jobs.payment, jobs.client " +
												"FROM job_items INNER JOIN jobs " +
												"ON job_items.job_id = jobs.job_id ORDER BY " + sortString + " NULLS LAST";

			var query = client.query(queryString, function(queryErr, info) {
				done();
				if (queryErr) {
					console.log(queryErr);
					return reply(queryErr).code(400);
				} else {
					return reply(info.rows);
				}
			});
		});
	},

	create: function(req, reply) {
		var entry = req.payload;

		var itemData = {
			job_id : 			entry.job_id,
			product: 			entry.product 		|| "",
			description: 	entry.description || "",
			glass: 				entry.glass 			|| "",
			metal: 				entry.metal 			|| "",
			flex: 				entry.flex 				|| "",
			bulb: 				entry.bulb 				|| "",
			qty_req: 			entry.qty_req 		|| 0,
			qty_hot: 			entry.qty_hot 		|| 0,
			qty_cold: 		entry.qty_cold 		|| 0,
			qty_assem: 		entry.qty_assem 	|| 0,
			notes: 				entry.notes 			|| "",
			createdat: 		new Date(),
			updatedat: 		new Date()
		};

		pg.connect(conStr, function(err, client, done) {

			if (err) {
				done();
				console.log("createJobItem handler error: ", err);
				return reply().code(400);
			}

			var item = [
				itemData.job_id,
				itemData.product,
				itemData.description,
				itemData.glass,
				itemData.metal,
				itemData.flex,
				itemData.bulb,
				itemData.qty_req,
				itemData.qty_hot,
				itemData.qty_cold,
				itemData.qty_assem,
				itemData.notes,
				itemData.createdat,
				itemData.updatedat
				];

			client.query("INSERT INTO job_items (job_id, product, description, glass, metal, " +
				"flex, bulb, qty_req, qty_hot, qty_cold, qty_assem, notes, createdat, updatedat) values" +
				"($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
				item,	function(errInsert, info, res) {
					var joinedItem;
					done();
					if (errInsert) {
						console.log("err: ", errInsert);
					} else if (info.rowCount === 1) {
						joinedItem = assign(entry, info.rows[0]);
						reply(joinedItem);
					} else {
						reply(errInsert);
					}
				});
		});
	},

	update: function(req, reply) {
		var data = req.payload;
		var item_id = req.params.item;

		delete data.job_id;
		delete data.item_id;
		delete data.updatedat;
		delete data.createdat;
		delete data.shipping_date;
		delete data.job_status;
		delete data.payment;
		delete data.client;

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
				console.log("updateJobItems handler error: ", err);
				return reply().code(400);
			}

			var string = "UPDATE job_items SET ";

			var items = fieldsToUpdate.map(function(cell, i) {
				string += cell + "=($" + (i + 2) + ") ";
				if (i < fieldsToUpdate.length - 1) {
					string += ", ";
				}
				return data[cell];
			});

			client.query(string + "WHERE item_id=($1)", [item_id].concat(items), function(errInsert, info, res) {
				done();
				if(errInsert) {
					console.log(errInsert);
					return reply(errInsert).code(400);
				} else if(info && info.rowCount === 1) {
					return reply().code(200);
				} else {
					return reply(errInsert);
				}
			});
		});
	},

	delete: function(req, reply) {
		var id = req.params.item;

		pg.connect(conStr, function(err, client, done) {
			if (err) {
				done();
				console.log("deleteJobItems handler error: ", err);
				return reply().code(400);
			}

			client.query("DELETE FROM job_items WHERE item_id=($1)", [id], function(errDelete, info) {
				done();
				if (errDelete) {
					console.log(errDelete);
					return reply(errDelete);
				} else {
					return reply(id).code(204);
				}
			});
		});
	}

};
