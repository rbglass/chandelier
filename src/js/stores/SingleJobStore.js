"use strict";
import { createStore } from "../utils/StoreUtils";
import { genericSort } from "../utils/ConvenienceUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import { details, items} from "../sampledata/data.js";

var job = {
			details: details,
			items: items
		},
		filters = {
			sortTerm: "",
			isAsc: false
		};

var SingleJobStore = createStore({
	getSortedItems() {
		return genericSort(job.items, filters.sortTerm, filters.isAsc);
	},
	getJobDetails() {
		return job.details;
	},
	getFilters() {
		return filters;
	}
});

export default SingleJobStore;

AppDispatcher.register(action => {

	switch(action.type) {

		case ActionTypes.RECEIVE_SINGLE_JOB:
				job = action.data;
				SingleJobStore.emitChange();
				break;

		// Will be destroyed when api ready
		case ActionTypes.UPDATE_ITEM:
				let d = action.data;
				// eww mutable
				job.items = job.items.map(jobitem => {
					if(jobitem.item === d.item) {
						jobitem[d.key] = d.value;
					}
					return jobitem;
				});
				SingleJobStore.emitChange();
				break;

		case ActionTypes.UPDATE_DETAILS:
				job.details[action.data.key] = action.data.value;
				SingleJobStore.emitChange();
				break;

		case ActionTypes.SORT_ONE:
				if(action.data === filters.sortTerm) {
					filters.isAsc = !filters.isAsc;
				}
				filters.sortTerm = action.data;
				SingleJobStore.emitChange();
				break;

		default:
				break;
	}
});
