"use strict";
import { createStore } from "../utils/StoreUtils";
import { contains, genericSort, isWithinBounds } from "../utils/ConvenienceUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";

var jobs = [],
		filters = {
			sortTerm: "",
			isAsc: false,
			filterBy: "",
			startDate: null,
			endDate: null
		};

const JobsStore = createStore({

	getFilteredAndSortedJobs() {
		let f = filters;
		const filtered = jobs.filter(row => {
			return contains(row.details, f.filterBy) && isWithinBounds(row.details, f.startDate, f.endDate);
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

		case ActionTypes.RECEIVE_SINGLE_JOB:
				let newJobs = [];
				jobs.forEach(job => {
					if(job.job_id === action.data.job_id) {
						newJobs.push(action.data);
					} else {
						newJobs.push(job);
					}
				});
				if(newJobs.length === jobs.length) {
					newJobs.push(action.data);
				}
				jobs = newJobs;
				JobsStore.emitChange();
				break;

		// State change but not server interaction
		case ActionTypes.UPDATE_DETAILS:
				let id = action.data.id;
				jobs = jobs.map(job => {
					if (job.job_id === id) {
						job.details[action.data.key] = action.data.value;
					}
					return job;
				});
				JobsStore.emitChange();
				break;

		// Table manipulation
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
