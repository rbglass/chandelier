"use strict";
import { createStore } from "../utils/StoreUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";

var currentPage = 0;
var rowsPerPage = 20;

const PaginationStore = createStore({
	getCurrentPage() {
		return currentPage;
	},
	getRowsPerPage() {
		return rowsPerPage;
	},
	getOffset() {
		return currentPage * rowsPerPage;
	}
});

const onReceivingAction = action => {

	switch (action.type) {

		case ActionTypes.CHANGE_PAGE_NUMBER:
				currentPage = action.data;
				PaginationStore.emitChange();
				break;

	}
};

export default PaginationStore;

AppDispatcher.register(onReceivingAction);
