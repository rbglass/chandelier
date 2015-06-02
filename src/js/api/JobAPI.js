"use strict";

import request from "superagent";

export default {

	getAllJobs(onErrOrSuccess) {
		request.get("/api/jobs")
						.end(onErrOrSuccess);
	},

	createOneJob(onErrOrSuccess) {
		request.post("/api/jobs")
						.end(onErrOrSuccess);
	},

	getOneJob(jobId, onErrOrSuccess) {
		request.get(`/api/jobs/${jobId}`)
						.end(onErrOrSuccess);
	},

	updateOneJob(jobId, itemOrDetails, updateObj, onErrOrSuccess) {
		request.put(`/api/jobs/${jobId}/${itemOrDetails}`)
						.send(updateObj)
						.end(onErrOrSuccess);
	}

};
