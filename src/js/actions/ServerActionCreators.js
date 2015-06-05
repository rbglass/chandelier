"use strict";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";

export function receiveSelections(selections) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_SELECTIONS,
		data: selections
	});
}

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

export function receiveUpdatedJob(jobObject) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_UPDATED_JOB,
		data: jobObject
	});
}

export function receiveSingleItem(itemObject) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_SINGLE_ITEM,
		data: itemObject
	});
}

export function receiveUpdatedItem(itemObject) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_UPDATED_ITEM,
		data: itemObject
	});
}
