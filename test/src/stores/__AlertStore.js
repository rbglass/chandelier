"use strict";
import assert from "assert";
import rewire from "rewire";

describe("AlertStore", () => {
	let AlertStore, onReceivingAction;

	beforeEach(done => {
		AlertStore = rewire("../../../src/js/stores/AlertStore");
		onReceivingAction = AlertStore.__get__("onReceivingAction");
		done();
	});


	it("#getAlert returns the stored alert", () => {
		const errToPlant = {
			type: "error", message: 404
		};

		AlertStore.__set__("alert", errToPlant);

		assert.deepEqual(AlertStore.getAlert(), errToPlant);
	});

	it("#getLoadStatus returns whether anything is still loading or not", () => {
		AlertStore.__set__("loadingTracker", [1]);
		assert.equal(AlertStore.getLoadStatus(), true);
		AlertStore.__set__("loadingTracker", []);
		assert.equal(AlertStore.getLoadStatus(), false);
	});

	it("#getUnsavedStatus returns whether anything is unsaved or not", () => {
		AlertStore.__set__("isUnsaved", false);
		assert.equal(AlertStore.getUnsavedStatus(), false);
		AlertStore.__set__("isUnsaved", true);
		assert.equal(AlertStore.getUnsavedStatus(), true);
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

	it("#adds a counter to the loading array upon an IS_LOADING action", () => {
		AlertStore.__set__("loadingTracker", []);

		const alertAction = {
			type: "IS_LOADING"
		};

		onReceivingAction(alertAction);
		const loadingTracker = AlertStore.__get__("loadingTracker");

		assert.deepEqual(AlertStore.getLoadStatus(), true);
		assert(loadingTracker.length, 1);

		onReceivingAction(alertAction);
		const loadingTracker2 = AlertStore.__get__("loadingTracker");
		assert.deepEqual(AlertStore.getLoadStatus(), true);
		assert(loadingTracker2.length, 1);

	});

	it("#removes a counter from the loading array upon any 'RECEIVE' action", () => {
		AlertStore.__set__("loadingTracker", [1, 2]);

		const alertAction = {
			type: "RECEIVE_BAD_NEWS"
		};
		const alertAction2 = {
			type: "RECEIVE_ALERT"
		};

		onReceivingAction(alertAction);
		const loadingTracker = AlertStore.__get__("loadingTracker");
		assert.deepEqual(AlertStore.getLoadStatus(), true);
		assert.equal(loadingTracker.length, 1);

		onReceivingAction(alertAction2);
		const loadingTracker2 = AlertStore.__get__("loadingTracker");
		assert.deepEqual(AlertStore.getLoadStatus(), false);
		assert.equal(loadingTracker2.length, 0);
	});

	it("#can handle combinations of receive and loading actions 1", () => {
		AlertStore.__set__("loadingTracker", []);

		const alertAction = {
			type: "RECEIVE_BAD_NEWS"
		};
		const loadingAction = {
			type: "IS_LOADING"
		};

		let combo1 = [loadingAction, alertAction, loadingAction, loadingAction, alertAction, alertAction];

		combo1.forEach(action => onReceivingAction(action));
		const combo1TrackerLength = AlertStore.__get__("loadingTracker").length;
		assert.equal(AlertStore.getLoadStatus(), false);
		assert.equal(combo1TrackerLength, 0);
	});

	it("#can handle combinations of receive and loading actions 2", () => {
		AlertStore.__set__("loadingTracker", []);

		const alertAction = {
			type: "RECEIVE_BAD_NEWS"
		};
		const loadingAction = {
			type: "IS_LOADING"
		};

		let combo2 = [loadingAction, loadingAction, loadingAction, alertAction, alertAction];

		combo2.forEach(action => onReceivingAction(action));
		const combo2TrackerLength = AlertStore.__get__("loadingTracker").length;
		assert.equal(AlertStore.getLoadStatus(), true);
		assert.equal(combo2TrackerLength, 1);
	});

	it("#can handle combinations of receive and loading actions 3", () => {
		AlertStore.__set__("loadingTracker", []);

		const alertAction = {
			type: "RECEIVE_BAD_NEWS"
		};
		const loadingAction = {
			type: "IS_LOADING"
		};

		let combo3 = [alertAction, alertAction, loadingAction];

		combo3.forEach(action => onReceivingAction(action));
		const combo3TrackerLength = AlertStore.__get__("loadingTracker").length;
		assert.equal(AlertStore.getLoadStatus(), true);
		assert.equal(combo3TrackerLength, 1);
	});

	it("#changes isUnsaved to true upon any CHANGE action", () => {
		AlertStore.__set__("isUnsaved", false);
		const changeAction = {
			type: "CHANGE"
		};
		onReceivingAction(changeAction);
		assert(AlertStore.getUnsavedStatus());
	});

	it("#changes isUnsaved to false upon any RECEIVE action", () => {
		AlertStore.__set__("isUnsaved", true);
		const changeAction = {
			type: "RECEIVE"
		};
		onReceivingAction(changeAction);
		assert.equal(AlertStore.getUnsavedStatus(), false);
	});
});
