"use strict";
import keyMirror from "react/lib/keyMirror";

export default keyMirror({
	// Receiving from API
	"RECEIVE_SELECTIONS": null,
	"RECEIVE_ALL_JOBS": null,

	"RECEIVE_SINGLE_JOB": null,
	"RECEIVE_UPDATED_JOB": null,

	"RECEIVE_SINGLE_ITEM": null,
	"RECEIVE_UPDATED_ITEM": null,

	"RECEIVE_JOB_ITEMS": null,

	"RECEIVE_ALERT": null,

	// Sending to API
	// On blur/click
	"CREATE_SINGLE_JOB": null,
	"SAVE_SINGLE_JOB_DETAILS": null,
	"SAVE_SINGLE_JOB_ITEM": null,

	// Local pre-server actions
	// On change
	"CHANGE_SINGLE_JOB_DETAILS": null,
	"CHANGE_SINGLE_JOB_ITEM": null,

	// unnecessary?
	"CREATE_ITEM": null,
	"DELETE_ITEM": null,

	// Data Sorting
	"SORT_ONE": null,
	"SORT_MULTI": null,

	"SET_START_DATE": null,
	"SET_END_DATE": null,

	"FILTER_BY": null,
	"RESTRICT_TO": null
});
