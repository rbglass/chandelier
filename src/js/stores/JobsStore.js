"use strict";
import { createStore } from "../utils/StoreUtils";
import * as FilterUtils from "../utils/FilterUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import SelectionStore from "./SelectionStore";

var jobs = [],
		jobLength = 0,
		filters = {
			sortTerm: "shipping_date",
			isAsc: true,
			filterBy: "",
			dateField: "shipping_date",
			startDate: "",
			endDate: "",
			restrictions: {
				"job_status": {
					key: "job_status",
					options: ["Confirmed", "Packaged"]
				},
				"order_type": {
					key: "order_type"
				},
				"payment": {
					key: "payment"
				},
				"parts_status": {
					key: "parts_status"
				}
			}
		};

const JobsStore = createStore({
	getFilteredAndSortedJobs(start, end) {
		let f = filters;
		const filtered = jobs.filter(row => {
			return (
				FilterUtils.contains(row.details, f.filterBy) &&
				FilterUtils.isWithinBounds(row.details[f.dateField], f.startDate, f.endDate) &&
				FilterUtils.restrictTo(row.details, filters.restrictions)
			);
		});

		jobLength = filtered.length;
		return filtered.slice(start, end);
	},
	getFilters() {
		return filters;
	},
	getNumberOfJobs() {
		return jobLength;
	}
});

const onReceivingAction = action => {
	switch(action.type) {

		case ActionTypes.RECEIVE_ALL_JOBS:
				jobs = action.data;
				JobsStore.emitChange();
				break;

		case ActionTypes.RECEIVE_UPDATED_JOB:
				let newJobs = jobs.map(job => {
					if(job.job_id === action.data.job_id) {
						return action.data;
					} else {
						return job;
					}
				});

				jobs = newJobs;
				JobsStore.emitChange();
				break;

		// State change but not server interaction
		case ActionTypes.CHANGE_SINGLE_JOB_DETAILS:
				let id = action.data.id;
				jobs = jobs.map(job => {
					if (job.job_id === id) {
						job.details[action.data.key] = action.data.value;
					}
					return job;
				});
				JobsStore.emitChange();
				break;

		// Table manipulation
		case ActionTypes.FILTER_BY:
				filters.filterBy = action.data;
				JobsStore.emitChange();
				break;

		case ActionTypes.SORT_ONE:
				if (action.data === filters.sortTerm) {
					filters.isAsc = !filters.isAsc;
				} else {
					filters.isAsc = false;
				}
				filters.sortTerm = action.data;

				jobs = FilterUtils.genericSort(jobs, filters.sortTerm, filters.isAsc, "details");
				JobsStore.emitChange();
				break;

		case ActionTypes.SET_START_DATE:
				filters.startDate = action.data;
				JobsStore.emitChange();
				break;

		case ActionTypes.SET_END_DATE:
				filters.endDate = action.data;
				JobsStore.emitChange();
				break;

		case ActionTypes.RESTRICT_TO:
				filters.restrictions[action.data.key] = action.data;
				JobsStore.emitChange();
				break;

		case ActionTypes.RECEIVE_SELECTIONS:
				AppDispatcher.waitFor([SelectionStore.dispatchToken]);
				const selections = SelectionStore.getSelections();

				Object.keys(filters.restrictions).forEach(r => {
					if(filters.restrictions[r].options === undefined) {
						filters.restrictions[r].options = selections[r];
					}
				});
				break;

		default:
				break;
	}
};

export default JobsStore;

AppDispatcher.register(onReceivingAction);
