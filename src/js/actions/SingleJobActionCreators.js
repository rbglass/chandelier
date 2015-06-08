"use strict";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import * as JobsAPI from "../api/JobsAPI";

export function getSingleJob(jobId) {
	JobsAPI.getSingleJob(jobId);
}

export function createItem(blueprint) {
	JobsAPI.createSingleJobItem(blueprint);
}

export function saveItem(jobId, item) {
	JobsAPI.saveItem(jobId, item);
}

export function getPDF(jobId) {
	JobsAPI.getPDF(jobId);
}

export function deleteItem(id) {
	AppDispatcher.dispatch({
		type: ActionTypes.DELETE_ITEM,
		data: id
	});
}

export function changeItem(updateObj) {
	AppDispatcher.dispatch({
		type: ActionTypes.CHANGE_SINGLE_JOB_ITEM,
		data: updateObj
	});
}
