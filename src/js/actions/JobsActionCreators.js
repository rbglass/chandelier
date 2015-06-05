"use strict";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import * as JobsAPI from "../api/JobsAPI";

export function getAllJobs() {
	JobsAPI.getAllJobs();
}

export function createJob() {
	JobsAPI.createJob();
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

