"use strict";
import assert from "assert";
import rewire from "rewire";
import sinon from "sinon";
import { replyDouble, pgStub } from "../helpers/doubles";


describe("jobs", () => {
	let result, reply, testPG, jobsModel, modelStub;

	before(done => {
		testPG = pgStub();
		var db = require("../../../api/db");

		jobsModel = require("../../../api/models/jobs");
		modelStub = sinon.stub(jobsModel, "getSingle", (id, opts, cb) => {
			if (id === "ERROR") cb("ERROR");
			else                cb(null, id);
		});
		done();
	});

	var jobs = rewire("../../../api/handlers/jobs");

	jobs.__set__("toPDF", (item, cb) => {
		cb(item);
	});


	beforeEach(() => {
		result = {};
		reply = replyDouble(result);
	});

	after(() => {
		modelStub.restore();
		testPG.restore();
	});

	describe(".getSingle", () => {
		it("#replies with the job for the param-provided id from the database", () => {
			const req = {
				params: {
					id: 12
				},
				query: {}
			};

			jobs.getSingle(req, reply);

			assert.equal(result.data, req.params.id);
		});

		it("#replies with a pdf for the param-provided id if the pdf query is truthy, with a disposition", () => {
			const req = {
				params: {
					id: 15
				},
				query: {
					pdf: true
				}
			};

			jobs.getSingle(req, reply);

			assert.equal(result.data, req.params.id);
			assert.equal(result.type, "application/pdf");
			assert.deepEqual(result.header, [
				"Content-Disposition",
				"inline; filename=RB15_specification.pdf"
			]);
		});

		it("#replies with an error if there is one", () => {
			const dodgyReq = {
				params: {id: "ERROR" }
			};
			jobs.getSingle(dodgyReq, reply);

			assert.equal(result.data, "ERROR");
			assert.equal(result.code, 400);
		});
	});
});
