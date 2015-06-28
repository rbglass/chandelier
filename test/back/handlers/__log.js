"use strict";
import assert from "assert";
import sinon from "sinon";
import { replyDouble, pgStub } from "../helpers/doubles";

// shouldn't be necessary with better structuring
import log from "../../../api/handlers/log";

describe("log", () => {
	let result, reply, testPG, users, modelStub;

	let cleared = false;
	let profile = false;
	let email = "bigNestedObject@googel.arg";

	const req = {
		auth: {
			credentials: {
				profile: {
					raw: {
						email: email
					}
				}
			},
			session: {
				clear() {
					cleared = true;
				},
				set(deets) {
					profile = deets;
				}
			}
		}
	};

	before(() => {
		testPG = pgStub();
		var db = require("../../../api/db");
		users = require("../../../api/models/users");
		modelStub = sinon.stub(users, "getSingle", (address, cb) => {
			if (address === "ERROR") cb("ERROR");
			else                     cb(null, address);
		});
	});



	beforeEach(() => {
		cleared = false;
		profile = false;
		result = {};
		reply = replyDouble(result);
	});

	after(() => {
		modelStub.restore();
		testPG.restore();
	});

	describe(".in", () => {
		it("#sets the users session if their email is found in the database", () => {
			log.in(req, reply);

			assert.equal(cleared, true);
			assert.equal(profile.email, email);
		});

		it("#replies with a 404 if their email isn't found in the database", () => {
			const dodgyReq = {
				auth: { credentials: { profile: {raw: { email: null }}}}
			};
			log.in(dodgyReq, reply);

			assert.equal(cleared, false);
			assert.equal(result.code, 404);
		});

		it("#replies with an error if there is one", () => {
			const dodgyReq = {
				auth: { credentials: { profile: {raw: { email: "ERROR" }}}}
			};
			log.in(dodgyReq, reply);

			assert.equal(result.data, "ERROR");
		});

	});

	describe(".out", () => {
		it("#clears the users session", () => {
			log.in(req, reply);

			assert.equal(cleared, true);
		});
	});
});
