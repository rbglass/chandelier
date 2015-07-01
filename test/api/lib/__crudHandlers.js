"use strict";
import assert from "assert";
import { replyDouble } from "../helpers/doubles";

import crud from "../../../api/lib/crudHandlers";

const error = "ERROR";

function model(withErr) {
	return {
		getAll(opts, cb)     { cb(withErr, opts); },
		create(data, cb)     { cb(withErr, data); },
		update(id, data, cb) { cb(withErr, {id, data}); },
		delete(id, cb)       { cb(withErr, id); }
	};
}

describe("handlers - crud", () => {
	let handlers, handlersWithErr, reply, result;

	beforeEach(() => {
		handlers = crud(model());
		handlersWithErr = crud(model(error));
		result = {};
		reply = replyDouble(result);
	});

	it("#takes a model as an argument", () => {
		const caraDelevingne = {};

		assert.equal(crud.length, 1);
		assert(crud(caraDelevingne));
	});

	it("#returns an object with getAll, create, update and delete methods, each taking 2 args", () => {
		assert.equal(handlers.getAll.length, 2);
		assert.equal(handlers.create.length, 2);
		assert.equal(handlers.update.length, 2);
		assert.equal(handlers.delete.length, 2);
	});

	describe(".getAll", () => {
		const req = {
			query: {
				field: "testField",
				asc: "testAsc"
			}
		};

		it("#calls the getAll method of the model passed in, with sortBy and asc from req.query", () => {
			handlers.getAll(req, reply);

			assert(result.data);
			assert.equal(result.data.sortBy, req.query.field);
			assert.equal(result.data.asc, req.query.asc);
		});

		it("#handles errors", () => {
			handlersWithErr.getAll(req, reply);

			assert.equal(result.data, error);
			assert.equal(result.code, 400);
		});
	});

	describe(".create", () => {
		const req = {
			payload: {
				first : "test1",
				second: "test2"
			}
		};

		it("#calls the create method of the model passed in, with req.payload", () => {
			handlers.create(req, reply);

			assert.deepEqual(result.data, req.payload);
		});

		it("#handles errors", () => {
			handlersWithErr.create(req, reply);

			assert.equal(result.data, error);
			assert.equal(result.code, 400);
		});
	});

	describe(".update", () => {
		const req = {
			params: {
				id: "thatsnotme"
			},
			payload: {
				first : "test1",
				second: "test2"
			}
		};

		it("#calls the update method of the model passed in, with the id param and req.payload", () => {
			handlers.update(req, reply);

			assert.equal(result.data.id, req.params.id);
			assert.equal(result.data.data, req.payload);
		});

		it("#handles errors", () => {
			handlersWithErr.update(req, reply);

			assert.equal(result.data, error);
			assert.equal(result.code, 400);
		});
	});

	describe(".delete", () => {
		const req = {
			params: {
				id: "thatsnotme"
			}
		};

		it("#calls the delete method of the model passed in, with the id param ", () => {
			handlers.delete(req, reply);

			assert.equal(result.data, req.params.id);
		});

		it("#handles errors", () => {
			handlersWithErr.delete(req, reply);

			assert.equal(result.data, error);
			assert.equal(result.code, 400);
		});
	});

});
