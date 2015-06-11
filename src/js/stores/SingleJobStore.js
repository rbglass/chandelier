"use strict";
import { createStore } from "../utils/StoreUtils";
import { genericSort } from "../utils/FilterUtils";
import objectAssign from "object-assign";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";

var job = {
			job_id: "",
			details: {},
			items: []
		},
		filters = {
			sortTerm: "item_id",
			isAsc: false
		};

const SingleJobStore = createStore({
	getSortedItems() {
		return genericSort(job.items, filters.sortTerm, filters.isAsc);
	},
	getJobDetails() {
		return job.details;
	},
	getFilters() {
		return filters;
	}
});

const onReceivingAction = action => {
	switch(action.type) {

		case ActionTypes.RECEIVE_SINGLE_JOB:
				job = objectAssign({}, action.data);
				SingleJobStore.emitChange();
				break;

		case ActionTypes.RECEIVE_SINGLE_ITEM:
				job.items.push(action.data);
				SingleJobStore.emitChange();
				break;

		case ActionTypes.CHANGE_SINGLE_JOB_DETAILS:
				if (action.data.id === job.job_id) {
					job.details[action.data.key] = action.data.value;
					SingleJobStore.emitChange();
				}
				break;

		case ActionTypes.CHANGE_SINGLE_JOB_ITEM:
				let d = action.data;
				job.items = job.items.map(jobitem => {
					if (jobitem.item_id === d.id) {
						jobitem[d.key] = d.value;
					}
					return jobitem;
				});
				SingleJobStore.emitChange();
				break;

		case ActionTypes.DELETE_ITEM:
				let itemsMinusOne = [];
				job.items.forEach(item => {
					if (item.item_id === action.data) {
						return;
					}
					itemsMinusOne.push(item);
				});
				job.items = itemsMinusOne;
				SingleJobStore.emitChange();
				break;

		case ActionTypes.SORT_ONE:
				if (action.data === filters.sortTerm) {
					filters.isAsc = !filters.isAsc;
				} else {
					filters.isAsc = false;
				}
				filters.sortTerm = action.data;
				SingleJobStore.emitChange();
				break;

		default:
				break;
	}
};

export default SingleJobStore;

AppDispatcher.register(onReceivingAction);
