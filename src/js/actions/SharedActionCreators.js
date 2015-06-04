"use strict";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import * as JobsAPI from "../api/JobsAPI";

export function recieveAlert(alert) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_ALERT,
		data: alert
	});
}

export function sortBy(field) {
	AppDispatcher.dispatch({
		type: ActionTypes.SORT_ONE,
		data: field
	});
}

export function updateSingleJobDetails(id, updateObj) {
	JobsAPI.updateSingleJobDetails(id, updateObj);
	// AppDispatcher.dispatch({
	// 	type: ActionTypes.UPDATE_SINGLE_JOB_DETAILS,
	// 	data: updateObj
	// });
}

export function getSelections() {
	JobsAPI.getSelections();
}
