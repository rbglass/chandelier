"use strict";
import I from "immutable";
import sinon from "sinon";
import assert from "assert";
import rewire from "rewire";
import { sameVal } from "../setup/utils";
import ProductStore from "../../../src/js/stores/ProductStore";
import AppDispatcher from "../../../src/js/dispatchers/AppDispatcher";


describe("SelectionStore", function() {
	let SelectionStore, onReceivingAction;

	beforeEach(function() {
		SelectionStore = rewire("../../../src/js/stores/SelectionStore");
		SelectionStore.__set__("selections", I.Map());
		onReceivingAction = SelectionStore.__get__("onReceivingAction");
	});

	it("#has a selections getter method", function() {
		let dummy = I.Map({hello: "hi"});
		SelectionStore.__set__("selections", dummy);

		assert.equal(typeof SelectionStore.getSelections, "function");
		assert.equal(SelectionStore.getSelections(), dummy);
	});

	it("#updates its internal state if the actiontype is RECEIVE SELECTIONS", function() {
		var testData = {
			testitems: [{label: "hello mum!"}, {label: ":)"}]
		};

		onReceivingAction({
			type: "RECEIVE_SELECTIONS",
			data: testData
		});

		sameVal(SelectionStore.getSelections(), I.Map({
			testitems: I.List(["hello mum!", ":)"])
		}));
	});

	it("#updates its internal state if the actiontype is RECEIVE_ALL_PRODUCTS", function() {
		var testData = {
			testitems1: [
				{name: "hello mum!", age: "15", active: true, saleable: true},
				{name: ":)", active: true, saleable: true}
			],
			TESTITEMS2: [
				{name: "test2", active: true, saleable: false},
				{name: ":(", active: true, saleable: false}
			],
			testItems3: [
				{name: "tony", active: true, saleable: true}
			]
		};

		const dispyStub = sinon.stub(AppDispatcher, "waitFor", () => {
			return true;
		});
		const SelStoreStub = sinon.stub(ProductStore, "getPrettyProducts", () => {
			return I.fromJS(testData);
		});

		onReceivingAction({
			type: "RECEIVE_ALL_PRODUCTS",
			data: testData
		});

		const selectionsWeGotBack = SelectionStore.getSelections();

		sameVal(selectionsWeGotBack, I.Map({
			product: I.List(["hello mum!", ":)", "tony"]),
			testitems1: I.List(["hello mum!", ":)"]),
			testitems2: I.List(["test2", ":("]),
			testitems3: I.List(["tony"])
		}));
	});

	it("#lowercases productType keys", () => {});
	it("#flops the arr of objs into an arr of values: from the name prop", () => {});
	it("#also pushes saleable products to the 'product' array", () => {});
	it("#gives each product type its own property", () => {});
});
