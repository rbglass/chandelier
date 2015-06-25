"use strict";
import assert from "assert";
import assign from "object-assign";
import helpers from "./helpers";
import data from "./json/products.json";

import products from "../../../api/models/products";

describe("model - products", () => {
	before(done => helpers.start("products", done));
	after(done => helpers.drop(done));

	describe("#getAll", () => {

		it("#takes an options object and a callback", () => {
			assert.equal(products.getAll.length, 2);
		});

		it("#passes all products to the cb, sorted by the sortBy and asc options 1", () => {
			const opts = {
				sortBy: "id",
				asc: "false"
			};

			const productsWeWant = data.sort((a, b) => b.id - a.id);

			products.getAll(opts, (err, rows) => {
				assert.equal(err, null);
				assert.deepEqual(rows, productsWeWant);
			});
		});

		it("#passes all products to the cb, sorted by the sortBy and asc options 2", () => {
			const opts = {
				sortBy: "type",
				asc: "anything"
			};

			const productsWeWant = data.sort((a, b) => a.type.localeCompare(b.type));

			products.getAll(opts, (err, rows) => {
				assert.equal(err, null);
				assert.deepEqual(rows, productsWeWant);
			});
		});

		it("#passes all products to the cb, sorted by the sortBy and asc options - defaults", () => {
			const opts = {};

			const productsWeWant = data.sort((a, b) => a.name.localeCompare(b.name));

			products.getAll(opts, (err, rows) => {
				assert.equal(err, null);
				assert.deepEqual(rows, productsWeWant);
			});
		});
	});

	describe("#create", () => {
		it("#takes a data object and a callback", () => {
			assert.equal(products.create.length, 2);
		});

		it("#passes the newly created default product to the cb, with the new id", () => {
			const maxId = data.sort((a, b) => b.id - a.id)[0].id;

			products.create(null, (err, row) => {
				assert.equal(err, null);
				assert.equal(maxId + 1, row.id);
			});
		});
	});

	describe("#update", () => {
		it("#takes an id, a data object and a callback", () => {
			assert.equal(products.update.length, 3);
		});

		it("#passes the freshly updated product to the cb", done => {
			let theChosenOne = data[12].id;

			const theOneToBeInvigorated = {
				id: theChosenOne,
				SKU: "a wha me say wagwan rudebwoi"
			};

			products.update(theChosenOne, theOneToBeInvigorated, (err, row) => {
				assert.equal(err, null);
				assert.deepEqual(row.sku, theOneToBeInvigorated.SKU);
			done();
			});
		});
	});

	describe("#delete", () => {
		it("#takes an id and a callback", () => {
			assert.equal(products.delete.length, 2);
		});

		it("#deletes the specified product, passing the id to the cb", done => {
			products.getAll(null, (err, rows) => {
				const numBefore = rows.length;
				assert.equal(err, null);

				products.delete(data[15].id, (err2, id) => {
					assert.equal(err2, null);
					assert.equal(id, data[15].id);

					products.getAll(null, (err3, rows3) => {
						const numAfter = rows3.length;
						assert.equal(err3, null);
						assert.equal(numBefore - 1, numAfter);
						done();
					});
				});
			});
		});
	});
});

