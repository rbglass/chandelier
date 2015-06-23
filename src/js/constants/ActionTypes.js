"use strict";
import keyMirror from "react/lib/keyMirror";

export default keyMirror({
	// SERVER JS -> LOCAL IMMUTABLE
	"RECEIVE_SELECTIONS": null,

	"RECEIVE_ALL_JOBS": null,
	"RECEIVE_SINGLE_JOB": null,
	"RECEIVE_UPDATED_JOB": null,

	"RECEIVE_ALL_ITEMS": null,
	"RECEIVE_SINGLE_ITEM": null,
	"RECEIVE_ITEM_DELETION_CONFIRMATION": null,

	"RECEIVE_ALL_PRODUCTS": null,
	"RECEIVE_SINGLE_PRODUCT": null,
	"RECEIVE_PRODUCT_DELETION_CONFIRMATION": null,

	"RECEIVE_ALERT": null,
	"RECEIVE_UPDATE_CONFIRMATION": null,

	// LOCAL IMMUTABLE -> SERVER JS
	"CREATE_SINGLE_JOB": null,
	"SAVE_SINGLE_JOB_DETAILS": null,
	"SAVE_SINGLE_JOB_ITEM": null,

	// LOCAL JS -> LOCAL IMMUTABLE
	"CHANGE_SINGLE_JOB_DETAILS": null,
	"CHANGE_SINGLE_JOB_ITEM": null,
	"CHANGE_SINGLE_PRODUCT": null,

	// LOCAL MUTABLE -> LOCAL MUTABLE
	"PENDING_ACTION": null,
	"IS_LOADING": null,

	"SWITCH_PAGE_NUMBER": null,

	// LOCAL IMMUTABLE -> LOCAL IMMUTABLE
	"SORT_ONE": null,
	"SORT_JOBS": null,
	"SORT_ITEMS": null,
	"SORT_PRODUCTS": null,

	"SET_START_DATE": null,
	"SET_END_DATE": null,
	"FILTER_BY": null,
	"RESTRICT_TO": null,

	"CLEAR_ITEMS_FILTERS": null,
	"CLEAR_JOBS_FILTERS": null,
	"CLEAR_PRODUCTS_FILTERS": null
});
