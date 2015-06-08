"use strict";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import * as JobsAPI from "../api/JobsAPI";

export function getSelections() {
	JobsAPI.getSelections();
}

export function saveDetails(jobId, details) {
	JobsAPI.saveDetails(jobId, details);
}

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

export function changeDetails(updateObj) {
	AppDispatcher.dispatch({
		type: ActionTypes.CHANGE_SINGLE_JOB_DETAILS,
		data: updateObj
	});
}
