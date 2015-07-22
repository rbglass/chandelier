"use strict";
import { createStore } from "../utils/StoreUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";

const BUFFER_ROWS = 3;
const ROW_HEIGHT = 51;

var tableHeight = 500;
var currentY = 0;

const PaginationStore = createStore({
	getDisplayStart() {
		return Math.floor((currentY / ROW_HEIGHT)) - BUFFER_ROWS;
	},
	getDisplayEnd() {
		return Math.floor((currentY + tableHeight) / ROW_HEIGHT) + BUFFER_ROWS;
	},
	getCurrentY() {
		return currentY;
	},
	getRowHeight() {
		return ROW_HEIGHT;
	}
});

const onReceivingAction = action => {
	const shouldResetTo0 = /FILTER/.test(action.type) ||
													/RESTRICT/.test(action.type);

	if (shouldResetTo0) {
		currentY = 0;
		PaginationStore.emitChange();
	} else {

		switch (action.type) {

			case ActionTypes.SET_CURRENT_Y:
					currentY = action.data;
					PaginationStore.emitChange();
					break;

			case ActionTypes.SET_TABLE_HEIGHT:
					tableHeight = action.data;
					PaginationStore.emitChange();
					break;

		}

	}

};

export default PaginationStore;

AppDispatcher.register(onReceivingAction);
