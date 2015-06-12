"use strict";
import assert from "assert";
import rewire from "rewire";

describe("AlertStore", () => {
	let AlertStore, onReceivingAction;

	beforeEach(function() {
		AlertStore = rewire("../../../src/js/stores/AlertStore");
		onReceivingAction = AlertStore.__get__("onReceivingAction");
	});


	it("#getAlert returns the stored alert", () => {
		const errToPlant = {
			type: "error", message: 404
		};

		AlertStore.__set__("alert", errToPlant);

		assert.deepEqual(AlertStore.getAlert(), errToPlant);
	});

	it("#getLoadStatus returns the isLoading value", () => {
		AlertStore.__set__("isLoading", true);
		assert.equal(AlertStore.getLoadStatus(), true);
		AlertStore.__set__("isLoading", false);
		assert.equal(AlertStore.getLoadStatus(), false);
	});

	it("#updates the alert upon a RECEIVE_ALERT action", () => {
		const alertAction = {
			type: "RECEIVE_ALERT",
			data: {
				type: "error",
				message: 404
			}
		};

		onReceivingAction(alertAction);
		assert.deepEqual(AlertStore.getAlert(), alertAction.data);
	});

	it("#changes loading to false upon any 'RECEIVE' action", () => {
		AlertStore.__set__("isLoading", true);

		const alertAction = {
			type: "RECEIVE_BAD_NEWS"
		};
		const alertAction2 = {
			type: "RECEIVE_ALERT"
		};

		onReceivingAction(alertAction);
		assert.deepEqual(AlertStore.getLoadStatus(), false);

		AlertStore.__set__("isLoading", true);
		onReceivingAction(alertAction2);
		assert.deepEqual(AlertStore.getLoadStatus(), false);
	});

	it("#changes loading to true upon an IS_LOADING action", () => {
		AlertStore.__set__("isLoading", false);

		const alertAction = {
			type: "IS_LOADING"
		};

		onReceivingAction(alertAction);
		assert.deepEqual(AlertStore.getLoadStatus(), true);
	});

});
