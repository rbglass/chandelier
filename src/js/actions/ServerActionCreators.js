"use strict";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import * as RouterContainer from "../routing/RouterContainer";

function receive(singleOrAll, type) {
	return function(data) {
		AppDispatcher.dispatch({
			type: ActionTypes[`RECEIVE_${singleOrAll.toUpperCase()}_${type.toUpperCase()}`],
			data: data
		});
	};
}

const ra = receive.bind(null, "all");
const rs = receive.bind(null, "single");

export const receiveAllSelections = ra("selections");
export const receiveAllJobs       = ra("jobs");
export const receiveAllItems      = ra("items");
export const receiveAllProducts   = ra("products");

export const receiveSingleJob     = rs("job");
export const receiveSingleItem    = rs("item");
export const receiveSingleProduct = rs("product");

export function receiveNewJob(job) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_JOB_CREATION_CONFIRMATION
	});
	RouterContainer.get().transitionTo("singlejob", {id: job.job_id});
}

export function receiveUpdatedJob(jobObject) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_UPDATED_JOB,
		data: jobObject
	});
}

export function deleteSingleItem(res, itemId) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_ITEM_DELETION_CONFIRMATION,
		data: itemId
	});
}

export function deleteSingleProduct(res, productId) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_PRODUCT_DELETION_CONFIRMATION,
		data: productId
	});
}

export function receiveUpdateConfirmation() {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_UPDATE_CONFIRMATION
	});
}
