"use strict";
import request from "superagent";

const root = "/api/jobs";

export default {

	getAllJobs(onReply) {
		request.get(root)
						.end(onReply);
	},

	createOneJob(onReply) {
		request.post(root)
						.end(onReply);
	},

	getOneJob(jobId, onReply) {
		request.get(`${root}/${jobId}`)
						.end(onReply);
	},

	updateOneJob(jobId, itemOrDetails, updateObj, onReply) {
		request.put(`${root}/${jobId}/${itemOrDetails}`)
						.send(updateObj)
						.end(onReply);
	}

};
