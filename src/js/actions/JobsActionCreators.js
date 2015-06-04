"use strict";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";

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

export function sortBy(field) {
	AppDispatcher.dispatch({
		type: ActionTypes.SORT_ONE,
		data: field
	});
}
