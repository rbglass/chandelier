"use strict";
import { EventEmitter } from "events";
import { createStore } from "../utils/StoreUtils";
import JobConstants from "../constants/JobConstants";
import JobDispatcher from "../dispatchers/JobDispatcher";

var _state = {
	job: [],
	sortBy: [],
	filterBy: ""
};

var SingleJobStore = createStore({
	getState() {
		return _state;
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

		default:
			  break;
	}
});
