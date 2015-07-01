"use strict";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import yyyyMMdd from "../utils/yyyyMMdd";
import * as JobsAPI from "../api/JobsAPI";

export function getAllItems() {
	JobsAPI.getAllItems();
}

export function sortBy(field) {
	AppDispatcher.dispatch({
		type: ActionTypes.SORT_ITEMS,
		data: field
	});
}

export function setFilter(text) {
	AppDispatcher.dispatch({
		type: ActionTypes.FILTER_ITEMS_BY,
		data: text
	});
}

export function setStartDate(date) {
	const formattedDate = yyyyMMdd(date);
	AppDispatcher.dispatch({
		type: ActionTypes.SET_ITEMS_START_DATE,
		data: formattedDate
	});
}

export function setEndDate(date) {
	const formattedDate = yyyyMMdd(date);
	AppDispatcher.dispatch({
		type: ActionTypes.SET_ITEMS_END_DATE,
		data: formattedDate
	});
}

export function restrictTo(key, options) {
	AppDispatcher.dispatch({
		type: ActionTypes.RESTRICT_ITEMS_TO,
		data: {
			key: key,
			options: options
		}
	});
}

export function clearItemsFilters() {
	AppDispatcher.dispatch({
		type: ActionTypes.CLEAR_ITEMS_FILTERS
	});
}
