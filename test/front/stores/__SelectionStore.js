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
		assert.equal(typeof this.SelectionStore.getSelections(), "function");
	});

	it("#updates its internal state if the actiontype is RECEIVE SELECTIONS", function() {
		var testData = {
			testitems: [{label: "hello mum!"}, {label: ":)"}]
		};

		this.onReceivingAction({
			type: "RECEIVE_SELECTIONS",
			data: testData
		});

		assert.deepEqual(this.SelectionStore.getSelections(), {
			testitems: ["hello mum!", ":)"]
		});
	});
});
