"use strict";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import * as JobsAPI from "../api/JobsAPI";
import yyyyMMdd from "../utils/yyyyMMdd";

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

export function sortBy(field) {
	AppDispatcher.dispatch({
		type: ActionTypes.SORT_PRODUCTS,
		data: field
	});
}

export function setFilter(text) {
	AppDispatcher.dispatch({
		type: ActionTypes.FILTER_PRODUCTS_BY,
		data: text
	});
}

export function setStartDate(date) {
	const formattedDate = yyyyMMdd(date);
	AppDispatcher.dispatch({
		type: ActionTypes.SET_PRODUCTS_START_DATE,
		data: formattedDate
	});
}

export function setEndDate(date) {
	const formattedDate = yyyyMMdd(date);
	AppDispatcher.dispatch({
		type: ActionTypes.SET_PRODUCTS_END_DATE,
		data: formattedDate
	});
}

export function restrictTo(key, options) {
	AppDispatcher.dispatch({
		type: ActionTypes.RESTRICT_PRODUCTS_TO,
		data: {
			key: key,
			options: options
		}
	});
}

export function clearProductsFilters() {
	AppDispatcher.dispatch({
		type: ActionTypes.CLEAR_PRODUCTS_FILTERS
	});
}
