"use strict";
import keyMirror from "react/lib/keyMirror";

export default keyMirror({
	// Receiving from API
	"RECEIVE_ALL_JOBS": null,
	"RECEIVE_SINGLE_JOB": null,
	"RECEIVE_ALERT": null,
	"RECEIVE_SELECTIONS": null,

	// Sending to API
	// On blur/click
	"CREATE_SINGLE_JOB": null,
	"UPDATE_SINGLE_JOB_DETAILS": null,

	// Local pre-server actions
	// On change
	"UPDATE_DETAILS": null,
	"CREATE_ITEM": null,
	"UPDATE_ITEM": null,
	"DELETE_ITEM": null,

	// Data Sorting
	"SORT_ONE": null,
	"SORT_MULTI": null,

	"SET_START_DATE": null,
	"SET_END_DATE": null,

	"FILTER_BY": null
});
