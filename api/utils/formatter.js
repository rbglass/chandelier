"use strict";

module.exports = {
	job: function(job) {
		return {
			job_id: job.job_id,
			details: job
		};
	},

	jobWithItems: function(job, items) {
		return {
			job_id: job.job_id,
			details: job,
			items: items || []
		};
	}
};
