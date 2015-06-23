"use strict";
import I from "immutable";
import { createStore } from "../utils/StoreUtils";
import { products as prettify } from "../../../api/utils/formatter";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import PaginationStore from "./PaginationStore";
import * as FilterUtils from "../utils/FilterUtils";

const emptyFilters = I.fromJS({
	sortTerm: "name",
	isAsc: false,
	filterBy: "",
	restrictions: {
		type: {
			key: "type"
		}
	}
});

const keysToSearch = ["name", "description"];

var products = I.List(),
		productLength = 0,
		filters = emptyFilters,
		selections = I.fromJS({
			type: [],
			active: [true, false],
			saleable: [true, false]
		});

const ProductStore = createStore({
	getFilteredProducts(start, end) {
		let f = filters;
		// TODO: Lets lazySeq() this
		const ugly = products.filter(row => FilterUtils.satisfies(row, f.get("restrictions")))
													.filter(row => FilterUtils.contains(row, f.get("filterBy"), keysToSearch));

		productLength = ugly.size;
		return ugly.slice(start, end);
	},
	getPrettyProducts() {
		return I.fromJS(prettify(products.toJS()));
	},
	getFilters() {
		return filters;
	},
	getNumberOfProducts() {
		return productLength;
	},
	getSelections() {
		return selections;
	}
});

const onReceivingAction = action => {
	switch (action.type) {

		case ActionTypes.RECEIVE_ALL_PRODUCTS:
				let uniqueTypes = {};
				action.data.forEach(e => uniqueTypes[e.type] = true);
				selections = selections.set("type", I.List(Object.keys(uniqueTypes).sort()));

				products = I.fromJS(action.data);
				ProductStore.emitChange();
				break;

		case ActionTypes.RECEIVE_SINGLE_PRODUCT:
				products = products.push(I.fromJS(action.data));
				ProductStore.emitChange();
				break;

		case ActionTypes.CHANGE_SINGLE_PRODUCT:
				let d = action.data;
				products = products.map(p =>
					p.get("id") === d.id ?
						p.set(d.key, d.value) :
						p
				);
				ProductStore.emitChange();
				break;

		case ActionTypes.FILTER_PRODUCTS_BY:
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

		case ActionTypes.RESTRICT_PRODUCTS_TO:
				if (filters.hasIn(["restrictions", action.data.key])) {
					filters = filters.setIn(["restrictions", action.data.key], I.fromJS(action.data));
				}
				ProductStore.emitChange();
				break;

		case ActionTypes.CLEAR_PRODUCTS_FILTERS:
				filters = emptyFilters;
				ProductStore.emitChange();
				break;

		default:
				break;
	}
};

export default ProductStore;

ProductStore.dispatchToken = AppDispatcher.register(onReceivingAction);
