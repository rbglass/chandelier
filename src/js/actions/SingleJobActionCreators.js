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

export function updateItem(updateObj) {
	AppDispatcher.dispatch({
		type: ActionTypes.UPDATE_ITEM,
		data: updateObj
	});
}

export function deleteItem(id) {
	AppDispatcher.dispatch({
		type: ActionTypes.DELETE_ITEM,
		data: id
	});
}
