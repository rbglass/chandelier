"use strict";
import assert from "assert";
import sinon from "sinon";
import rewire from "rewire";
import pg from "pg";
import { pgStub } from "./helpers/doubles";

describe("db", () => {
	let clientStub, connectStub, conStr, wantErr;
	const dummyFunc = () => {};

	before(() => {
		connectStub = sinon.stub(pg, "connect", (str, cb) => {
			conStr = str;
			if (wantErr) cb("ERROR", null, dummyFunc);
			else         cb(null, true, dummyFunc);
		});
		clientStub = pgStub();
	});

	after(() => {
		connectStub.restore();
		clientStub.restore();
	});

	beforeEach(() => conStr = null);

	it("#uses a different db URL depending on the node env - production", () => {
		process.env.NODE_ENV = "production";
		process.env.DATABASE_URL = "production url";

		let connect = rewire("../../api/db");
		connect(() => {});

		assert.equal(conStr, process.env.DATABASE_URL);
	});

	it("#falls back to config.database.dburl if DATABASE_URL isn't present - production", () => {
		let config = rewire("../../api/config");
		delete process.env.DATABASE_URL;

		let connect = rewire("../../api/db");
		connect(() => {});

		assert.equal(conStr, config.database.dburl);
	});

	it("#uses a different db URL depending on the node env - test", () => {
		process.env.NODE_ENV = "test";
		process.env.TEST_URL = "test url";

		const connect = rewire("../../api/db");
		connect(() => {});

		assert.equal(conStr, process.env.TEST_URL);
	});

	it("#uses a different db URL depending on the node env - otherwise", () => {
		process.env.NODE_ENV = "other";
		process.env.DEV_URL = "other url";

		const connect = rewire("../../api/db");
		connect(() => {});

		assert.equal(conStr, process.env.DEV_URL);
	});

	it("#falls back to config.localdb.localdburl if DEV_URL isn't present - otherwise", () => {
		let config = rewire("../../api/config");
		delete process.env.DEV_URL;

		let connect = rewire("../../api/db");
		connect(() => {});

		assert.equal(conStr, config.localdb.localdburl);
	});

	it("#exports a function that calls the cb with an error if a connection error occurs", () => {
		wantErr = true;
		let result;

		const connect = rewire("../../api/db");
		connect((err) => result = err);

		assert.equal(result, "ERROR");
	});

	it("#exports a function that calls the cb with a client and done", () => {
		wantErr = false;
		let result;

		const connect = rewire("../../api/db");
		connect((err, cl, done) => result = [err, cl, done]);

		assert.deepEqual(result, [null, true, dummyFunc]);
	});
});
