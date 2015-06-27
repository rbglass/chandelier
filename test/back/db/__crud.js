"use strict";
import assert from "assert";
import assign from "object-assign";
import helpers, { coerceToNum } from "./helpers";

import crud from "../../../api/models/crud";

describe("model - crud", () => {
	let data, model, dataWeGotBack;

	const conf = {
		tableName: "products",
		defaultSort: "name",
		primaryKey: "id"
	};
	const thingsWeWantAsNum = [conf.primaryKey];
	const dCoerce = coerceToNum.bind(null, thingsWeWantAsNum);

	before(done => helpers.start("products", done));
	after(done => helpers.drop(done));
	beforeEach(done => {
		model = crud(conf);
		data = JSON.parse(JSON.stringify(require("./json/products.json")));
		done();
	});

	it("#takes a config object as an argument", () => {
		const caraDelevingne = {};

		assert.equal(crud.length, 1);
		assert(crud(caraDelevingne));
	});

	it("#returns an object with getAll, create, update and delete methods", () => {
		assert.equal(model.getAll.length, 2);
		assert.equal(model.create.length, 2);
		assert.equal(model.update.length, 3);
		assert.equal(model.delete.length, 2);
	});

	describe(".getAll", () => {

		it("#takes an options object and a callback", () => {
			assert.equal(model.getAll.length, 2);
		});

		it("#passes all results to the cb, sorted by the sortBy and asc options 1", done => {
			const opts = {
				sortBy: "id",
				asc: "false"
			};

			model.getAll(opts, (err, rows) => {
				const coerced = rows.map((e, i) => {
					delete e.description;
					delete data[i].description;
					return dCoerce(e);
				});
				const itemsWeWant = data.sort((a, b) => b.id - a.id);
				assert.equal(err, null);
				assert.deepEqual(coerced, itemsWeWant);
				done();
			});
		});

		it("#passes all results to the cb, sorted by the default sort from the config", done => {
			const opts = {};


			model.getAll(opts, (err, rows) => {
				const coerced = rows.map((e, i) => {
					delete e.description;
					delete data[i].description;
					return dCoerce(e);
				});
				const itemsWeWant = data.sort((a, b) => a[conf.defaultSort].localeCompare(b[conf.defaultSort]));
				assert.equal(err, null);
				assert.deepEqual(coerced, itemsWeWant);
				done();
			});
		});

		it("#passes all results to the cb, formatted by the formattedM function if present", done => {
			const opts = {};
			const config = {
				tableName: "products",
				defaultSort: "name",
				primaryKey: "id",
				formatterM(rows) {
					return rows.map((row, i) => i);
				}
			};

			model = crud(config);

			model.getAll(opts, (err, rows) => {
				const itemsWeWant = data.map((e, i) => i);
				assert.equal(err, null);
				assert.deepEqual(rows, itemsWeWant);
				done();
			});
		});
	});

	describe(".create", () => {
		it("#takes a data object and a callback", () => {
			assert.equal(model.create.length, 2);
		});

		it("#passes the newly created default item to the cb, with the new id", done => {
			const maxId = data.sort((a, b) => b.id - a.id)[0].id;

			model.create(null, (err, row) => {
				assert.equal(err, null);
				assert.equal(maxId + 1, row.id);
				done();
			});
		});
	});

	describe(".update", () => {
		it("#takes an id, a data object and a callback", () => {
			assert.equal(model.update.length, 3);
		});

		it("#passes the freshly updated item to the cb", done => {
			let theChosenOne = data[5].id;

			const theOneToBeInvigorated = {
				id: theChosenOne,
				sku: "a wha me say wagwan rudebwoi"
			};

			model.update(theChosenOne, theOneToBeInvigorated, (err, row) => {
				assert.equal(err, null);
				assert.deepEqual(row.sku, theOneToBeInvigorated.sku);
				done();
			});
		});
	});

	describe(".delete", () => {
		it("#takes an id and a callback", () => {
			assert.equal(model.delete.length, 2);
		});

		it("#deletes the specified item, passing the id to the cb", done => {
			model.getAll(null, (err, rows) => {
				const numBefore = rows.length;
				assert.equal(err, null);

				model.delete(data[7].id, (err2, id) => {
					assert.equal(err2, null);
					assert.equal(id, data[7].id);

					model.getAll(null, (err3, rows3) => {
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

