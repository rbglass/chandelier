"use strict";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import * as JobsAPI from "../api/JobsAPI";
import yyyyMMdd from "../utils/yyyyMMdd";

export function getAllJobs() {
	JobsAPI.getAllJobs();
}

export function createSingleJob() {
	JobsAPI.createSingleJob();
}

export function sortBy(field) {
	AppDispatcher.dispatch({
		type: ActionTypes.SORT_JOBS,
		data: field
	});
}

export function setFilter(text) {
	AppDispatcher.dispatch({
		type: ActionTypes.FILTER_JOBS_BY,
		data: text
	});
}

export function setStartDate(date) {
	const formattedDate = yyyyMMdd(date);
	AppDispatcher.dispatch({
		type: ActionTypes.SET_JOBS_START_DATE,
		data: formattedDate
	});
}

export function setEndDate(date) {
	const formattedDate = yyyyMMdd(date);
	AppDispatcher.dispatch({
		type: ActionTypes.SET_JOBS_END_DATE,
		data: formattedDate
	});
}

export function restrictTo(key, options) {
	AppDispatcher.dispatch({
		type: ActionTypes.RESTRICT_JOBS_TO,
		data: {
			key: key,
			options: options
		}
	});
}

export function clearJobsFilters() {
	AppDispatcher.dispatch({
		type: ActionTypes.CLEAR_JOBS_FILTERS
	});
}
