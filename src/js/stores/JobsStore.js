"use strict";
import { createStore } from "../utils/StoreUtils";
import { contains, genericSort } from "../utils/ConvenienceUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import { jobs as sampledata } from "../sampledata/data.js";

var jobs = sampledata,
		filters = {
			sortBy: "",
			asc: false,
			filterBy: "",
			startDate: "",
			endDate: ""
		};

var JobStore = createStore({

	getFilteredAndSortedJobs() {
		const filtered = jobs.filter(row => {
			return contains(row, filters.filterBy);
		});

		return genericSort(filtered, filters.sortBy, filters.asc);
	},
	getFilters() {
		return filters;
	}
});

export default JobStore;

AppDispatcher.register(action => {

	switch(action.type) {

		case ActionTypes.RECEIVE_ALL_JOBS:
				jobs = action.data;
				JobStore.emitChange();
				break;

		case ActionTypes.FILTER_BY:
				filters.filterBy = action.data;
				JobStore.emitChange();
				break;

		case ActionTypes.SORT_ONE:
				if(action.data === filters.sortBy) {
					filters.asc = !filters.asc;
				}
				filters.sortBy = action.data;
				JobStore.emitChange();
				break;

		case ActionTypes.SET_START_DATE:
			filters.startDate = action.data;
			JobStore.emitChange();
			break;

		case ActionTypes.SET_END_DATE:
			filters.endDate = action.data;
			JobStore.emitChange();
			break;

		default:
				break;
	}
});
