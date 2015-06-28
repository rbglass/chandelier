"use strict";
import assert from "assert";
import assign from "object-assign";
import helpers, { coerceToNum } from "../helpers/helpers";

import users from "../../../api/models/users";

process.env.EMAIL = "terryteriyaki@michaeljackson.org";

describe("users", () => {
	let data, itemdata;

	before(done => helpers.start("users", done));
	after(done => helpers.drop(done));

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
	});
});

