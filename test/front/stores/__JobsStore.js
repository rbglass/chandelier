"use strict";
import I from "immutable";
import sinon from "sinon";
import assert from "assert";
import rewire from "rewire";
import { jobs as samplejobs } from "../testdata/jobs";
import { sameVal } from "../setup/utils";
import SelectionStore from "../../../src/js/stores/SelectionStore";
import AppDispatcher from "../../../src/js/dispatchers/AppDispatcher";

describe("JobsStore", () => {
	let JobsStore, onReceivingAction;

	beforeEach(() => {
		JobsStore = rewire("../../../src/js/stores/JobsStore");
		onReceivingAction = JobsStore.__get__("onReceivingAction");
		JobsStore.__set__("jobs", I.fromJS(samplejobs));
	});

	it("#getFilteredJobs() returns a filtered List", () => {
		const filters = I.fromJS({
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
		});

		JobsStore.__set__("filters", filters);

		const jobsWeGotBack = JobsStore.getFilteredJobs();
		const jobsWeWant = I.fromJS(samplejobs.filter((e) =>
			Date.parse(e.details.shipping_date) > Date.parse(filters.get("startDate"))
		));

		sameVal(jobsWeGotBack, jobsWeWant);
	});

	it("#getFilters returns a Map of filters", () => {
		const filters = I.fromJS({
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
		});
		JobsStore.__set__("filters", filters);

		assert.deepEqual(JobsStore.getFilters(), filters);
	});

	it("#getNumberOfJobs returns the size of the jobs List", () => {
		JobsStore.__set__("jobLength", 3);
		assert.equal(JobsStore.getNumberOfJobs(), 3);
		JobsStore.__set__("jobLength", 5);
		assert.equal(JobsStore.getNumberOfJobs(), 5);
	});

	it("#updates the private jobs List upon a RECEIVE_ALL_JOBS action", () => {
		const jobAction = {
			type: "RECEIVE_ALL_JOBS",
			data: samplejobs
		};

		onReceivingAction(jobAction);
		sameVal(JobsStore.getFilteredJobs(), I.fromJS(jobAction.data.filter(e =>
			["Confirmed", "Packaged"].indexOf(e.details.job_status) !== -1
		)));
	});

	it("#updates the private jobs List upon a RECEIVE_UPDATED_JOB action", () => {
		const jobAction = {
			type: "RECEIVE_UPDATED_JOB",
			data: {
				job_id: samplejobs[0].job_id,
				details: {
					job_id: samplejobs[0].job_id,
					job_status: "Packaged"
				}
			}
		};

		onReceivingAction(jobAction);
		const jobsWeGotBack = JobsStore.getFilteredJobs();
		const samplesWithUpdate = [jobAction.data].concat(samplejobs.slice(1)).filter(e =>
			["Confirmed", "Packaged"].indexOf(e.details.job_status) !== -1
		);

		sameVal(jobsWeGotBack, I.fromJS(samplesWithUpdate));
	});

	it("#updates the respective job in the jobs List upon a CHANGE_SINGLE_JOB_DETAILS action", () => {
		const updatedInfo = {
			type: "CHANGE_SINGLE_JOB_DETAILS",
			data: {
				id: samplejobs[0].job_id,
				key: "job_status",
				value: "Packaged"
			}
		};
		onReceivingAction(updatedInfo);

		const jobsWeGotBack = JobsStore.getFilteredJobs();
		const jobWeGotBack = jobsWeGotBack.filter((e) => {
			return e.get("job_id") === updatedInfo.data.id;
		}).last();

		assert.equal(jobWeGotBack.getIn(["details", updatedInfo.data.key]), updatedInfo.data.value);
	});

	it("#updates the filterBy filter upon a FILTER_BY action", () => {
		const filterTerm = "JIM";
		assert.notEqual(JobsStore.getFilters().get("filterBy"), filterTerm);

		onReceivingAction({
			type: "FILTER_BY",
			data: filterTerm
		});

		assert.equal(JobsStore.getFilters().get("filterBy"), filterTerm);
	});

	it("#updates the sortTerm filter upon a SORT_ONE action, flipping isAsc if same, & sorts the List", () => {
		const sortTerm = "client";
		const sortTerm2 = "shipping_date";
		let filters;

		onReceivingAction({
			type: "SORT_ONE",
			data: sortTerm
		});

		const filtersWeGotBack = JobsStore.getFilters();

		sameVal(filtersWeGotBack.get("sortTerm"), sortTerm);
		sameVal(filtersWeGotBack.get("isAsc"), false);
		sameVal(JobsStore.getFilteredJobs(), I.fromJS(samplejobs.slice(0).sort((a, b) =>
			b.details[sortTerm].localeCompare(a.details[sortTerm])
		).filter(e => ["Confirmed", "Packaged"].indexOf(e.details.job_status) !== -1)));

		onReceivingAction({
			type: "SORT_ONE",
			data: sortTerm
		});

		const moreFiltersWeGotBack = JobsStore.getFilters();

		sameVal(moreFiltersWeGotBack.get("sortTerm"), sortTerm);
		sameVal(moreFiltersWeGotBack.get("isAsc"), true);
		sameVal(JobsStore.getFilteredJobs(), I.fromJS(samplejobs.slice(0).sort((a, b) =>
			a.details[sortTerm].localeCompare(b.details[sortTerm])
		).filter(e => ["Confirmed", "Packaged"].indexOf(e.details.job_status) !== -1)));

		onReceivingAction({
			type: "SORT_ONE",
			data: sortTerm2
		});

		const evenMoreFiltersWeGotback = JobsStore.getFilters();

		sameVal(evenMoreFiltersWeGotback.get("sortTerm"), sortTerm2);
		sameVal(evenMoreFiltersWeGotback.get("isAsc"), false);
		// sameVal(JobsStore.getFilteredJobs(), I.fromJS(samplejobs.sort((a, b) =>
		// 	b.details[sortTerm] - a.details[sortTerm]
		// )));
	});

	it("#updates the startDate filter upon a SET_START_DATE action", () => {
		const startDate = "1999-01-01";

		onReceivingAction({
			type: "SET_START_DATE",
			data: startDate
		});

		assert.equal(JobsStore.getFilters().get("startDate"), startDate);
	});

	it("#updates the endDate filter upon a SET_END_DATE action", () => {
		const endDate = "2019-01-01";

		onReceivingAction({
			type: "SET_END_DATE",
			data: endDate
		});

		assert.equal(JobsStore.getFilters().get("endDate"), endDate);
	});

	it("#updates the restrictions object upon a RESTRICT_TO action", () => {
		const newRestrictions = {
			key: "job_status",
			options: ["Accepted", "TBC", "Non-Starter"]
		};
		onReceivingAction({
			type: "RESTRICT_TO",
			data: newRestrictions
		});
		const filtersWeGotBack = JobsStore.getFilters().getIn(["restrictions", newRestrictions.key]);

		sameVal(filtersWeGotBack, I.fromJS(newRestrictions));
	});

	it("#populates each restriction's options upon a RECEIVE_SELECTIONS action", () => {
		const selections = I.fromJS({
			job_status: ["hi", "mate"],
			order_type: ["nice", "one"]
		});

		const dispyStub = sinon.stub(AppDispatcher, "waitFor", () => {
			return true;
		});
		const SelStoreStub = sinon.stub(SelectionStore, "getSelections", () => {
			return selections;
		});
		let filters;

		onReceivingAction({
			type: "RECEIVE_SELECTIONS"
		});

		filters = JobsStore.getFilters();

		Object.keys(selections).forEach(function(key) {
			sameVal(filters.getIn(["restrictions", key, "options"], selections.get(key)));
		});
	});
});
