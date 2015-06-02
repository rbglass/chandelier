"use strict";
import request from "superagent";

export default {

	getAllJobs(onReply) {
		request.get("/api/jobs")
						.end(onReply);
	},

	createOneJob(onReply) {
		request.post("/api/jobs")
						.end(onReply);
	},

	getOneJob(jobId, onReply) {
		request.get(`/api/jobs/${jobId}`)
						.end(onReply);
	},

	updateOneJob(jobId, itemOrDetails, updateObj, onReply) {
		request.put(`/api/jobs/${jobId}/${itemOrDetails}`)
						.send(updateObj)
						.end(onReply);
	}

};
