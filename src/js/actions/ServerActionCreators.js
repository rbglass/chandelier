"use strict";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";

export function receiveAllJobs(jobsArray) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_ALL_JOBS,
		data: jobsArray
	});
}

export function receiveSingleJob(jobObject) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_SINGLE_JOB,
		data: jobObject
	});
}

export function receiveAlert(alert) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_ALERT,
		data: alert
	});
}
