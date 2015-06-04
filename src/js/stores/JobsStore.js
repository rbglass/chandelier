"use strict";
import { createStore } from "../utils/StoreUtils";
import { contains, genericSort, isWithinBounds } from "../utils/ConvenienceUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import { jobs as sampledata } from "../sampledata/data.js";

var jobs = sampledata,
		filters = {
			sortTerm: "",
			isAsc: false,
			filterBy: "",
			startDate: null,
			endDate: null
		};

var JobsStore = createStore({

	getFilteredAndSortedJobs() {
		let f = filters;

		const filtered = jobs.filter(row => {
			return contains(row, f.filterBy) && isWithinBounds(row, f.startDate, f.endDate);
		});

		const sorted = genericSort(filtered, f.sortTerm, f.isAsc);
		return sorted;
	},

	getFilters() {
		return filters;
	}
});

export default JobsStore;

AppDispatcher.register(action => {

	switch(action.type) {

		case ActionTypes.RECEIVE_ALL_JOBS:
				jobs = action.data;
				JobsStore.emitChange();
				break;

		case ActionTypes.UPDATE_JOB:
				let id = action.data.job_id;
				jobs = jobs.map(job => {
					if (job.job_id === id) {
						job[action.data.key] = action.data.value;
					}
				});
				JobsStore.emitChange();
				break;

		case ActionTypes.FILTER_BY:
				filters.filterBy = action.data;
				JobsStore.emitChange();
				break;

		case ActionTypes.SORT_ONE:
				if(action.data === filters.sortTerm) {
					filters.isAsc = !filters.isAsc;
				} else {
					filters.isAsc = false;
				}
				filters.sortTerm = action.data;
				JobsStore.emitChange();
				break;

		case ActionTypes.SET_START_DATE:
				filters.startDate = action.data;
				JobsStore.emitChange();
				break;

		case ActionTypes.SET_END_DATE:
				filters.endDate = action.data;
				JobsStore.emitChange();
				break;

		default:
				break;
	}
});
