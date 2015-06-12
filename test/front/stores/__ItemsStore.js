"use strict";
import assert from "assert";
import rewire from "rewire";

describe("AlertStore", () => {
	let AlertStore, onReceivingAction;

	beforeEach(function() {
		AlertStore = rewire("../../../src/js/stores/AlertStore");
		onReceivingAction = AlertStore.__get__("onReceivingAction");
	});

	it("#");
});
