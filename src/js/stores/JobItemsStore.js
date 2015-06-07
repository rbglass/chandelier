"use strict";
import { createStore } from "../utils/StoreUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";

var jobItems = [];

const JobItemsStore = createStore({
	getJobItems() {
		return jobItems;
	}
});

export default JobItemsStore;

AppDispatcher.register(action => {
	switch (action.type) {

		case ActionTypes.RECEIVE_JOB_ITEMS:
				jobItems = action.data;
				JobItemsStore.emitChange();
				break;

	}
});
