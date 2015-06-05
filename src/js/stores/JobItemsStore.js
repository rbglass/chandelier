"use strict";
import { createStore } from "../utils/StoreUtils";
import ActionTypes from "../utils/StoreUtils";
import AppDispatcher from "../dispatchers/AppDispatcher";

var jobItems = {
	items: []
};

const JobItemsStore = createStore({
	getJobItems() {
		return jobItems.items;
	}
});

export default JobItemsStore;

AppDispatcher.register(action => {
	switch (action.type) {

		case ActionTypes.RECEIVE_JOB_ITEMS:
				jobItems.items = action.data;
				JobItemsStore.emitChange();
				break;

	}
});
