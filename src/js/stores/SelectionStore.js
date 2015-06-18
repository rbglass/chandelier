"use strict";
import { createStore } from "../utils/StoreUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";
import flop from "../utils/flop";

var selections = {};

const SelectionStore = createStore({
	getSelections() {
		return selections;
	}
});

const onReceivingAction = action => {
	switch (action.type) {

		case ActionTypes.RECEIVE_SELECTIONS:
				// For now empty the selections object;
				selections = {};
				Object.keys(action.data).forEach(type => {
					selections[type] = action.data[type].map(sel => sel.label);
				});
				console.log(selections);
				SelectionStore.emitChange();
				break;

		case ActionTypes.RECEIVE_ALL_PRODUCTS:
				// Later move this to a product store
				// For now, assume always overwrite data;
				let typesOfProduct = Object.keys(action.data);
				selections.product = [];

				typesOfProduct.forEach(productType => {
					let batch = action.data[productType];

					if (batch.saleable === true) {
						selections.product = selections.product.concat(flop(batch.products, "name"));
					}

					selections[productType.toLowerCase()] = flop(batch.products, "name");
				});

				console.log(selections);
				SelectionStore.emitChange();
				break;

	}
};

export default SelectionStore;

SelectionStore.dispatchToken = AppDispatcher.register(onReceivingAction);
