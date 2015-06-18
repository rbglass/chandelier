"use strict";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import * as JobsAPI from "../api/JobsAPI";
import yyyyMMdd from "../utils/yyyyMMdd";

export function startLoading() {
	AppDispatcher.dispatch({
		type: ActionTypes.IS_LOADING
	});
}

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

export function deleteItem(_, cells) {
	JobsAPI.deleteSingleItem(cells);
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
	const formattedDate = yyyyMMdd(date);
	AppDispatcher.dispatch({
		type: ActionTypes.SET_START_DATE,
		data: formattedDate
	});
}

export function setEndDate(date) {
	const formattedDate = yyyyMMdd(date);
	AppDispatcher.dispatch({
		type: ActionTypes.SET_END_DATE,
		data: formattedDate
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

export function changePageNumber(n) {
	AppDispatcher.dispatch({
		type: ActionTypes.CHANGE_PAGE_NUMBER,
		data: n
	});
}
