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

export function createJob() {
	AppDispatcher.dispatch({
		type: ActionTypes.CREATE_JOB
	});
}

export function updateJob(updateObj) {
	AppDispatcher.dispatch({
		type: ActionTypes.UPDATE_JOB,
		data: updateObj
	});
}

export function updateDetails(updateObj) {
	AppDispatcher.dispatch({
		type: ActionTypes.UPDATE_DETAILS,
		data: updateObj
	});
}

export function createItem() {
	AppDispatcher.dispatch({
		type: ActionTypes.CREATE_ITEM
	});
}

export function duplicateItem(id) {
	AppDispatcher.dispatch({
		type: ActionTypes.DUPLICATE_ITEM,
		data: id
	});
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
