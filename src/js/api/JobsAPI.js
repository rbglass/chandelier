"use strict";
import request from "superagent";
import compose from "../utils/compose";
import objectAssign from "object-assign";
import * as JobAPIUtils from "../utils/JobAPIUtils";
import * as SharedActionCreators from "../actions/SharedActionCreators";
import * as ServerActionCreators from "../actions/ServerActionCreators";

const root = "/api";
const jobs = `${root}/jobs`;
const items = `${root}/items`;
const products = `${root}/products`;
const contacts = `${root}/contacts`;
const selections = `${root}/selections`;

const errToAction = compose(JobAPIUtils.turnErrorIntoAlert,
															SharedActionCreators.receiveAlert);

function onReply(successAction, ...etc) {
	return function(err, res) {
		if(res.ok) successAction(res.body, ...etc);
		else errToAction(err);
	};
}

// All Jobs
export function getAllJobs() {
	request.get(jobs)
					.end(onReply(ServerActionCreators.receiveAllJobs));
}

// Single Jobs
export function getSingleJob(jobId) {
	request.get(`${jobs}/${jobId}`)
					.end(onReply(ServerActionCreators.receiveSingleJob));
}

export function createSingleJob() {
	request.post(jobs)
					.end(onReply(ServerActionCreators.receiveNewJob));
}

export function saveDetails(jobId, updateObj) {
	request.put(`${jobs}/${jobId}`)
					.send(updateObj)
					.end(onReply(ServerActionCreators.receiveUpdatedJob));
}

// All items
export function getAllItems() {
	request.get(items)
					.end(onReply(ServerActionCreators.receiveAllItems));
}

// Single Item
export function createSingleJobItem(jobId, blueprint) {
	request.post(`${items}/${jobId}`)
					.send(blueprint)
					.end(onReply(ServerActionCreators.receiveSingleItem));
}

export function saveItem(jobId, itemId, updateObj) {
	request.put(`${items}/${jobId}`)
					.send(updateObj)
					.end(onReply(ServerActionCreators.receiveUpdatedItem));
}

export function deleteSingleItem(jobId, itemId) {
	request.delete(`${items}/${jobId}/${itemId}`)
					.end(onReply(ServerActionCreators.deleteItem));
}

// All Selections
export function getSelections() {
	request.get(selections)
					.end(onReply(ServerActionCreators.receiveSelections));
}

// All Products
export function getAllProducts() {
	request.get(products)
					.end(onReply());
}

// All Contacts
export function getAllContacts() {
	request.get(contacts)
					.end(onReply());
}

export function getPDF(jobId) {
	request.get(`${jobs}/${jobId}`)
					.query({pdf: true})
					.end((err, res) => {
						if(err) console.log(err.status, err.message);
						else console.log(res.body);
					});
}
