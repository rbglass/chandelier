"use strict";
import { createStore } from "../utils/StoreUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";

var alert = {},
		loadingTracker = [],
		isUnsaved = false;

const AlertStore = createStore({
	getAlert() {
		return alert;
	},
	getLoadStatus() {
		return loadingTracker.length > 0;
	},
	getUnsavedStatus() {
		return isUnsaved;
	}
});

const onReceivingAction = action => {
	let isServerAction = /RECEIVE/.test(action.type);
	let isClientAction = /CHANGE/.test(action.type);

	if (isServerAction) {
		isUnsaved = false;
		loadingTracker.pop();
	} else if (isClientAction) {
		isUnsaved = true;
	} else if (action.type === ActionTypes.IS_LOADING) {
		isUnsaved = false;
		loadingTracker.push(1);
	}

	if (action.type === ActionTypes.RECEIVE_ALERT) {
		alert = action.data;
	} else {
		alert = null;
	}
	AlertStore.emitChange();
};

export default AlertStore;

AppDispatcher.register(onReceivingAction);

