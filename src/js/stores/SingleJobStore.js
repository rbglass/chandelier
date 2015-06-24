"use strict";
import I from "immutable";
import { createStore } from "../utils/StoreUtils";
import { genericSort } from "../utils/FilterUtils";
import objectAssign from "object-assign";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import SelectionStore from "./SelectionStore";

const defaultFilters = I.Map({
	sortTerm: "item_id",
	isAsc: false
});

var job = I.Map({
			job_id: "",
			details: I.Map(),
			items: I.List()
		}),
		filters = defaultFilters;

const SingleJobStore = createStore({
	getSortedItems() {
		return job.get("items");
	},
	getJobDetails() {
		return job.get("details");
	},
	getFilters() {
		return filters;
	}
});

const onReceivingAction = action => {
	switch(action.type) {

		case ActionTypes.RECEIVE_SINGLE_JOB:
				job = I.fromJS(action.data);
				SingleJobStore.emitChange();
				break;

		// TODO: make this appear next to the other item
		// use find & splice
		case ActionTypes.RECEIVE_SINGLE_ITEM:
				let immutData = I.fromJS(action.data);
				job = job.updateIn(["items"], list => list.push(immutData));
				SingleJobStore.emitChange();
				break;

		case ActionTypes.CHANGE_SINGLE_JOB_DETAILS:
				if (action.data.id === job.get("job_id")) {
					job = job.setIn(["details", action.data.key], action.data.value);
					SingleJobStore.emitChange();
				}
				break;

		case ActionTypes.CHANGE_SINGLE_JOB_ITEM:
				let d = action.data;
				job = job.updateIn(["items"], list => list.map(jobitem =>
					jobitem.get("item_id") === d.id ? jobitem.set(d.key, d.value) : jobitem
				));
				SingleJobStore.emitChange();
				break;

		case ActionTypes.RECEIVE_ITEM_DELETION_CONFIRMATION:
				job = job.updateIn(["items"], list => list.filterNot(jobitem =>
					jobitem.get("item_id") === action.data
				));
				SingleJobStore.emitChange();
				break;

		case ActionTypes.SORT_ONE:
				const asc = action.data === filters.get("sortTerm") ?
											!filters.get("isAsc") :
											false;
				filters = filters.set("isAsc", asc);
				filters = filters.set("sortTerm", action.data);
				job = job.set("items", genericSort(job.get("items"), filters.get("sortTerm"), filters.get("isAsc")));
				SingleJobStore.emitChange();
				break;

		default:
				break;

	}
};

export default SingleJobStore;

AppDispatcher.register(onReceivingAction);
