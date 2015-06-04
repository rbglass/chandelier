"use strict";
import { createStore } from "../utils/StoreUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import { selections } from "../sampledata/data.js";

var selectionSet = {
	job_status: selections.job_status,
	order_type: selections.order_type,
	parts_status: selections.parts_status,
	payment: selections.payment
};

const SelectionStore = createStore({
	getSelections() {
		return selectionSet;
	}
});

export default SelectionStore;

AppDispatcher.register(action => {

});
