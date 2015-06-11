"use strict";
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

// All Jobs
export function getAllJobs() {
	SharedActionCreators.startLoading();
	request.get(jobs)
					.end(onReply(ServerActionCreators.receiveAllJobs));
}

// Single Jobs
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

export function saveDetails(jobId, updateObj) {
	SharedActionCreators.startLoading();
	request.put(`${jobs}/${jobId}`)
					.send(updateObj)
					.end(onReply(ServerActionCreators.receiveUpdatedJob));
}

// All items
export function getAllItems() {
	SharedActionCreators.startLoading();
	request.get(items)
					.end(onReply(ServerActionCreators.receiveAllItems));
}

// Single Item
export function createSingleJobItem(jobId, blueprint) {
	blueprint.job_id = jobId;

	SharedActionCreators.startLoading();
	request.post(items)
					.send(blueprint)
					.end(onReply(ServerActionCreators.receiveSingleItem));
}

export function saveItem(itemId, updateObj) {
	SharedActionCreators.startLoading();
	request.put(`${items}/${itemId}`)
					.send(updateObj)
					.end(onReply(ServerActionCreators.receiveUpdatedItem));
}

export function deleteSingleItem(jobId, itemId) {
	SharedActionCreators.startLoading();
	request.del(`${items}/${itemId}`)
					.end(onReply(ServerActionCreators.deleteSingleItem, itemId));
}

// All Selections
export function getSelections() {
	SharedActionCreators.startLoading();
	request.get(selections)
					.end(onReply(ServerActionCreators.receiveSelections));
}

// All Products
export function getAllProducts() {
	SharedActionCreators.startLoading();
	request.get(products)
					.end(onReply(ServerActionCreators.receiveAllProducts));
}

// All Contacts
export function getAllContacts() {
	SharedActionCreators.startLoading();
	request.get(contacts)
					.end(onReply());
}
