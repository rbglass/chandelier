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
const selections = `${root}/selections`;

const errToAction = compose(JobAPIUtils.turnErrorIntoAlert,
															SharedActionCreators.receiveAlert);

var sampleSelections = sampledata.selections;
var sampleJobs = sampledata.jobs;
var sampleJob = sampledata.job;

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
		onReply(ServerActionCreators.receiveAllJobs)(null, {ok: true, body: sampleJobs});
	}, 1000);
	// request.get(jobs)
					// .end(onReply(ServerActionCreators.receiveAllJobs));
}

export function getSingleJob(jobId) {
	setTimeout(() => {
		onReply(ServerActionCreators.receiveSingleJob)(null, {ok: true, body: objectAssign({}, sampleJob)});
	}, 1000);

	// request.get(`${jobs}/${jobId}`)
	// 				.end(onReply(ServerActionCreators.receiveSingleJob));
}

export function createSingleJob() {
	setTimeout(() => {
		const id = "RB" + ("" + Date.now()).slice(-4);

		let dummyJobItem = {
			job_id: id,
			details: {
				job_id: id,
				last_update: new Date().toISOString().substring(0, 10),
				job_status: "TBC",
				order_type: "Standard"
			},
			items: []
		};

		let newJobs = sampleJobs.slice(0);
		newJobs.push(dummyJobItem);
		sampleJobs = newJobs;
		onReply(ServerActionCreators.receiveSingleJob)(null, {ok: true, body: dummyJobItem});
	}, 1000);
	// request.post(jobs)
	// 				.end(onReply(ServerActionCreators.receiveSingleJob));
}

export function createSingleJobItem(blueprint) {
	let i = objectAssign({}, blueprint);
	i.item_id = +("" + Date.now()).slice(-5);

	let newItems = sampleJob.items.slice(0);
	newItems.push(i);

	sampleJob.items = newItems;

	setTimeout(() => {
		onReply(ServerActionCreators.receiveSingleItem)(null, {ok: true, body: i});
	}, 200);
}

export function saveDetails(jobId, updateObj) {
	setTimeout(() => {
		onReply(ServerActionCreators.receiveUpdatedJob)(null, {ok: true, body: objectAssign(updateObj, sampleJob)});
	}, 200);
	// request.put(`${jobs}/${jobId}`)
	// 				.send(updateObj)
	// 				.end(onReply(ServerActionCreators.receiveUpdatedJob));
}

export function saveItem(itemId, updateObj) {
	let item;
	sampleJob.items = sampleJob.items.map(e => {
		if(e.item_id === itemId) {
			item = objectAssign(updateObj, e);
			return item;
		} else {
			return e;
		}
	});

	setTimeout(() => {
		onReply(ServerActionCreators.receiveUpdatedItem)(null, {
			ok: true,
			body: item
		});
	}, 200);
}

export function getPDF(jobId) {
	request.get(`${jobs}/${jobId}`)
					.query({pdf: true})
					.end((err, res) => {
						if(err) console.log(err);
						console.log(res.body);
					});
}
