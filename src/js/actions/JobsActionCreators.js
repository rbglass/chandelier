"use strict";
import * as JobsAPI from "../api/JobsAPI";

export function getAllJobs() {
	JobsAPI.getAllJobs();
}

export function createSingleJob() {
	JobsAPI.createSingleJob();
}
