"use strict";
import { createStore } from "../utils/StoreUtils";
import { genericSort } from "../utils/ConvenienceUtils";
import JobConstants from "../constants/JobConstants";
import JobDispatcher from "../dispatchers/JobDispatcher";
import { details, items} from "../sampledata/data.js";

var state = {
	details: details,
	items: items,
	sortBy: "",
	asc: false
};

var SingleJobStore = createStore({
	getSortedItems() {
		return genericSort(state.items, state.sortBy, state.asc);
	},
	getJobDetails() {
		return state.details;
	}
});

export default SingleJobStore;

JobDispatcher.register((payload) => {
	let action = payload.action;

	switch(action.type) {

		case JobConstants.RECEIVE_SINGLE_JOB:
				state.job = action.data;
				SingleJobStore.emitChange();
				break;

		case JobConstants.SORT_ONE:
				if(action.data === state.sortBy) {
					state.asc = !state.asc;
				}
				state.sortBy = action.data;
				SingleJobStore.emitChange();
				break;

		default:
				break;
	}
});
