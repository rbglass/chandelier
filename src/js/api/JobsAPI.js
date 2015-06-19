"use strict";
import I from "immutable";
import request from "superagent";
import compose from "../utils/compose";
import objectAssign from "object-assign";
import * as JobAPIUtils from "../utils/JobAPIUtils";
import * as SharedActionCreators from "../actions/SharedActionCreators";
import * as AlertActionCreators from "../actions/AlertActionCreators";
import * as ServerActionCreators from "../actions/ServerActionCreators";

const root = "/api";
const jobs = `${root}/jobs`;
const items = `${root}/items`;
const products = `${root}/products`;
const contacts = `${root}/contacts`;
const selections = `${root}/selections`;

const errToAction = compose(JobAPIUtils.turnErrorIntoAlert,
															AlertActionCreators.receiveAlert);

function onReply(successAction, ...etc) {
	return function(err, res) {
		if(res.ok) successAction(res.body, ...etc);
		else errToAction(err);
	};
}

export function getSortedThings(endpoint, field, isAsc) {
	let action = endpoint === "jobs" ?
									ServerActionCreators.receiveAllJobs :
									ServerActionCreators.receiveAllItems;

	SharedActionCreators.startLoading();
	request.get(`${root}/${endpoint}`)
					.query({field: field, asc: isAsc})
					.end(onReply(action));
}

export function getAllJobs() {
	SharedActionCreators.startLoading();
	request.get(jobs)
					.end(onReply(ServerActionCreators.receiveAllJobs));
}

export function getSingleJob(jobId) {
	SharedActionCreators.startLoading();
	request.get(`${jobs}/${jobId}`)
					.end(onReply(ServerActionCreators.receiveSingleJob));
}

export function createSingleJob() {
	SharedActionCreators.startLoading();
	request.post(jobs)
					.end(onReply(ServerActionCreators.receiveNewJob));
}

export function saveDetails(jobId, immutUpdateObj) {
	const updateObj = immutUpdateObj.toJS();

	SharedActionCreators.startLoading();
	request.put(`${jobs}/${jobId}`)
					.send(updateObj)
					.end(onReply(ServerActionCreators.receiveUpdatedJob));
}

export function getAllItems() {
	SharedActionCreators.startLoading();
	request.get(items)
					.end(onReply(ServerActionCreators.receiveAllItems));
}

export function createSingleJobItem(jobId, immutBlueprint) {
	const blueprint = immutBlueprint.toJS && immutBlueprint.toJS() || {};
	blueprint.job_id = jobId;

	SharedActionCreators.startLoading();
	request.post(items)
					.send(blueprint)
					.end(onReply(ServerActionCreators.receiveSingleItem));
}

export function saveItem(itemId, immutUpdateObj) {
	const updateObj = immutUpdateObj.toJS();

	SharedActionCreators.startLoading();
	request.put(`${items}/${itemId}`)
					.send(updateObj)
					.end(onReply(ServerActionCreators.receiveUpdatedItem));
}

export function deleteSingleItem(item) {
	const itemId = item.get("item_id");

	SharedActionCreators.startLoading();
	request.del(`${items}/${itemId}`)
					.end(onReply(ServerActionCreators.deleteSingleItem, itemId));
}

export function getSelections() {
	SharedActionCreators.startLoading();
	request.get(selections)
					.end(onReply(ServerActionCreators.receiveSelections));
}

export function getAllProducts() {
	SharedActionCreators.startLoading();
	request.get(products)
					.end(onReply(ServerActionCreators.receiveAllProducts));
}

export function getAllContacts() {
	SharedActionCreators.startLoading();
	request.get(contacts)
					.end(onReply());
}
