"use strict";
import sinon from "sinon";
import assert from "assert";
import rewire from "rewire";
import testPlease from "../helpers/testPlease";
import { dispyDouble } from "../helpers/doubles";

const toTest = [
	{
		fn: "receiveUpdatedJob",
		type: "RECEIVE_UPDATED_JOB",
		give: ["newJob"],
		want: "newJob",
		desc: "an updated job object"
	},

	{
		fn: "deleteSingleItem",
		type: "RECEIVE_ITEM_DELETION_CONFIRMATION",
		give: [null, "mook"],
		want: "mook",
		desc: "the deleted id"
	},

	{
		fn: "deleteSingleProduct",
		type: "RECEIVE_PRODUCT_DELETION_CONFIRMATION",
		give: [null, "hat"],
		want: "hat",
		desc: "the deleted id"
	},

	{
		fn: "receiveUpdateConfirmation",
		type: "RECEIVE_UPDATE_CONFIRMATION",
		give: [],
		desc: "no data"
	}
];

describe("ServerActionCreators", () => {
	let ServerActionCreators = rewire("../../../src/js/actions/ServerActionCreators");

	it("internals - receive takes two strings and returns a function that takes data and dispatches it", () => {
		const receive = ServerActionCreators.__get__("receive");
		const stub = dispyDouble("RECEIVE_ALL_JOBS", {data: "dummy"});
		const myFirstReceive = receive("all", "jobs");

		myFirstReceive({data: "dummy"});

		stub.restore();
	});

	it(".receiveNewJob dispatches a new job with type RECEIVE_JOB_CREATION_CONFIRMATION, transitioning to the new page", () => {
			let result = {};
			ServerActionCreators.__set__("RouterContainer", {
				get() {
					return {
						transitionTo(name, params) {
							result.name = name;
							result.params = params;
						}
					};
				}
			});

			const stub = dispyDouble("RECEIVE_JOB_CREATION_CONFIRMATION");
			ServerActionCreators.receiveNewJob({job_id: 212});
			stub.restore();

			assert.equal(result.name, "singlejob");
			assert.deepEqual(result.params, {id: 212});
	});

	testPlease(toTest, ServerActionCreators);
});
