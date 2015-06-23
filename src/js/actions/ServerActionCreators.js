"use strict";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import * as RouterContainer from "../routing/RouterContainer";



export function receiveSelections(selections) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_SELECTIONS,
		data: selections
	});
}

export function receiveAllJobs(jobsArray) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_ALL_JOBS,
		data: jobsArray
	});
}

export function receiveNewJob(job) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_JOB_CREATION_CONFIRMATION
	});
	RouterContainer.get().transitionTo("singlejob", {id: job.job_id});
}

export function receiveSingleJob(jobObject) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_SINGLE_JOB,
		data: jobObject
	});
}

export function receiveUpdatedJob(jobObject) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_UPDATED_JOB,
		data: jobObject
	});
}

export function receiveSingleItem(itemObject) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_SINGLE_ITEM,
		data: itemObject
	});
}

export function deleteSingleItem(res, itemId) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_ITEM_DELETION_CONFIRMATION,
		data: itemId
	});
}

export function receiveAllItems(itemsArr) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_ALL_ITEMS,
		data: itemsArr
	});
}

export function receiveAllProducts(productObj) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_ALL_PRODUCTS,
		data: productObj
	});
}

export function receiveSingleProduct(product) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_SINGLE_PRODUCT,
		data: product
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
