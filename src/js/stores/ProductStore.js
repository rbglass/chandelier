"use strict";
import I from "immutable";
import { createStore } from "../utils/StoreUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import PaginationStore from "./PaginationStore";
import * as FilterUtils from "../utils/FilterUtils";

const emptyFilters = I.fromJS({
	sortTerm: "type",
	isAsc: false,
	filterBy: "",
	restrictions: {
		type: {
			key: "type"
		}
	}
});

const keysToSearch = ["name", "description"];

var products = I.Map(),
		filters = emptyFilters;

const ProductStore = createStore({
	getFilteredProducts() {
		let f = filters;
		// TODO: Lets lazySeq() this
		const ugly = products.map(p => p.get("products"))
													.reduce((l, m) => l.concat(m), I.List())
													.filter(row => FilterUtils.satisfies(row, f.get("restrictions")))
													.filter(row => FilterUtils.contains(row, f.get("filterBy"), keysToSearch));
		return ugly;
	},
	getPrettyProducts() {
		return products;
	},
	getFilters() {
		return filters;
	}
});

const onReceivingAction = action => {
	switch (action.type) {

		case ActionTypes.RECEIVE_ALL_PRODUCTS:
				products = I.fromJS(action.data);
				ProductStore.emitChange();
				break;

		case ActionTypes.RECEIVE_SINGLE_PRODUCT:
				products = products.updateIn(
					[action.data.type, "products"],
					list => list.push(I.fromJS(action.data))
				);
				ProductStore.emitChange();
				break;

		// case ActionTypes.CHANGE_SINGLE_PRODUCT:
		// 		let d = action.data;
		// 		products = products.map(type =>
		// 			type.
		// 			item.get("id") === d.id ?
		// 				item.set(d.key, d.value) :
		// 				item
		// 		);
		// 		ProductStore.emitChange();
		// 		break;

		case ActionTypes.FILTER_BY:
				filters = filters.set("filterBy", action.data);
				ProductStore.emitChange();
				break;

		case ActionTypes.SORT_PRODUCTS:
				const asc = action.data === filters.get("sortTerm") ?
											!filters.get("isAsc") :
											false;

				filters = filters.set("isAsc", asc);
				filters = filters.set("sortTerm", action.data);
				ProductStore.emitChange();
				break;

		default:
				break;
	}
};

export default ProductStore;

AppDispatcher.register(onReceivingAction);
