"use strict";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import * as JobsAPI from "../api/JobsAPI";

export function getSingleJob(jobId) {
	JobsAPI.getSingleJob(jobId);
}
