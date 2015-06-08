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

function onReply(successAction, ...etc) {
	return function(err, res) {
		if(err) errToAction(err);
		else    successAction(res.body, ...etc);
	};
}

export function getSelections() {
	setTimeout(() => {
		onReply(ServerActionCreators.receiveSelections)(null, {body: sampledata.selections});
	}, 1000);

	// request.get(`${selections}`)
					// .end(onReply(ServerActionCreators.receiveSelections));
}

export function getAllJobs() {
	setTimeout(() => {
		onReply(ServerActionCreators.receiveAllJobs)(null, {body: sampledata.jobs});
	}, 1000);
	// request.get(jobs)
					// .end(onReply(ServerActionCreators.receiveAllJobs));
}

export function getSingleJob(jobId) {
	setTimeout(() => {
		onReply(ServerActionCreators.receiveSingleJob)(null, {body: sampledata.job});
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
				last_update: new Date().toISOString().substring(0, 10)
			},
			items: []
		};

		onReply(ServerActionCreators.receiveSingleJob)(null, {body: dummyJobItem });
	}, 1000);
	// request.post(jobs)
	// 				.end(onReply(ServerActionCreators.receiveSingleJob));
}

export function createSingleJobItem(blueprint) {
	let i = objectAssign({}, blueprint);
	i.item_id = +("" + Date.now()).slice(-5);

	setTimeout(() => {
		let id;
		id = blueprint && blueprint.item_id;
		onReply(ServerActionCreators.receiveSingleItem, id)(null, {body: i});
	}, 200);
}

export function saveDetails(jobId, updateObj) {

	setTimeout(() => {
		onReply(ServerActionCreators.receiveUpdatedJob)(null, {body: objectAssign(updateObj, sampledata.job)});
	}, 200);
	// request.put(`${jobs}/${jobId}`)
	// 				.send(updateObj)
	// 				.end(onReply(ServerActionCreators.receiveUpdatedJob));
}

export function saveItem(itemId, updateObj) {
	let item = objectAssign(updateObj, sampledata.job.items.filter(e => e.item_id === itemId)[0]);

	setTimeout(() => {
		onReply(ServerActionCreators.receiveUpdatedItem)(null, {
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
