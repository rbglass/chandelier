"use strict";
import assert from "assert";
import sinon from "sinon";
import * as JobsActionCreators from "../../../src/js/actions/JobsActionCreators";
import * as JobItemsActionCreators from "../../../src/js/actions/JobItemsActionCreators";
import * as ProductActionCreators from "../../../src/js/actions/ProductActionCreators";
import * as SharedActionCreators from "../../../src/js/actions/SharedActionCreators";
import * as JobsAPI from "../../../src/js/api/JobsAPI";


describe("SharedActionCreators", () => {

	describe(".externalSortBy", () => {
		let result, sortStub, jSpy, jiSpy, pSpy;

		before(() => {
			sortStub = sinon.stub(JobsAPI, "getSortedThings", (r, f, d) => {
				result = [r, f, d];
			});
			jSpy  = sinon.spy(JobsActionCreators, "sortBy");
			jiSpy = sinon.spy(JobItemsActionCreators, "sortBy");
			pSpy  = sinon.spy(ProductActionCreators, "sortBy");
		});

		after(() => {
			[sortStub, jSpy, jiSpy, pSpy].forEach(e => e.restore());
		});

		it("#calls the relevant sortBy action creator", () => {
			SharedActionCreators.externalSortBy("jobs", "dawg", false);
			assert(jSpy.called);
			assert.deepEqual(jSpy.firstCall.args, ["dawg"]);

			SharedActionCreators.externalSortBy("items", "caht", true);
			assert(jSpy.called);
			assert.deepEqual(jiSpy.firstCall.args, ["caht"]);

			SharedActionCreators.externalSortBy("products", "forks", false);
			assert(pSpy.called);
			assert.deepEqual(pSpy.firstCall.args, ["forks"]);
		});

		it("#calls JobsAPI.getSortedThings with the endpoint," +
			" sort field and sort direction, defaulting to false", () => {
			const args1 = ["items", "chickens", false];
			const args2 = ["jobs", "frogs", true];

			SharedActionCreators.externalSortBy(args1[0], args1[1], args1[2]);
			assert.deepEqual(result, [args1[0], args1[1], !args1[2]]);

			SharedActionCreators.externalSortBy(args2[0], args2[1], args2[2]);
			assert.deepEqual(result, [args2[0], args2[1], !args2[2]]);

		});
	});
});
