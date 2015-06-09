"use strict";
import { createStore } from "../utils/StoreUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";

var jobItems = [],
		filters = {
			sortTerm: "shipping_date",
			isAsc: false,
			filterBy: "",
			dateField: "shipping_date",
			startDate: "",
			endDate: "",
			restrictions: {
				"job_status": {
					key: "job_status"
				},
				"order_type": {
					key: "order_type"
				}
			}
		};

const JobItemsStore = createStore({
	getJobItems() {
		return jobItems;
	},
	getFilters() {
		return filters;
	}
});

const onReceivingAction = action => {
	switch (action.type) {

		case ActionTypes.RECEIVE_ALL_ITEMS:
				console.log(action.data);
				jobItems = action.data;
				JobItemsStore.emitChange();
				break;

	}
};

export default JobItemsStore;

AppDispatcher.register(onReceivingAction);
