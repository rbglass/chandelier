"use strict";
import I from "immutable";
import sinon from "sinon";
import assert from "assert";
import rewire from "rewire";
import { requestDouble, genericDouble } from "../helpers/doubles";

import * as ServerActionCreators from "../../../src/js/actions/ServerActionCreators";
import * as SharedActionCreators from "../../../src/js/actions/SharedActionCreators";

describe("JobsAPI", () => {
	let JobsAPI, startLoadingStub, SAC, loading, request;
	let result = {};


	before(() => {
		startLoadingStub = sinon.stub(SharedActionCreators, "startLoading", () => {
			loading = true;
		});
		SAC = genericDouble(ServerActionCreators, result);
		request = requestDouble(result);
	});

	after(() => startLoadingStub.restore());

	beforeEach(() => {
		Object.keys(result).forEach(key => key = null);
		loading = false;
	});

	describe(".onReply", () => {
		let onReply;

		beforeEach(done => {
			JobsAPI = rewire("../../../src/js/api/JobsAPI");
			onReply = JobsAPI.__get__("onReply");
			done();
		});

		it("#returns a function that calls successAction if there's no error", () => {
			const fakeRes = {
				ok: true,
				body: "hello"
			};

			const errOrRes = onReply((data) => {
				assert.equal(data, fakeRes.body);
			});

			errOrRes(null, fakeRes);
		});

		it("#calls successAction with exta args passed to it", () => {
			const fakeRes = {
				ok: true,
				body: "hello"
			};
			const extraArg = 12345;

			const errOrRes = onReply((data, extras) => {
				assert.equal(data, fakeRes.body);
				assert.equal(extras, extraArg);
			}, extraArg);

			errOrRes(null, fakeRes);
		});

		it("#calls errToAction if the response is not ok", () => {
			const errToAction = JobsAPI.__set__("errToAction", (err) => {
				assert.equal(err, "whoops!");
			});

			const fakeRes = {
				ok: false,
				body: "hello"
			};

			const errOrRes = onReply(() => {});

			errOrRes("whoops!", fakeRes);
		});
	});

	describe(".getSortedThings", () => {
		let onReply;

		beforeEach(done => {
			JobsAPI = rewire("../../../src/js/api/JobsAPI");
			onReply = JobsAPI.__set__("onReply", fn => fn);
			done();
		});

		it("#sends a request to the correct endpoint, with the specified query params - jobs", () => {
			const endpoint = "jobs";
			const query = {
				field: "west side",
				isAsc: true
			};

			JobsAPI.getSortedThings(endpoint, query.field, query.isAsc);
			assert.deepEqual(result.query, {field: query.field, asc: query.isAsc});
			assert.equal(result.get, `/api/${endpoint}`);
			assert.deepEqual(result.end, ServerActionCreators.receiveAllJobs);
		});

		it("#sends a request to the correct endpoint, with the specified query params - products", () => {
			const endpoint = "products";
			const query = {
				field: "east side",
				isAsc: false
			};

			JobsAPI.getSortedThings(endpoint, query.field, query.isAsc);
			assert.deepEqual(result.query, {field: query.field, asc: query.isAsc});
			assert.equal(result.get, `/api/${endpoint}`);
			assert.deepEqual(result.end, ServerActionCreators.receiveAllProducts);
		});

		it("#sends a request to the correct endpoint, with the specified query params - items", () => {
			const endpoint = "items";
			const query = {
				field: "south side",
				isAsc: null
			};

			JobsAPI.getSortedThings(endpoint, query.field, query.isAsc);
			assert.deepEqual(result.query, {field: query.field, asc: query.isAsc});
			assert.equal(result.get, "/api/items");
			assert.deepEqual(result.end, ServerActionCreators.receiveAllItems);
		});
	});

	describe(".getAllJobs()", () => {

		let onReply;

		beforeEach(done => {
			JobsAPI = rewire("../../../src/js/api/JobsAPI");
			onReply = JobsAPI.__set__("onReply", fn => fn);
			done();
		});

		it("#sends a request to the jobs endpoint, continuing to .receiveAllJobs", () => {
			JobsAPI.getAllJobs();

			assert.equal(result.get, "/api/jobs");
			assert.deepEqual(result.end, ServerActionCreators.receiveAllJobs);
		});
	});

	describe(".getSingleJob", () => {
		let onReply;

		beforeEach(done => {
			JobsAPI = rewire("../../../src/js/api/JobsAPI");
			onReply = JobsAPI.__set__("onReply", fn => fn);
			done();
		});

		it("#sends a request to the correct id endpoint, continuing to .receiveSingleJob", () => {
			const endpoint = 11234;

			JobsAPI.getSingleJob(endpoint);
			assert(loading);
			assert.equal(result.get, `/api/jobs/${endpoint}`);
			assert.deepEqual(result.end, ServerActionCreators.receiveSingleJob);
		});
	});

	describe(".createSingleJob", () => {
		let onReply;

		beforeEach(done => {
			JobsAPI = rewire("../../../src/js/api/JobsAPI");
			onReply = JobsAPI.__set__("onReply", fn => fn);
			done();
		});

		it("#sends a post request to the correct endpoint, continuing to .receiveNewJob", () => {
			JobsAPI.createSingleJob();
			assert(loading);
			assert.equal(result.post, "/api/jobs");
			assert.deepEqual(result.end, ServerActionCreators.receiveNewJob);
		});
	});

	describe(".saveDetails", () => {
		let onReply;

		beforeEach(done => {
			JobsAPI = rewire("../../../src/js/api/JobsAPI");
			onReply = JobsAPI.__set__("onReply", fn => fn);
			done();
		});

		it("#sends a put request to the correct endpoint, continuing to .receiveUpdatedJob", () => {
			const endpoint = 1123451;
			const iUpdateObj = I.Map({});

			JobsAPI.saveDetails(endpoint, iUpdateObj);
			assert.equal(result.put, `/api/jobs/${endpoint}`);
			assert.deepEqual(result.end, ServerActionCreators.receiveUpdatedJob);
		});

		it("#converts the immutable object given to it into mutable form", () => {
			const endpoint = 1123451;
			const iUpdateObj = I.Map({
				prop1: "whaddya mean whaddya mean"
			});

			JobsAPI.saveDetails(endpoint, iUpdateObj);
			assert.deepEqual(result.send, iUpdateObj.toJS());
		});
	});

	describe(".getAllItems", () => {
		let onReply;

		beforeEach(done => {
			JobsAPI = rewire("../../../src/js/api/JobsAPI");
			onReply = JobsAPI.__set__("onReply", fn => fn);
			done();
		});

		it("#sends a request to the items endpoint, continuing to .receiveAllItems", () => {
			JobsAPI.getAllItems();

			assert.equal(result.get, "/api/items");
			assert.deepEqual(result.end, ServerActionCreators.receiveAllItems);
		});
	});

	describe(".createSingleJobItem", () => {
		let onReply;

		beforeEach(done => {
			JobsAPI = rewire("../../../src/js/api/JobsAPI");
			onReply = JobsAPI.__set__("onReply", fn => fn);
			done();
		});

		it("#sends a post request to the correct endpoint, continuing to .receiveSingleItem", () => {
			const id = "cat";
			const iCreateObj = I.Map({});

			JobsAPI.createSingleJobItem(id, iCreateObj);
			assert.equal(result.post, `/api/items`);
			assert.deepEqual(result.end, ServerActionCreators.receiveSingleItem);
		});

		it("#converts the immutable object given to it into mutable form, with the job_id", () => {
			const id = "hat";
			const iCreateObj = I.Map({
				prop1: "whaddya mean chicken flippers"
			});

			JobsAPI.createSingleJobItem(id, iCreateObj);
			assert.deepEqual(result.send, iCreateObj.set("job_id", id).toJS());
		});

		it("#if the object is not immutable, created an empty object", () => {
			const id = "hat";

			JobsAPI.createSingleJobItem(id, {});
			assert.deepEqual(result.send, {"job_id": id});
		});
	});

	describe(".saveItem", () => {
		let onReply;

		beforeEach(done => {
			JobsAPI = rewire("../../../src/js/api/JobsAPI");
			onReply = JobsAPI.__set__("onReply", fn => fn);
			done();
		});

		it("#sends a put request to the correct endpoint, continuing to .receiveUpdateConfirmation", () => {
			const endpoint = "cat";
			const iUpdateObj = I.Map({});

			JobsAPI.saveItem(endpoint, iUpdateObj);
			assert.equal(result.put, `/api/items/${endpoint}`);
			assert.deepEqual(result.end, ServerActionCreators.receiveUpdateConfirmation);
		});

		it("#converts the immutable object given to it into mutable form", () => {
			const endpoint = "hat";
			const iUpdateObj = I.Map({
				prop1: "whaddya mean chicken flippers"
			});

			JobsAPI.saveItem(endpoint, iUpdateObj);
			assert.deepEqual(result.send, iUpdateObj.toJS());
		});
	});

	describe(".deleteSingleItem", () => {
		let onReply;

		beforeEach(done => {
			JobsAPI = rewire("../../../src/js/api/JobsAPI");
			onReply = JobsAPI.__set__("onReply", (...args) => args);
			done();
		});

		it("#sends a delete request to the correct endpoint, continuing to .deleteSingleItem + id", () => {
			const endpoint = 12345581;

			JobsAPI.deleteSingleItem(endpoint);
			assert(loading);
			assert.equal(result.del, `/api/items/${endpoint}`);
			assert.deepEqual(result.end[0], ServerActionCreators.deleteSingleItem);
			assert.equal(result.end[1], endpoint);
		});
	});

	describe(".getSelections", () => {
		let onReply;

		beforeEach(done => {
			JobsAPI = rewire("../../../src/js/api/JobsAPI");
			onReply = JobsAPI.__set__("onReply", fn => fn);
			done();
		});

		it("#sends a request to the selections endpoint, continuing to .receiveAllSelections", () => {
			JobsAPI.getSelections();

			assert.equal(result.get, "/api/selections");
			assert.deepEqual(result.end, ServerActionCreators.receiveAllSelections);
		});
	});

	describe(".getAllProducts", () => {

		let onReply;

		beforeEach(done => {
			JobsAPI = rewire("../../../src/js/api/JobsAPI");
			onReply = JobsAPI.__set__("onReply", fn => fn);
			done();
		});

		it("#sends a request to the products endpoint, continuing to .receiveAllProducts", () => {
			JobsAPI.getAllProducts();

			assert.equal(result.get, "/api/products");
			assert.deepEqual(result.end, ServerActionCreators.receiveAllProducts);
		});
	});

	describe(".createSingleProduct", () => {
		let onReply;

		beforeEach(done => {
			JobsAPI = rewire("../../../src/js/api/JobsAPI");
			onReply = JobsAPI.__set__("onReply", fn => fn);
			done();
		});

		it("#sends a post request to the correct endpoint, continuing to .receiveSingleProduct", () => {
			JobsAPI.createSingleProduct();
			assert(loading);
			assert.equal(result.post, "/api/products");
			assert.deepEqual(result.end, ServerActionCreators.receiveSingleProduct);
		});
	});

	describe(".saveProduct", () => {
		let onReply;

		beforeEach(done => {
			JobsAPI = rewire("../../../src/js/api/JobsAPI");
			onReply = JobsAPI.__set__("onReply", fn => fn);
			done();
		});

		it("#sends a put request to the correct endpoint, continuing to .receiveUpdateConfirmation", () => {
			const endpoint = "cat";
			const iUpdateObj = I.Map({});

			JobsAPI.saveProduct(endpoint, iUpdateObj);
			assert.equal(result.put, `/api/products/${endpoint}`);
			assert.deepEqual(result.end, ServerActionCreators.receiveUpdateConfirmation);
		});

		it("#converts the immutable object given to it into mutable form", () => {
			const endpoint = "hat";
			const iUpdateObj = I.Map({
				prop1: "whaddya mean chicken flippers"
			});

			JobsAPI.saveProduct(endpoint, iUpdateObj);
			assert.deepEqual(result.send, iUpdateObj.toJS());
		});
	});

	describe(".deleteSingleProduct", () => {
		let onReply;

		beforeEach(done => {
			JobsAPI = rewire("../../../src/js/api/JobsAPI");
			onReply = JobsAPI.__set__("onReply", (...args) => args);
			done();
		});

		it("#sends a delete request to the correct endpoint, continuing to .deleteSingleProduct + id", () => {
			const endpoint = "ab125es";

			JobsAPI.deleteSingleProduct(endpoint);
			assert(loading);
			assert.equal(result.del, `/api/products/${endpoint}`);
			assert.deepEqual(result.end[0], ServerActionCreators.deleteSingleProduct);
			assert.equal(result.end[1], endpoint);
		});
	});

	describe(".getUserProfile", () => {
		let getUserProfile;

		beforeEach(done => {
			JobsAPI = rewire("../../../src/js/api/JobsAPI");
			getUserProfile = JobsAPI.__get__("getUserProfile");
			done();
		});

		it("#sends a get request to the correct endpoint, continuing to .receiveProfile", () => {
			JobsAPI.getUser();

			assert.equal(result.get, "/profile");
			assert.deepEqual(result.end, ServerActionCreators.receiveProfile);
		});
	});
});
