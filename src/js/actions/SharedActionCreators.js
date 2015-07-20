"use strict";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import yyyyMMdd from "../utils/yyyyMMdd";
import * as JobsAPI from "../api/JobsAPI";
import * as JobsActionCreators from "./JobsActionCreators";
import * as JobItemsActionCreators from "./JobItemsActionCreators";
import * as ProductActionCreators from "./ProductActionCreators";

export function startLoading() {
	AppDispatcher.dispatch({
		type: ActionTypes.IS_LOADING
	});
}

export function getSelections() {
	JobsAPI.getSelections();
}

export function getAllProducts() {
	JobsAPI.getAllProducts();
}

export function saveDetails(jobId, details) {
	JobsAPI.saveDetails(jobId, details);
}

export function saveItem(itemId, item) {
	JobsAPI.saveItem(itemId, item);
}

export function createItem(jobId, blueprint) {
	JobsAPI.createSingleJobItem(jobId, blueprint);
}

export function deleteItem(_, cells) {
	const itemId = cells.get("item_id");
	JobsAPI.deleteSingleItem(itemId);
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

export function externalSortBy(resource, field, currentlyIsAsc) {
// Should be the other way around? - the more specific action creators
// should be calling this with a param, not vice versa
	let thenWeWantAsc;

	if (resource === "jobs") {
		JobsActionCreators.sortBy(field);
	} else if (resource === "items") {
		JobItemsActionCreators.sortBy(field);
	} else if (resource === "products") {
		ProductActionCreators.sortBy(field);
	}

	if (currentlyIsAsc === false) {
		thenWeWantAsc = true;
	} else {
		thenWeWantAsc = false;
	}

	JobsAPI.getSortedThings(resource, field, thenWeWantAsc);
}

export function changePageNumber(n) {
	AppDispatcher.dispatch({
		type: ActionTypes.SWITCH_PAGE_NUMBER,
		data: n
	});
}

export function setRowsPerPage(n) {
	AppDispatcher.dispatch({
		type: ActionTypes.SET_ROWS_PER_PAGE,
		data: n
	});
}
