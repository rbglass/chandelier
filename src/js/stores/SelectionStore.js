"use strict";
import I from "immutable";
import { createStore } from "../utils/StoreUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import flop from "../utils/flop";

var selections = I.Map();

const SelectionStore = createStore({
	getSelections() {
		return selections;
	}
});

const onReceivingAction = action => {
	switch (action.type) {

		case ActionTypes.RECEIVE_SELECTIONS:

				Object.keys(action.data).forEach(type => {
					let batch = flop(action.data[type], "label");
					selections = selections.set(type, I.List(batch));
				});
				SelectionStore.emitChange();
				break;

		case ActionTypes.RECEIVE_ALL_PRODUCTS:
				// Later move this to a product store
				// For now, assume always overwrite data;
				let typesOfProduct = Object.keys(action.data);
				selections = selections.set("product", I.List());

				// Better functionally done with a reduce & 'withMutable()' perf optimisations
				typesOfProduct.forEach(productType => {
					let batch = action.data[productType];
					let flopped = flop(batch.products, "name");

					if (batch.saleable === true) {
						selections = selections.updateIn(["product"], list => list.concat(flopped));
					}

					selections = selections.set(productType.toLowerCase(), I.List(flopped));
				});

				SelectionStore.emitChange();
				break;

	}
};

export default SelectionStore;

SelectionStore.dispatchToken = AppDispatcher.register(onReceivingAction);
