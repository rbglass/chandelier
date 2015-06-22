"use strict";
import * as JobsAPI from "../api/JobsAPI";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";

export function getAllItems() {
	JobsAPI.getAllItems();
}

export function clearItemsFilters() {
	AppDispatcher.dispatch({
		type: ActionTypes.CLEAR_ITEMS_FILTERS
	});
}
