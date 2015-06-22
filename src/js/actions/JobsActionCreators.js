"use strict";
import * as JobsAPI from "../api/JobsAPI";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";

export function getAllJobs() {
	JobsAPI.getAllJobs();
}

export function createSingleJob() {
	JobsAPI.createSingleJob();
}

export function clearJobsFilters() {
	AppDispatcher.dispatch({
		type: ActionTypes.CLEAR_JOBS_FILTERS
	});
}
