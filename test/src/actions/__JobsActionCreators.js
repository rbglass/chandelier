"use strict";
import assert from "assert";
import sinon from "sinon";
import testPlease from "../helpers/testPlease";
import * as JobsAPI from "../../../src/js/api/JobsAPI";
import * as JobsActionCreators from "../../../src/js/actions/JobsActionCreators";

const toTest = [

	{
		fn: "sortBy",
		type: "SORT_JOBS",
		give: ["doctor"],
		want: "doctor",
		desc: "a sort string"
	},

	{
		fn: "setFilter",
		type: "FILTER_JOBS_BY",
		give: ["hat"],
		want: "hat",
		desc: "a filter string"
	},

	{
		fn: "setStartDate",
		type: "SET_JOBS_START_DATE",
		give: [new Date(Date.UTC(2015, 11, 5))],
		want: "2015-12-05",
		desc: "a start date"
	},

	{
		fn: "setEndDate",
		type: "SET_JOBS_END_DATE",
		give: [new Date(Date.UTC(2015, 3, 5))],
		want: "2015-04-05",
		desc: "an end date"
	},

	{
		fn: "restrictTo",
		type: "RESTRICT_JOBS_TO",
		give: ["key", "opts"],
		want: { key: "key", options: "opts"},
		desc: "a restriction obj"
	},

	{
		fn: "clearJobsFilters",
		type: "CLEAR_JOBS_FILTERS",
		give: [],
		desc: "an action"
	}
];

describe("JobsActionCreators", () => {

	it(".getAllJobs calls JobsAPI.getAllJobs", () => {
		let result;

		const getStub = sinon.stub(JobsAPI, "getAllJobs", () => {
			result = true;
		});

		JobsActionCreators.getAllJobs();
		assert(result);
		getStub.restore();
	});

	it(".createSingleJob calls JobsAPI.createSingleJob", () => {
		let result;

		const getStub = sinon.stub(JobsAPI, "createSingleJob", () => {
			result = true;
		});

		JobsActionCreators.createSingleJob();
		assert(result);
		getStub.restore();
	});

	testPlease(toTest, JobsActionCreators);
});
