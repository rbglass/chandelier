"use strict";
import { createStore } from "../utils/StoreUtils";
import { genericSort } from "../utils/ConvenienceUtils";
import JobConstants from "../constants/JobConstants";
import JobDispatcher from "../dispatchers/JobDispatcher";

var _state = {
	job: [],
	sortBy: "",
	asc: false
};

var SingleJobStore = createStore({
	getSortedJobs() {
		const sorted = genericSort(_state.job, _state.sortBy, _state.asc);
	}
});

export default SingleJobStore;

JobDispatcher.register((payload) => {
	let action = payload.action;

	switch(action.type) {

		case JobConstants.RECEIVE_SINGLE_JOB:
				_state.job = action.data;
				SingleJobStore.emitChange();
				break;

		case JobConstants.SORT_ONE:
				if(action.data === _state.sortBy) {
					_state.asc = !_state.asc;
				}
				_state.sortBy = action.data;
				SingleJobStore.emitChange();
				break;

		default:
			  break;
	}
});
