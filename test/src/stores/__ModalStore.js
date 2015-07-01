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
		const pendingAction = {
			type: "test",
			action: function() {
				return true;
			}
		};

		assert.equal(ModalStore.getPendingAction(), null);

		ModalStore.__set__("pendingAction", pendingAction);
		assert.deepEqual(ModalStore.getPendingAction(), pendingAction);
	});

	it("#changes pendingAction to action.data upon a PENDING_ACTION action", () => {
		const pendingAction = {
			type: "test",
			action: function() {
				return true;
			}
		};

		const pendingAction2 = {
			type: "test2",
			action: null
		};

		const testAction1 = {
			type: "PENDING_ACTION",
			data: pendingAction
		};

		const testAction2 = {
			type: "PENDING_ACTION",
			data: pendingAction2
		};

		assert.equal(ModalStore.getPendingAction(), null);

		onReceivingAction(testAction1);
		assert.deepEqual(ModalStore.getPendingAction(), pendingAction);

		onReceivingAction(testAction2);
		assert.deepEqual(ModalStore.getPendingAction(), pendingAction2);

	});

});
