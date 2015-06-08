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

const onReceivingAction = action => {
	switch (action.type) {

		case ActionTypes.RECEIVE_JOB_ITEMS:
				jobItems = action.data;
				JobItemsStore.emitChange();
				break;

	}
};

export default JobItemsStore;

AppDispatcher.register(onReceivingAction);
