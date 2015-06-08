"use strict";
var sinon = require("sinon");
var assert = require("assert");
var rewire = require("rewire");
var samplejobs = require("../testdata/jobs").jobs;
var SelectionStore = require("../../../src/js/stores/SelectionStore");
var AppDispatcher = require("../../../src/js/dispatchers/AppDispatcher");

describe("JobsStore", function() {
	beforeEach(function() {
		this.JobsStore = rewire("../../../src/js/stores/JobsStore");
		this.onReceivingAction = this.JobsStore.__get__("onReceivingAction");
		this.JobsStore.__set__("jobs", samplejobs);
	});

	it("#getFilteredAndSortedJobs() returns a filtered and sorted array", function() {
		var filters = {
			sortTerm: "job_id",
			isAsc: false,
			filterBy: "",
			dateField: "shipping_date",
			startDate: "2016-01-01",
			endDate: "",
			restrictions: {
				"job_status": {
					key: "job_status"
				},
				"order_type": {
					key: "order_type"
				}
			}
		};

		assert.deepEqual(this.JobsStore.getFilteredAndSortedJobs(), samplejobs);
		this.JobsStore.__set__("filters", filters);
		assert.deepEqual(this.JobsStore.getFilteredAndSortedJobs(), samplejobs.filter(function(e) {
			return Date.parse(e.details.shipping_date) > Date.parse(filters.startDate);
		}));
	});

	it("#getFilters returns a set of filters", function() {
		var filters = {
			sortTerm: "job_id",
			isAsc: false,
			filterBy: "",
			dateField: "shipping_date",
			startDate: "2016-01-01",
			endDate: "",
			restrictions: {
				"job_status": {
					key: "job_status"
				},
				"order_type": {
					key: "order_type"
				}
			}
		};
		this.JobsStore.__set__("filters", filters);

		assert.deepEqual(this.JobsStore.getFilters(), filters);
	});

	it("#updates the private jobs array upon a RECEIVE_ALL_JOBS action", function() {
		var jobAction = {
			type: "RECEIVE_ALL_JOBS",
			data: [
				{ job_id: "RB0102", details: {shipping_date: "2015-01-01" } },
				{ job_id: "RB0104", details: {shipping_date: "2015-03-01" } }
			]
		};

		this.onReceivingAction(jobAction);
		assert.deepEqual(this.JobsStore.getFilteredAndSortedJobs(), jobAction.data);
	});

	it("#updates the respective job in the jobs array upon a RECEIVE_UPDATED_JOB action", function() {
		var jobWeGotBack;
		var updatedJob = {
			type: "RECEIVE_UPDATED_JOB",
			data: {
				job_id: "RB2234",
				details: {
					job_id: "RB2234",
					client: "ALEX"
				}
			}
		};

		this.onReceivingAction(updatedJob);

		jobWeGotBack = this.JobsStore.getFilteredAndSortedJobs().filter(function(e) {
			return e.job_id === updatedJob.data.job_id;
		})[0];

		assert.deepEqual(jobWeGotBack.details, updatedJob.data.details);
	});

	it("#updates the respective job in the jobs array upon a CHANGE_SINGLE_JOB_DETAILS action", function() {
		var jobWeGotBack;
		var updatedInfo = {
			type: "CHANGE_SINGLE_JOB_DETAILS",
			data: {
				id: "RB2234",
				key: "job_status",
				value: "Accepted"
			}
		};
		this.onReceivingAction(updatedInfo);

		jobWeGotBack = this.JobsStore.getFilteredAndSortedJobs().filter(function(e) {
			return e.job_id === updatedInfo.data.id;
		})[0];

		assert.deepEqual(jobWeGotBack.details[updatedInfo.data.key], updatedInfo.data.value);
	});

	it("#updates the filterBy filter upon a FILTER_BY action", function() {
		var filterTerm = "JIM";
		assert.notEqual(this.JobsStore.getFilters().filterBy, filterTerm);

		this.onReceivingAction({
			type: "FILTER_BY",
			data: filterTerm
		});

		assert.equal(this.JobsStore.getFilters().filterBy, filterTerm);
	});

	it("#updates the sortTerm filter a SORT_ONE action, flipping isAsc if the term is the same, else false", function() {
		var sortTerm = "job_status";
		var sortTerm2 = "shipping_date";
		var filters;

		this.onReceivingAction({
			type: "SORT_ONE",
			data: sortTerm
		});

		assert.equal(this.JobsStore.getFilters().sortTerm, sortTerm);
		assert.equal(this.JobsStore.getFilters().isAsc, false);

		this.onReceivingAction({
			type: "SORT_ONE",
			data: sortTerm
		});

		assert.equal(this.JobsStore.getFilters().sortTerm, sortTerm);
		assert.equal(this.JobsStore.getFilters().isAsc, true);

		this.onReceivingAction({
			type: "SORT_ONE",
			data: sortTerm2
		});

		assert.equal(this.JobsStore.getFilters().sortTerm, sortTerm2);
		assert.equal(this.JobsStore.getFilters().isAsc, false);
	});

	it("#updates the startDate filter upon a SET_START_DATE action", function() {
		var startDate = "1999-01-01";

		this.onReceivingAction({
			type: "SET_START_DATE",
			data: startDate
		});

		assert.equal(this.JobsStore.getFilters().startDate, startDate);
	});

	it("#updates the endDate filter upon a SET_END_DATE action", function() {
		var endDate = "2019-01-01";

		this.onReceivingAction({
			type: "SET_END_DATE",
			data: endDate
		});

		assert.equal(this.JobsStore.getFilters().endDate, endDate);
	});

	it("#updates the restrictions object upon a RESTRICT_TO action", function() {
		var newRestrictions = {
			key: "job_status",
			options: ["Accepted", "TBC", "Non-Starter"]
		};
		this.onReceivingAction({
			type: "RESTRICT_TO",
			data: newRestrictions
		});

		assert.deepEqual(this.JobsStore.getFilters().restrictions[newRestrictions.key], newRestrictions);
	});

	it("#populates each restriction's options upon a RECEIVE_SELECTIONS action", function() {
		var selections = {
			job_status: ["hi", "mate"],
			order_type: ["nice", "one"]
		};

		var dispyStub = sinon.stub(AppDispatcher, "waitFor", function() {
			return true;
		});
		var SelStoreStub = sinon.stub(SelectionStore, "getSelections", function() {
			return selections;
		});
		var filters;

		this.onReceivingAction({
			type: "RECEIVE_SELECTIONS"
		});

		filters = this.JobsStore.getFilters();

		Object.keys(selections).forEach(function(key) {
			assert.deepEqual(filters.restrictions[key].options, selections[key]);
		});
	});
});
