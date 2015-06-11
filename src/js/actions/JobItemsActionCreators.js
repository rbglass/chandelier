"use strict";
import AppDispatcher from "../dispatchers/AppDispatcher";
import ActionTypes from "../constants/ActionTypes";
import * as JobsAPI from "../api/JobsAPI";

export function getAllItems() {
	AppDispatcher.dispatch({
		type: ActionTypes.IS_LOADING
	});

	JobsAPI.getAllItems();
}
