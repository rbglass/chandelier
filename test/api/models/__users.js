"use strict";
import assert from "assert";
import assign from "object-assign";
import rewire from "rewire";
import helpers, { coerceToNum } from "../helpers/helpers";
import { connectDouble } from "../helpers/doubles";

process.env.EMAIL = "terryteriyaki@michaeljackson.org";

describe("users", () => {
	let users, data, itemdata;

	before(done => helpers.start("users", done));
	after(done => helpers.drop(done));

	beforeEach(done => {
		users = rewire("../../../api/models/users");
		done();
	});

	describe(".getSingle", () => {

		it("#takes an email and a callback", () => {
			assert.equal(users.getSingle.length, 2);
		});

		it("#passes the found user to the cb", done => {
			const theChosenOne = process.env.EMAIL;

			users.getSingle(theChosenOne, (err, user) => {
				assert.equal(err, null);
				assert.equal(user.email, theChosenOne);
				done();
			});
		});

		it("#calls the cb with an error if there is a connection error", done => {
			users.__set__("connect", connectDouble("connect"));
			const theChosenOne = process.env.EMAIL;

			users.getSingle(theChosenOne, (err, jobWithitems) => {
				assert(err);
				done();
			});
		});

		it("#calls the cb with an error if there is a query error", done => {
			users.__set__("connect", connectDouble("query"));
			const theChosenOne = process.env.EMAIL;

			users.getSingle(theChosenOne, (err, jobWithitems) => {
				assert(err);
				done();
			});
		});
	});
});

