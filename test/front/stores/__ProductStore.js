"use strict";
import I from "immutable";
import sinon from "sinon";
import assert from "assert";
import rewire from "rewire";
import { prettyProducts, uglyProducts } from "../testdata/products";
import { sameVal } from "../setup/utils";
import AppDispatcher from "../../../src/js/dispatchers/AppDispatcher";

describe("ProductStore", () => {
	let ProductStore, onReceivingAction;

	beforeEach(() => {
		ProductStore = rewire("../../../src/js/stores/ProductStore");
		onReceivingAction = ProductStore.__get__("onReceivingAction");
		ProductStore.__set__("products", I.fromJS(uglyProducts));
	});

	it("#getFilteredProducts returns a filtered List of products", () => {
		const filters = I.fromJS({
			filterBy: "amber",
			restrictions: {
				type: {
					key: "type",
					options: ["Glass", "Pendant"]
				}
			}
		});
		const filteredUgly = uglyProducts.filter(e => e.type === "Glass" || e.type === "Pendant")
																			.filter(e => e.name.indexOf("Amber") !== -1);

		ProductStore.__set__("filters", filters);

		const productsWeGotBack = ProductStore.getFilteredProducts();
		const productsWeWant = I.fromJS(filteredUgly);

		sameVal(productsWeGotBack, productsWeWant);
	});

	it("#getPrettyProducts returns an unfiltered Map of pretty products", () => {
		sameVal(ProductStore.getPrettyProducts(), I.fromJS(prettyProducts));
	});

	it("#getFilters returns a Map of filters", () => {
		const filters = I.fromJS({
			filterBy: "amber",
			restrictions: {
				type: {
					key: "type",
					options: ["Glass"]
				}
			}
		});

		ProductStore.__set__("filters", filters);

		assert.equal(ProductStore.getFilters(), filters);
	});

	it("#getNumberOfProducts returns the size of the items List", () => {
		ProductStore.__set__("productLength", 3);
		assert.equal(ProductStore.getNumberOfProducts(), 3);
		ProductStore.__set__("productLength", 5);
		assert.equal(ProductStore.getNumberOfProducts(), 5);
	});

	it("#getSelections returns a set of selections specific to products", () => {
		const selections = I.fromJS({type: [], active: ["hello", "hi"]});
		ProductStore.__set__("selections", selections);
		assert.equal(ProductStore.getSelections(), selections);
	});

	it("#updates the products List upon a RECEIVE_ALL_PRODUCTS action", () => {
		const productAction = {
			type: "RECEIVE_ALL_PRODUCTS",
			data: []
		};

		onReceivingAction(productAction);
		sameVal(ProductStore.getFilteredProducts(), I.fromJS(productAction.data));
	});

	it("#updates the selections Map upon a RECEIVE_ALL_PRODUCTS action", () => {
		const sel = I.fromJS({
			type: []
		});
		ProductStore.__set__("selections", sel);

		const productAction = {
			type: "RECEIVE_ALL_PRODUCTS",
			data: [{type: "bling"}]
		};

		onReceivingAction(productAction);
		sameVal(ProductStore.getSelections(), sel.set("type", I.List(["bling"])));
	});

	it("#updates the products List upon a RECEIVE_SINGLE_PRODUCT action", () => {
		const newProduct = {
			id: "111",
			type: "Ceiling Plate",
			name: "2-Step Murkers",
			description: null,
			active: true,
			saleable: true,
			sku: null
		};

		onReceivingAction({
			type: "RECEIVE_SINGLE_PRODUCT",
			data: newProduct
		});

		const productWeGotBack = ProductStore.getPrettyProducts()
																					.getIn(["Ceiling Plate", "products"])
																					.find(p => p.get("name") === newProduct.name);

		sameVal(productWeGotBack, I.fromJS(newProduct));
	});

	it("#updates the respective product upon a CHANGE_SINGLE_PRODUCT action", () => {
		const updatedInfo = {
			type: "CHANGE_SINGLE_PRODUCT",
			data: {
				id: uglyProducts[0].id,
				key: "name",
				value: "Terminator"
			}
		};

		onReceivingAction(updatedInfo);

		const productsWeGotBack = ProductStore.getFilteredProducts();
		const productWeGotBack = productsWeGotBack.find(p =>
			p.get("id") === updatedInfo.data.id
		);

		assert.equal(productWeGotBack.get(updatedInfo.data.key), updatedInfo.data.value);
	});

	it("#updates the filterBy filter upon a FILTER_BY action", () => {
		const filterTerm = "JIM";
		assert.notEqual(ProductStore.getFilters().get("filterBy"), filterTerm);

		onReceivingAction({
			type: "FILTER_BY",
			data: filterTerm
		});

		assert.equal(ProductStore.getFilters().get("filterBy"), filterTerm);
	});

	it("#updates the sortTerm filter upon a SORT_PRODUCTS action, flipping isAsc if same", () => {
		const sortTerm = "SKU";
		const sortTerm2 = "name";
		let filters;

		onReceivingAction({
			type: "SORT_PRODUCTS",
			data: sortTerm
		});

		const filtersWeGotBack = ProductStore.getFilters();

		sameVal(filtersWeGotBack.get("sortTerm"), sortTerm);
		sameVal(filtersWeGotBack.get("isAsc"), false);

		onReceivingAction({
			type: "SORT_PRODUCTS",
			data: sortTerm
		});

		const moreFiltersWeGotBack = ProductStore.getFilters();

		sameVal(moreFiltersWeGotBack.get("sortTerm"), sortTerm);
		sameVal(moreFiltersWeGotBack.get("isAsc"), true);

		onReceivingAction({
			type: "SORT_PRODUCTS",
			data: sortTerm2
		});

		const evenMoreFiltersWeGotback = ProductStore.getFilters();

		sameVal(evenMoreFiltersWeGotback.get("sortTerm"), sortTerm2);
		sameVal(evenMoreFiltersWeGotback.get("isAsc"), false);
	});

	it("#resets the filters Map upon a CLEAR_PRODUCTS_FILTERS action", () => {
		const emptyFilters = I.fromJS({
			"Hello": "Hi",
			restrictions: {
				job_status: {
					key: "job_status"
				},
				order_type: {
					key: "order_type"
				}
			}
		});

		ProductStore.__set__("emptyFilters", emptyFilters);

		onReceivingAction({
			type: "CLEAR_PRODUCTS_FILTERS"
		});

		const filtersWeGotBack = ProductStore.getFilters();

		sameVal(filtersWeGotBack, emptyFilters);
	});

});
