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

const onReceivingAction = action => {
	switch (action.type) {

		case ActionTypes.RECEIVE_SELECTIONS:
				selections = action.data;
				SelectionStore.emitChange();
				break;

	}
};

export default SelectionStore;

SelectionStore.dispatchToken = AppDispatcher.register(onReceivingAction);
