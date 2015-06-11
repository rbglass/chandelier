"use strict";
import assert from "assert";
import rewire from "rewire";

describe("SelectionStore", function() {
	let SelectionStore, onReceivingAction;

	beforeEach(function() {
		SelectionStore = rewire("../../../src/js/stores/SelectionStore");
		onReceivingAction = SelectionStore.__get__("onReceivingAction");
	});

	it("#has a selections getter method", function() {
		let dummy = {hello: "hi"};
		SelectionStore.__set__("selections", dummy);
		assert.equal(typeof SelectionStore.getSelections, "function");
		assert.deepEqual(SelectionStore.getSelections(), dummy);
	});

	it("#updates its internal state if the actiontype is RECEIVE SELECTIONS", function() {
		var testData = {
			testitems: [{label: "hello mum!"}, {label: ":)"}]
		};

		onReceivingAction({
			type: "RECEIVE_SELECTIONS",
			data: testData
		});

		assert.deepEqual(SelectionStore.getSelections(), {
			testitems: ["hello mum!", ":)"]
		});
	});

	it("#updates its internal state if the actiontype is RECEIVE_ALL_PRODUCTS", function() {
		var testData = {
			testitems1: {
				saleable: true,
				products: [{name: "hello mum!", age: "15"}, {name: ":)"}]
			},
			TESTITEMS2: {
				saleable: false,
				products: [{name: "test2"}, {name: ":("}]
			},
			testItems3: {
				saleable: true,
				products: [{name: "tony"}]
			}
		};

		onReceivingAction({
			type: "RECEIVE_ALL_PRODUCTS",
			data: testData
		});

		assert.deepEqual(SelectionStore.getSelections(), {
			product: ["hello mum!", ":)", "tony"],
			testitems1: ["hello mum!", ":)"],
			testitems2: ["test2", ":("],
			testitems3: ["tony"]
		});
	});

	it("#lowercases productType keys", () => {});
	it("#flops the arr of objs into an arr of values: from the name prop", () => {});
	it("#also pushes saleable products to the 'product' array", () => {});
	it("#gives each product type its own property", () => {});
});
