"use strict";
import assert from "assert";
import rewire from "rewire";

describe("ModalStore", () => {
	let ModalStore, onReceivingAction;

	beforeEach(done => {
		ModalStore = rewire("../../../src/js/stores/ModalStore");
		onReceivingAction = ModalStore.__get__("onReceivingAction");
		done();
	});

	it("#getPendingAction returns the to-be-confirmed pending action", () => {
		const pendingAction = function() {
			return true;
		};

		assert.equal(ModalStore.getPendingAction(), null);

		ModalStore.__set__("pendingAction", pendingAction);
		assert.deepEqual(ModalStore.getPendingAction(), pendingAction);
	});

	it("#changes pendingAction to action.data upon a PENDING_ACTION action", () => {
		const pendingAction = function() {
			return true;
		};

		const testAction1 = {
			type: "PENDING_ACTION",
			data: pendingAction
		};

		const testAction2 = {
			type: "PENDING_ACTION",
			data: null
		};

		assert.equal(ModalStore.getPendingAction(), null);

		onReceivingAction(testAction1);
		assert.deepEqual(ModalStore.getPendingAction(), pendingAction);

		onReceivingAction(testAction2);
		assert.equal(ModalStore.getPendingAction(), null);

	});

});
