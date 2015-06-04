"use strict";
import { createStore } from "../utils/StoreUtils";
import { contains, genericSort } from "../utils/ConvenienceUtils";
import JobConstants from "../constants/JobConstants";
import JobDispatcher from "../dispatchers/JobDispatcher";
import { jobs } from "../sampledata/data.js";

var state = {
	jobs: jobs,
	sortBy: "",
	asc: false,
	filterBy: ""
};

var JobStore = createStore({

	getFilteredAndSortedJobs() {
		const filtered = state.jobs.filter(row => {
			return contains(row, state.filterBy);
		});

		return genericSort(filtered, state.sortBy, state.asc);
	},
	getFilters() {
		return {
			sortBy: state.sortBy,
			asc: state.asc,
			filterBy: state.filterBy
		};
	}
});

export default JobStore;

JobDispatcher.register(payload => {
	let action = payload.action;

	switch(action.type) {

		case JobConstants.RECEIVE_ALL_JOBS:
				state.jobs = action.data;
				JobStore.emitChange();
				break;

		case JobConstants.FILTER_BY:
				state.filterBy = action.data;
				JobStore.emitChange();
				break;

		case JobConstants.SORT_ONE:
				if(action.data === state.sortBy) {
					state.asc = !state.asc;
				}
				state.sortBy = action.data;
				JobStore.emitChange();
				break;

		default:
				break;
	}
});
