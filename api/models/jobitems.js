"use strict";
var assign      = require("object-assign");
var connect     = require("../db");
var updateQuery = require("./updateQuery");
var sortQuery   = require("./sortQuery");

module.exports = {

	getAll: function(opts, cb) {
		var sortBy, sortString, mainString, queryString;

		sortBy = opts.sortBy || "shipping_date";
		sortString = sortQuery(sortBy, opts.asc);

		mainString = "SELECT job_items.*, jobs.shipping_date, jobs.job_status, " +
									"jobs.payment, jobs.client " +
									"FROM job_items INNER JOIN jobs " +
									"ON job_items.job_id = jobs.job_id ";

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
		var insertString;

		var itemData = {
			job_id : 			data.job_id,
			product: 			data.product 		|| "",
			description: 	data.description || "",
			glass: 				data.glass 			|| "",
			metal: 				data.metal 			|| "",
			flex: 				data.flex 				|| "",
			bulb: 				data.bulb 				|| "",
			qty_req: 			data.qty_req 		|| 0,
			qty_hot: 			data.qty_hot 		|| 0,
			qty_cold: 		data.qty_cold 		|| 0,
			qty_assem: 		data.qty_assem 	|| 0,
			notes: 				data.notes 			|| "",
			createdat: 		new Date(),
			updatedat: 		new Date()
		};

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

		insertString = "INSERT INTO job_items (job_id, product, description, glass, metal, " +
										"flex, bulb, qty_req, qty_hot, qty_cold, qty_assem, notes, createdat, updatedat) values" +
										"($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *";

		connect(function(err, client, done) {
			if (err) return cb(err);

			client.query(insertString, item, function(errInsert, info) {
				done();
				console.log(insertString, errInsert);
				if (errInsert) cb(errInsert);
				else           cb(null, assign(itemData, info.rows[0]));
			});
		});

	},

	update: function(id, data, cb) {

		delete data.job_id;
		delete data.item_id;
		delete data.updatedat;
		delete data.createdat;
		delete data.shipping_date;
		delete data.job_status;
		delete data.payment;
		delete data.client;

		var q = updateQuery("job_items", id, "item_id", data);

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
		var deleteString = "DELETE FROM job_items WHERE item_id=($1)";

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
