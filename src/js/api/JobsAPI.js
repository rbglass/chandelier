// All mocks until API is sorted

"use strict";
import request from "superagent";
import compose from "../utils/compose";
import objectAssign from "object-assign";
import * as JobAPIUtils from "../utils/JobAPIUtils";
import * as SharedActionCreators from "../actions/SharedActionCreators";
import * as ServerActionCreators from "../actions/ServerActionCreators";
import * as sampledata from "../sampledata/data.js";

const root = "/api";
const jobs = `${root}/jobs`;
const items = `${root}/items`;
const selections = `${root}/selections`;

var sampleSelections = sampledata.selections;
var sampleJobs = sampledata.jobs;

const errToAction = compose(JobAPIUtils.turnErrorIntoAlert,
															SharedActionCreators.receiveAlert);
function onReply(successAction, ...etc) {
	return function(err, res) {
		if(res.ok) successAction(res.body, ...etc);
		else errToAction(err);
	};
}

export function getSelections() {
	setTimeout(() => {
		onReply(ServerActionCreators.receiveSelections)(null, {ok: true, body: objectAssign({}, sampleSelections)});
	}, 1000);

	// request.get(`${selections}`)
					// .end(onReply(ServerActionCreators.receiveSelections));
}

export function getAllJobs() {
	setTimeout(() => {
		onReply(ServerActionCreators.receiveAllJobs)(null, {ok: true, body: sampleJobs.slice(0)});
	}, 1000);
	// request.get(jobs)
					// .end(onReply(ServerActionCreators.receiveAllJobs));
}

export function getSingleJob(jobId) {
	setTimeout(() => {
		var job = sampleJobs.filter(e => e.job_id === jobId).slice(0)[0];
		onReply(ServerActionCreators.receiveSingleJob)(null, {ok: true, body: objectAssign({}, job)});
	}, 1000);

	// request.get(`${jobs}/${jobId}`)
	// 				.end(onReply(ServerActionCreators.receiveSingleJob));
}

export function createSingleJob() {
	setTimeout(() => {
		const id = "RB" + ("" + Date.now()).slice(-4);

		let dummyJobItem = objectAssign({}, {
			job_id: id,
			details: {
				job_id: id,
				last_update: new Date().toISOString().substring(0, 10),
				job_status: "TBC",
				order_type: "Standard"
			},
			items: []
		});

		let newJobs = sampleJobs.slice(0);
		newJobs.push(dummyJobItem);
		sampleJobs = newJobs;
		onReply(ServerActionCreators.receiveNewJob)(null, {ok: true, body: objectAssign({}, dummyJobItem)});
	}, 1000);
	// request.post(jobs)
	// 				.end(onReply(ServerActionCreators.receiveSingleJob));
}

export function createSingleJobItem(jobId, blueprint) {
	let newItem;

	sampleJobs = sampleJobs.map(job => {
		if (jobId === job.job_id) {
			newItem = objectAssign({}, blueprint);
			newItem.job_id = jobId;
			newItem.item_id = +("" + Date.now()).slice(-5);
			// This is causing a dupe - only shallow copy from objectAssign in other funcs
			// job.items.push(newItem);
		}
		return job;
	});

	setTimeout(() => {
		onReply(ServerActionCreators.receiveSingleItem)(null, {ok: true, body: objectAssign({}, newItem)});
	}, 200);
	// request.post(`${items}/${jobId}`)
	// 				.send(blueprint)
	// 				.end(onReply(ServerActionCreators.receiveSingleItem));
}

export function deleteSingleItem(jobId, itemId) {

	sampleJobs.some(job => {
		if(job.job_id === jobId) {
			return job.items.some((item, i) => {
				if(item.item_id === itemId) {
					job.items.splice(i, 1);
					return true;
				}
			});
		}
	});

	setTimeout(() => {
		onReply(ServerActionCreators.deleteItem)(null, {ok: true, body: itemId});
	}, 200);

	// request.delete(`${items}/${jobId}/${itemId}`)
	// 				.end(onReply(ServerActionCreators.deleteItem));
}

export function saveDetails(jobId, updateObj) {
	setTimeout(() => {
		console.log(jobId, updateObj);
		sampleJobs = sampleJobs.map(e => {
			if(e.job_id === jobId) {
				e = objectAssign(updateObj, e);
			}
			return e;
		});

		var job = sampleJobs.filter(e => e.job_id === jobId)[0];

		onReply(ServerActionCreators.receiveUpdatedJob)(null, {ok: true, body: objectAssign({}, job)});
	}, 200);
	// request.put(`${jobs}/${jobId}`)
	// 				.send(updateObj)
	// 				.end(onReply(ServerActionCreators.receiveUpdatedJob));
}

export function saveItem(jobId, itemId, updateObj) {
	let item;
	sampleJobs = sampleJobs.slice(0);

	sampleJobs.some(job => {
		if(job.job_id === jobId) {
			job.items.forEach(g => {
				if(g.item_id === itemId) {
					item = objectAssign(updateObj);
					g = item;
				}
			});
			return true;
		}
	});

	setTimeout(() => {
		onReply(ServerActionCreators.receiveUpdatedItem)(null, {
			ok: true,
			body: objectAssign({}, item)
		});
	}, 200);
	// request.put(`${items}/${jobId}`)
	// 				.send(updateObj)
	// 				.end(onReply(ServerActionCreators.receiveUpdatedItem));
}

export function getPDF(jobId) {
	request.get(`${jobs}/${jobId}`)
					.query({pdf: true})
					.end((err, res) => {
						if(err) console.log(err.status, err.message);
						else console.log(res.body);
					});
}
