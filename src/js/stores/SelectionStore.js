"use strict";
import I from "immutable";
import { createStore } from "../utils/StoreUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import ProductStore from "./ProductStore";
import flop from "../utils/flop";

var selections = I.Map();

const SelectionStore = createStore({
	getSelections() {
		return selections;
	}
});

const onReceivingAction = action => {
	switch (action.type) {

		case ActionTypes.RECEIVE_ALL_SELECTIONS:

				Object.keys(action.data).forEach(type => {
					let batch = flop(action.data[type], "label");
					selections = selections.set(type, I.List(batch));
				});
				SelectionStore.emitChange();
				break;

		case ActionTypes.RECEIVE_ALL_PRODUCTS:
				AppDispatcher.waitFor([ProductStore.dispatchToken]);
				let products = ProductStore.getPrettyProducts();
				let typesOfProduct = products.keySeq();
				selections = selections.set("product", I.List());

				// Can be better functionally done
				typesOfProduct.forEach(productType => {
					let batch = products.get(productType).filter(e => e.get("active"));
					let saleable = batch.filter(e => e.get("saleable"));

					selections = selections.updateIn(["product"], list =>
						list.concat(saleable.map(p => p.get("name")))
					);

					selections = selections.set(
						productType.toLowerCase(),
						I.List(batch.map(p => p.get("name")))
					);
				});

				SelectionStore.emitChange();
				break;

	}
};

export default SelectionStore;

SelectionStore.dispatchToken = AppDispatcher.register(onReceivingAction);
