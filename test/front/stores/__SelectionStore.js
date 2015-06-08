"use strict";
var sinon = require("sinon");
var assert = require("assert");
var rewire = require("rewire");

describe("SelectionStore", function() {
	beforeEach(function() {
		this.SelectionStore = rewire("../../../src/js/stores/SelectionStore");
		this.onReceivingAction = this.SelectionStore.__get__("onReceivingAction");
	});

	it("#has a selections getter method", function() {
		assert(this.SelectionStore.getSelections());
	});

	it("#updates its internal state if the actiontype is RECEIVE SELECTIONS", function() {
		this.onReceivingAction({
			type: "RECEIVE_SELECTIONS",
			data: "hello mum!"
		});

		assert.equal(this.SelectionStore.getSelections(), "hello mum!");
	});
});
