"use strict";
import assert from "assert";
import rewire from "rewire";
import assign from "object-assign";
import Joi from "joi";
import helpers, { coerceToNum } from "../helpers/helpers";
import { connectDouble } from "../helpers/doubles";

describe("model - crud", () => {
	let crud, data, model, dataWeGotBack;

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
		crud = rewire("../../../api/lib/crudModel");
		model = crud(conf);
		data = JSON.parse(JSON.stringify(require("../models/json/products.json")));
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

		it("#passes all results to the cb, formatted by the formatterM function if present", done => {
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

		it("#uses a custom select string if present in the config (requires a trailing space)", done => {
			const opts = {};
			const config = {
				tableName: "products",
				defaultSort: "name",
				primaryKey: "id",
				customSelect: "SELECT name FROM products "
			};

			model = crud(config);

			model.getAll(opts, (err, rows) => {
				const itemsWeWant = data.map(e => {
					return {
						name: e.name
					};
				}).sort((a, b) => a.name.localeCompare(b.name));

				assert.equal(err, null);
				assert.deepEqual(rows, itemsWeWant);
				done();
			});
		});

		it("#calls the cb with an error if there is a connection error", done => {
			crud.__set__("connect", connectDouble("connect"));

			const opts = {};
			const config = {
				tableName: "products",
				defaultSort: "name",
				primaryKey: "id"
			};

			model = crud(config);

			model.getAll(opts, (err, rows) => {
				assert(err);
				done();
			});
		});

		it("#calls the cb with an error if there is a query error", done => {
			crud.__set__("connect", connectDouble("query"));

			const opts = {};
			const config = {
				tableName: "products",
				defaultSort: "name",
				primaryKey: "id"
			};

			model = crud(config);

			model.getAll(opts, (err, rows) => {
				assert(err);
				done();
			});
		});

	});

	describe(".create", () => {
		let maxId;

		it("#takes a data object and a callback", () => {
			assert.equal(model.create.length, 2);
		});

		it("#passes the newly created default item to the cb, with the new id", done => {
			maxId = data.sort((a, b) => b.id - a.id)[0].id;

			model.create(null, (err, row) => {
				assert.equal(err, null);
				assert.equal(maxId + 1, row.id);
				maxId += 1;
				done();
			});
		});

		it("#passes the creation to the cb, formatted by the formatterS function if present", done => {
			const opts = {};
			const config = {
				tableName: "products",
				defaultSort: "name",
				primaryKey: "id",
				formatterS(row) {
					return 17 + +row.id;
				}
			};

			model = crud(config);

			model.create(null, (err, row) => {
				assert.equal(err, null);
				assert.equal(maxId + 1 + 17, row);
				done();
			});
		});

		it("#calls the cb with a validation error if validation fails", done => {
			const theOneToBeInvigorated = {
				sku: "hello12345"
			};

			const config = {
				tableName: "products",
				defaultSort: "name",
				primaryKey: "id",
				schema: Joi.object().keys({
					sku: Joi.number()
				})
			};

			model = crud(config);

			model.create(theOneToBeInvigorated, (err, row) => {
				assert(err);
				done();
			});
		});

		it("#calls the cb with an error if there is a connection error", done => {
			crud.__set__("connect", connectDouble("connect"));
			const config = {
				tableName: "products",
				defaultSort: "name",
				primaryKey: "id"
			};

			model = crud(config);

			model.create(null, (err, rows) => {
				assert(err);
				done();
			});
		});

		it("#calls the cb with an error if there is a query error", done => {
			crud.__set__("connect", connectDouble("query"));

			const config = {
				tableName: "products",
				defaultSort: "name",
				primaryKey: "id"
			};

			model = crud(config);

			model.create(null, (err, rows) => {
				assert(err);
				done();
			});
		});

	});

	describe(".update", () => {
		it("#takes an id, a data object and a callback", () => {
			assert.equal(model.update.length, 3);
		});

		it("#passes the freshly updated item to the cb, formatted by formatterS if present", done => {
			const theChosenOne = data[5].id;
			const theOneToBeInvigorated = {
				id: theChosenOne,
				sku: "a wha me say wagwan rudebwoi"
			};

			const config = {
				tableName: "products",
				defaultSort: "name",
				primaryKey: "id",
				formatterS(item) {
					return [item];
				}
			};

			model = crud(config);

			model.update(theChosenOne, theOneToBeInvigorated, (err, row) => {
				assert.equal(err, null);
				assert.deepEqual(row[0].sku, theOneToBeInvigorated.sku);
				done();
			});
		});

		it("#validates the data object with the Joi schema if present, stripping unknowns & merging the update", done => {
			const theChosenOne = data[5].id;
			const theOneToBeInvigorated = {
				id: theChosenOne,
				sku: "12345",
				qty_items: 25
			};

			const config = {
				tableName: "products",
				defaultSort: "name",
				primaryKey: "id",
				schema: Joi.object().keys({
					sku: Joi.number()
				})
			};

			model = crud(config);

			model.update(theChosenOne, theOneToBeInvigorated, (err, row) => {
				assert.equal(err, null);
				assert.deepEqual(row.sku, theOneToBeInvigorated.sku);
				assert.deepEqual(row.qty_items, theOneToBeInvigorated.qty_items);
				done();
			});
		});

		it("#calls the cb with a validation error if validation fails", done => {
			const theChosenOne = data[5].id;
			const theOneToBeInvigorated = {
				id: theChosenOne,
				sku: "hello12345"
			};

			const config = {
				tableName: "products",
				defaultSort: "name",
				primaryKey: "id",
				schema: Joi.object().keys({
					sku: Joi.number()
				})
			};

			model = crud(config);

			model.update(theChosenOne, theOneToBeInvigorated, (err, row) => {
				assert(err);
				done();
			});
		});

		it("#calls the cb with an error if there is a connection error", done => {
			crud.__set__("connect", connectDouble("connect"));

			const theChosenOne = data[5].id;
			const theOneToBeInvigorated = {
				sku: 12345
			};

			const config = {
				tableName: "products",
				defaultSort: "name",
				primaryKey: "id",
				schema: Joi.object().keys({
					sku: Joi.number()
				})
			};

			model = crud(config);

			model.update(theChosenOne, theOneToBeInvigorated, (err, rows) => {
				assert(err);
				done();
			});
		});

		it("#calls the cb with an error if there is a query error", done => {
			crud.__set__("connect", connectDouble("query"));

			const theChosenOne = data[5].id;
			const theOneToBeInvigorated = {
				sku: 12345
			};

			const config = {
				tableName: "products",
				defaultSort: "name",
				primaryKey: "id",
				schema: Joi.object().keys({
					sku: Joi.number()
				})
			};

			model = crud(config);

			model.update(theChosenOne, theOneToBeInvigorated, (err, rows) => {
				assert(err);
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

		it("#calls the cb with an error if there is a connection error", done => {
			crud.__set__("connect", connectDouble("connect"));

			const theChosenOne = data[5].id;
			const theOneToBeInvigorated = {
				sku: "hello12345"
			};

			const config = {
				tableName: "products",
				defaultSort: "name",
				primaryKey: "id",
				schema: Joi.object().keys({
					sku: Joi.number()
				})
			};

			model = crud(config);

			model.delete(theChosenOne, (err, rows) => {
				assert(err);
				done();
			});
		});

		it("#calls the cb with an error if there is a query error", done => {
			crud.__set__("connect", connectDouble("query"));

			const theChosenOne = data[5].id;
			const theOneToBeInvigorated = {
				sku: "hello12345"
			};

			const config = {
				tableName: "products",
				defaultSort: "name",
				primaryKey: "id",
				schema: Joi.object().keys({
					sku: Joi.number()
				})
			};

			model = crud(config);

			model.delete(theChosenOne, (err, rows) => {
				assert(err);
				done();
			});
		});
	});
});

