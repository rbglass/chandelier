"use strict";
import { createStore } from "../utils/StoreUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";

var alert = {},
		isLoading = false;

const AlertStore = createStore({
	getAlert() {
		return alert;
	},
	getLoadStatus() {
		return isLoading;
	}
});

const onReceivingAction = action => {
	let isServerAction = /RECEIVE/.test(action.type);

	if (action.type === ActionTypes.RECEIVE_ALERT) {
		alert = action.data;
	}
	if (isServerAction) {
		isLoading = false;
	} else if (action.type === ActionTypes.IS_LOADING) {
		isLoading = true;
	}
};

export default AlertStore;

AppDispatcher.register(onReceivingAction);

