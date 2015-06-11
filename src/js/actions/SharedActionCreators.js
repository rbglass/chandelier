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

export function createItem(jobId, blueprint) {
	JobsAPI.createSingleJobItem(jobId, blueprint);
}

export function saveItem(itemId, item) {
	JobsAPI.saveItem(itemId, item);
}

export function deleteItem(jobId, cells) {
	const itemId = cells.item_id;
	JobsAPI.deleteSingleItem(jobId, itemId);
}

export function getAllProducts() {
	JobsAPI.getAllProducts();
}

export function changeItem(updateObj) {
	AppDispatcher.dispatch({
		type: ActionTypes.CHANGE_SINGLE_JOB_ITEM,
		data: updateObj
	});
}

export function changeDetails(updateObj) {
	AppDispatcher.dispatch({
		type: ActionTypes.CHANGE_SINGLE_JOB_DETAILS,
		data: updateObj
	});
}


export function receiveAlert(alert) {
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

export function setFilter(text) {
	AppDispatcher.dispatch({
		type: ActionTypes.FILTER_BY,
		data: text
	});
}

export function setStartDate(date) {
	AppDispatcher.dispatch({
		type: ActionTypes.SET_START_DATE,
		data: date
	});
}

export function setEndDate(date) {
	AppDispatcher.dispatch({
		type: ActionTypes.SET_END_DATE,
		data: date
	});
}

export function restrictTo(key, options) {
	AppDispatcher.dispatch({
		type: ActionTypes.RESTRICT_TO,
		data: {
			key: key,
			options: options
		}
	});
}
