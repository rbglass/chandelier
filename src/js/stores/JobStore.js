"use strict";
import { EventEmitter } from "events";
import { createStore } from "../utils/StoreUtils";
import { contains, genericSort } from "../utils/ConvenienceUtils";
import JobConstants from "../constants/JobConstants";
import JobDispatcher from "../dispatchers/JobDispatcher";

var _state = {
	jobs: [],
	sortBy: "",
	asc: false,
	filterBy: ""
};

var JobStore = createStore({
	getJobs() {
		let filtered = _state.jobs.filter(row => {
			contains(row, _state.filterBy);
		});

		return genericSort(filtered, _state.sortBy, _state.asc);
	}
});

export default JobStore;

JobDispatcher.register(payload => {
	let action = payload.action;

	switch(action.type) {

		case JobConstants.RECEIVE_ALL_JOBS:
				_state.jobs = action.data;
				JobStore.emitChange();
				break;

		default:
			  break;
	}
});
