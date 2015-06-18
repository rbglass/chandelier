"use strict";
import { createStore } from "../utils/StoreUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import SelectionStore from "./SelectionStore";
import PaginationStore from "./PaginationStore";
import * as FilterUtils from "../utils/FilterUtils";

var	items = [],
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
				"payment": {
					key: "payment"
				}
			}
		};

const ItemsStore = createStore({
	getFilteredAndSortedItems(start, end) {
		let f = filters;

		const filtered = items.filter(row => {
			return (
				FilterUtils.contains(row, f.filterBy) &&
				FilterUtils.isWithinBounds(row[f.dateField], f.startDate, f.endDate) &&
				FilterUtils.restrictTo(row, filters.restrictions)
			);
		});

		return filtered.slice(start, end);
	},
	getFilters() {
		return filters;
	},
	getNumberOfItems() {
		return items.length;
	}

});

const onReceivingAction = action => {
	switch (action.type) {

		case ActionTypes.RECEIVE_ALL_ITEMS:
				items = action.data;
				ItemsStore.emitChange();
				break;

		case ActionTypes.RECEIVE_SINGLE_ITEM:
				items.push(action.data);
				ItemsStore.emitChange();
				break;

		case ActionTypes.CHANGE_SINGLE_JOB_ITEM:
				let d = action.data;
				items = items.map(item => {
					if (item.item_id === d.id) {
						item[d.key] = d.value;
					}
					return item;
				});
				ItemsStore.emitChange();
				break;

		case ActionTypes.RECEIVE_DELETION_CONFIRMATION:
				let itemsMinusOne = [];
				items.forEach(item => {
					if (item.item_id === action.data) {
						return;
					}
					itemsMinusOne.push(item);
				});
				items = itemsMinusOne;
				ItemsStore.emitChange();
				break;

		case ActionTypes.FILTER_BY:
				filters.filterBy = action.data;
				ItemsStore.emitChange();
				break;

		case ActionTypes.SORT_ONE:
				if (action.data === filters.sortTerm) {
					filters.isAsc = !filters.isAsc;
				} else {
					filters.isAsc = false;
				}
				filters.sortTerm = action.data;

				items = FilterUtils.genericSort(items, filters.sortTerm, filters.isAsc)
				ItemsStore.emitChange();
				break;

		case ActionTypes.SET_START_DATE:
				filters.startDate = action.data;
				ItemsStore.emitChange();
				break;

		case ActionTypes.SET_END_DATE:
				filters.endDate = action.data;
				ItemsStore.emitChange();
				break;

		case ActionTypes.RESTRICT_TO:
				if (filters.restrictions.hasOwnProperty(action.data.key)) {
					filters.restrictions[action.data.key] = action.data;
				}
				ItemsStore.emitChange();
				break;

		case ActionTypes.RECEIVE_SELECTIONS:
				AppDispatcher.waitFor([SelectionStore.dispatchToken]);
				const selections = SelectionStore.getSelections();

				Object.keys(filters.restrictions).forEach(r => {
					filters.restrictions[r].options = selections[r];
				});
				break;

		default:
				break;

	}
};

export default ItemsStore;

AppDispatcher.register(onReceivingAction);
