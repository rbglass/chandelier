"use strict";
import { createStore } from "../utils/StoreUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";

const BUFFER_ROWS = 2;
const ROW_HEIGHT = 51;

var currentPage = 0;
var rowsPerPage = 50;

const PaginationStore = createStore({
	getCurrentPage() {
		return currentPage;
	},
	getRowsPerPage() {
		return rowsPerPage;
	},
	getOffset() {
		return currentPage * rowsPerPage || 0;
	}
});

const onReceivingAction = action => {
	const shouldResetTo0 = /FILTER/.test(action.type) ||
													/RESTRICT/.test(action.type);

	if (shouldResetTo0) {
		currentPage = 0;
		rowsPerPage = 50;
		PaginationStore.emitChange();
	} else {

		switch (action.type) {

			case ActionTypes.SWITCH_PAGE_NUMBER:
					currentPage = action.data;
					PaginationStore.emitChange();
					break;

			case ActionTypes.SET_ROWS_PER_PAGE:
					rowsPerPage = action.data;
					PaginationStore.emitChange();
					break;

		}

	}

};

export default PaginationStore;

AppDispatcher.register(onReceivingAction);
