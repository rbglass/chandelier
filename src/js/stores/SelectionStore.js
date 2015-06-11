"use strict";
import { createStore } from "../utils/StoreUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";

var selections = {};

const SelectionStore = createStore({
	getSelections() {
		return selections;
	}
});

const onReceivingAction = action => {
	switch (action.type) {

		case ActionTypes.RECEIVE_SELECTIONS:
				Object.keys(action.data).forEach(type => {
					selections[type] = action.data[type].map(sel => sel.label);
				});
				SelectionStore.emitChange();
				break;

	}
};

export default SelectionStore;

SelectionStore.dispatchToken = AppDispatcher.register(onReceivingAction);
