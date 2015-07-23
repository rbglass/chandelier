"use strict";
import assert from "assert";
import sinon from "sinon";
import testPlease from "../helpers/testPlease";
import { genericDouble } from "../helpers/doubles";
import * as JobsActionCreators from "../../../src/js/actions/JobsActionCreators";
import * as JobItemsActionCreators from "../../../src/js/actions/JobItemsActionCreators";
import * as ProductActionCreators from "../../../src/js/actions/ProductActionCreators";
import * as SharedActionCreators from "../../../src/js/actions/SharedActionCreators";
import * as JobsAPI from "../../../src/js/api/JobsAPI";

const toTest = [

	{
		fn: "startLoading",
		type: "IS_LOADING",
		give: [],
		desc: "no data"
	},

	{
		fn: "changeItem",
		type: "CHANGE_SINGLE_JOB_ITEM",
		give: [{item: "newItem"}],
		want: {item: "newItem"},
		desc: "a new job item"
	},

	{
		fn: "changeDetails",
		type: "CHANGE_SINGLE_JOB_DETAILS",
		give: [{details: "newDetails"}],
		want: {details: "newDetails"},
		desc: "a new job details"
	},

	{
		fn: "sortBy",
		type: "SORT_ONE",
		give: ["doctor"],
		want: "doctor",
		desc: "a sort string"
	},

	{
		fn: "setCurrentY",
		type: "SET_CURRENT_Y",
		give: [158],
		want: 158,
		desc: "a new y position"
	},

	{
		fn: "setTableHeight",
		type: "SET_TABLE_HEIGHT",
		give: [450],
		want: 450,
		desc: "a new table height"
	}
];

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

	describe("API callers", () => {
		let dubbel;
		let result = {};

		before(() => {
			dubbel = genericDouble(JobsAPI, result);
		});

		after(() => dubbel());

		it(".getSelections calls JobsAPI.getSelections", () => {
			SharedActionCreators.getSelections();
			assert.equal(result.getSelections, "calledWithNoArgs");
		});

		it(".getAllProducts calls JobsAPI.getAllProducts", () => {
			SharedActionCreators.getAllProducts();
			assert.equal(result.getAllProducts, "calledWithNoArgs");
		});

		it(".getUserProfile calls JobsAPI.getUserProfile", () => {
			SharedActionCreators.getUserProfile();
			assert.equal(result.getUserProfile, "calledWithNoArgs");
		});

		it(".saveDetails calls JobsAPI.saveDetails with an id and details", () => {
			SharedActionCreators.saveDetails(123, "hello hi");
			assert.deepEqual(result.saveDetails, [123, "hello hi"]);
		});

		it(".saveItem calls JobsAPI.saveItem with an id and item", () => {
			SharedActionCreators.saveItem(123, "hello hi");
			assert.deepEqual(result.saveItem, [123, "hello hi"]);
		});

		it(".createItem calls JobsAPI.createItem with an id and blueprint", () => {
			SharedActionCreators.createItem(123, {name: "hello hi"});
			assert.deepEqual(result.createSingleJobItem, [123, {name: "hello hi"}]);
		});

		it(".deleteItem calls JobsAPI.deleteItem with any arg and an immutable object", () => {
			SharedActionCreators.deleteItem(null, { get(thing) { return thing; } });
			assert.deepEqual(result.deleteSingleItem, "item_id");
		});

	});

	testPlease(toTest, SharedActionCreators);
});
