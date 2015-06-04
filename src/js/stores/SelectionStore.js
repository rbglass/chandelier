"use strict";
import { createStore } from "../utils/StoreUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";

var selections = {
	job_status: [],
	order_type: [],
	parts_status: [],
	payment: []
};

const SelectionStore = createStore({
	getSelections() {
		return selections;
	}
});

export default SelectionStore;

AppDispatcher.register(action => {
	switch (action.type) {

		case ActionTypes.RECEIVE_SELECTIONS:
				selections = action.data;
				SelectionStore.emitChange();
				break;

	}
});
