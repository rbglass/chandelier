"use strict";
import I from "immutable";
import { createStore } from "../utils/StoreUtils";
import * as FilterUtils from "../utils/FilterUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import SelectionStore from "./SelectionStore";

const emptyFilters = I.fromJS({
	sortTerm: "shipping_date",
	isAsc: true,
	filterBy: "",
	dateField: "shipping_date",
	startDate: "",
	endDate: "",
	restrictions: {
		"job_status": {
			key: "job_status"
		},
		"order_type": {
			key: "order_type"
		},
		"payment": {
			key: "payment"
		},
		"parts_status": {
			key: "parts_status"
		}
	}
});

const defaultFilters = emptyFilters.setIn(
	["restrictions", "job_status", "options"],
	I.List(["Confirmed", "Packaged", "Dispatched"])
);

const keysToSearch = [
	"job_id", "client", "project", "notes"
];

var jobs = I.List(),
		jobLength = 0,
		filters = defaultFilters;

const JobsStore = createStore({
	getFilteredJobs(start, end) {
		let f = filters;
		let filterBy = f.get("filterBy");
		let dateField = f.get("dateField");
		let startDate = f.get("startDate");
		let endDate = f.get("endDate");
		let restrictions = f.get("restrictions");

		const filtered = jobs.filter(row => {
			const details = row.get("details");
			return (
				FilterUtils.satisfies(details, restrictions) &&
				FilterUtils.isWithinBounds(details.get(dateField), startDate, endDate) &&
				FilterUtils.contains(details, filterBy, keysToSearch)
			);
		});

		jobLength = filtered.size;
		return filtered.slice(start, end);
	},
	getFilters() {
		return filters;
	},
	getNumberOfJobs() {
		return jobLength;
	}
});

const onReceivingAction = action => {
	switch(action.type) {

		case ActionTypes.RECEIVE_ALL_JOBS:
				jobs = I.fromJS(action.data);
				JobsStore.emitChange();
				break;

		case ActionTypes.RECEIVE_UPDATED_JOB:
				jobs = jobs.map(job => {
					return job.get("job_id") === action.data.job_id ?
						I.fromJS(action.data) :
						job;
				});
				JobsStore.emitChange();
				break;

		// State change but not server interaction
		case ActionTypes.CHANGE_SINGLE_JOB_DETAILS:
				let id = action.data.id;
				jobs = jobs.map(job => {
					if (job.get("job_id") === id) {
						job = job.setIn(["details", action.data.key], action.data.value);
					}
					return job;
				});
				JobsStore.emitChange();
				break;

		// Table manipulation
		case ActionTypes.FILTER_JOBS_BY:
				filters = filters.set("filterBy", action.data);
				JobsStore.emitChange();
				break;

		case ActionTypes.SORT_JOBS:
				const asc = action.data === filters.get("sortTerm") ?
											!filters.get("isAsc") :
											false;
				filters = filters.set("isAsc", asc);
				filters = filters.set("sortTerm", action.data);

				JobsStore.emitChange();
				break;

		case ActionTypes.SET_JOBS_START_DATE:
				filters = filters.set("startDate", action.data);
				JobsStore.emitChange();
				break;

		case ActionTypes.SET_JOBS_END_DATE:
				filters = filters.set("endDate", action.data);
				JobsStore.emitChange();
				break;

		case ActionTypes.RESTRICT_JOBS_TO:
				if (filters.hasIn(["restrictions", action.data.key])) {
					filters = filters.setIn(["restrictions", action.data.key],  I.fromJS(action.data));
				}
				JobsStore.emitChange();
				break;

		case ActionTypes.CLEAR_JOBS_FILTERS:
				filters = emptyFilters;
				JobsStore.emitChange();
				break;

		case ActionTypes.DEFAULT_JOBS_FILTERS:
				filters = defaultFilters;
				JobsStore.emitChange();
				break;

		case ActionTypes.RECEIVE_ALL_SELECTIONS:
				AppDispatcher.waitFor([SelectionStore.dispatchToken]);
				const selections = SelectionStore.getSelections();
				const rIterable = filters.get("restrictions").keySeq();

				rIterable.forEach(r => {
					if(!filters.hasIn(["restrictions", r, "options"])) {
						filters = filters.setIn(["restrictions", r, "options"], selections.get(r));
					}
				});
				JobsStore.emitChange();
				break;

		default:
				break;
	}
};

export default JobsStore;

AppDispatcher.register(onReceivingAction);
