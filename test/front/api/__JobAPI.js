"use strict";
import sinon from "sinon";
import assert from "assert";
import request from "superagent";
import JobAPI from "../../../src/js/api/JobAPI";

suite("JobAPI", () => {


	suite("#getAllJobs()", () => {
	let server = sinon.fakeServer.create(),
	    headers = {"Content-Type": "application/json"},
			jobsObj = {jobID: "RB1234"};

		setup((done) => {
	    let res = JSON.stringify(jobsObj);
			server.respondWith("GET", "/api/jobs", [200, headers, res]);
			done();
		});

		test("successfully gets all jobs", (done) => {
			JobAPI.getAllJobs((err, res) => {
				assert.equal(err, null);
				assert.equal(res.body, jobsObj);
			});

		server.respond();
		done();
		});
	});

	suite("#createOneJob", () => {
		let server = sinon.fakeServer.create();

		setup((done) => {
			server.respondWith("POST", "/api/jobs", [201, null, ""]);
			done();
		});

		test("successfully creates one job", (done) => {
			JobAPI.createOneJob((err, res) => {
				assert.equal(err, null);
				assert.equal(res.headers["Status-Code"], 201);
			});

		server.respond();
		done();
		});
	});

	suite("#getOneJob", () => {
		let server = sinon.fakeServer.create(),
		    headers = {"Content-Type": "application/json"},
		    singleJob = {jobID: "RB1234"};

		setup((done) => {
			let res = JSON.stringify(singleJob);
			server.respondWith("GET", "/api/jobs/RB1234", [200, headers, res]);
			done();
		});

		test("successfully gets one job", (done) => {
			JobAPI.getOneJob("RB1234", (err, res) => {
				assert.equal(err, null);
				assert.equal(res.body, singleJob);
			});

		server.respond();
		done();
		});
	});

	suite("#updateOneJob", () => {
		let server = sinon.fakeServer.create();

		setup((done) => {
			server.respondWith("PUT", "/api/jobs/RB1234/item", [200, null, ""]);
			server.respondWith("PUT", "/api/jobs/RB1234/details", [200, null, ""]);
			done();
		});

		test("successfully updates one job", (done) => {

			JobAPI.getAllJobs("RB1234", "item", {"hello": "hi"}, (err, res) => {
				assert.equal(err, null);
				assert.equal(res.headers["Status-Code"], 200);
			});

			JobAPI.getAllJobs("RB1234", "details", {"bye": "hi"}, (err, res) => {
				assert.equal(err, null);
				assert.equal(res.headers["Status-Code"], 200);
			});

		server.respond();
		done();
		});
	});
});
