"use strict";
import * as JobsAPI from "../api/JobsAPI";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";


export function createSingleProduct() {
	JobsAPI.createSingleProduct();
}

export function saveProduct(productId, product) {
	JobsAPI.saveProduct(productId, product);
}

export function deleteSingleProduct(_, cells) {
	const productId = cells.get("id");
	JobsAPI.deleteSingleProduct(productId);
}

export function changeProduct(updateObj) {
	AppDispatcher.dispatch({
		type: ActionTypes.CHANGE_SINGLE_PRODUCT,
		data: updateObj
	});
}

export function clearProductsFilters() {
	AppDispatcher.dispatch({
		type: ActionTypes.CLEAR_PRODUCTS_FILTERS
	});
}
