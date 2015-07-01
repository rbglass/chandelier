"use strict";
import assert from "assert";
import sinon from "sinon";
import testPlease from "../helpers/testPlease";
import * as JobsAPI from "../../../src/js/api/JobsAPI";
import * as JobItemsActionCreators from "../../../src/js/actions/JobItemsActionCreators";

const toTest = [

	{
		fn: "sortBy",
		type: "SORT_ITEMS",
		give: ["doctor"],
		want: "doctor",
		desc: "a sort string"
	},

	{
		fn: "setFilter",
		type: "FILTER_ITEMS_BY",
		give: ["hat"],
		want: "hat",
		desc: "a filter string"
	},

	{
		fn: "setStartDate",
		type: "SET_ITEMS_START_DATE",
		give: [new Date(Date.UTC(2015, 11, 5))],
		want: "2015-12-05",
		desc: "a start date"
	},

	{
		fn: "setEndDate",
		type: "SET_ITEMS_END_DATE",
		give: [new Date(Date.UTC(2015, 3, 5))],
		want: "2015-04-05",
		desc: "an end date"
	},

	{
		fn: "restrictTo",
		type: "RESTRICT_ITEMS_TO",
		give: ["key", "opts"],
		want: { key: "key", options: "opts"},
		desc: "a restriction obj"
	},

	{
		fn: "clearItemsFilters",
		type: "CLEAR_ITEMS_FILTERS",
		give: [],
		desc: "an action"
	}
];

describe("JobItemsActionCreators", () => {

	it(".getAllItems calls JobsAPI.getAllItems", () => {
		let result;

		const getStub = sinon.stub(JobsAPI, "getAllItems", () => {
			result = true;
		});

		JobItemsActionCreators.getAllItems();
		assert(result);
		getStub.restore();
	});

	testPlease(toTest, JobItemsActionCreators);
});
