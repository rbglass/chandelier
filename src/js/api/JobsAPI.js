"use strict";
import request from "superagent";
import compose from "../utils/compose";
import objectAssign from "object-assign";
import * as JobAPIUtils from "../utils/JobAPIUtils";
import * as SharedActionCreators from "../actions/SharedActionCreators";
import { receiveAllJobs, receiveSingleJob, receiveSingleItem, receiveSelections } from "../actions/ServerActionCreators";
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
		onReply(receiveSelections)(null, {body: sampledata.selections});
	}, 1000);

	// request.get(`${selections}`)
					// .end(onReply(receiveSelections));
}

export function getAllJobs() {
	setTimeout(() => {
		onReply(receiveAllJobs)(null, {body: sampledata.jobs});
	}, 1000);
	// request.get(jobs)
					// .end(onReply(receiveAllJobs));
}

export function createJob() {
	setTimeout(() => {
		let dummyJobItem = {
			job_id: +("" + Date.now()).substring(0, 5),
			last_update: new Date().toISOString().substring(0, 10)
		};

		onReply(receiveSingleJob)(null, {body: dummyJobItem });
	}, 1000);
	// request.post(jobs)
	// 				.end(onReply);
}

export function getSingleJob(jobId) {
	setTimeout(() => {
		onReply(receiveSingleJob)(null, {body: sampledata.job});
	}, 1000);

	// request.get(`${jobs}/${jobId}`)
	// 				.end(onReply(receiveOneJob()));
}

export function updateSingleJobDetails(jobId, updateObj) {
	setTimeout(() => {
		onReply(receiveSingleJob)(null, {body: objectAssign(updateObj, sampledata.job)});
	}, 200);
	// request.put(`${jobs}/${jobId}`)
	// 				.send(updateObj)
	// 				.end(onReply);
}

export function createSingleJobItem(blueprint) {
	let i = objectAssign({}, blueprint);
	i.item_id = +("" + Date.now()).substring(6);

	setTimeout(() => {
		let id;
		id = blueprint && blueprint.item_id;
		onReply(receiveSingleItem, id)(null, {body: i});
	}, 200);
}
