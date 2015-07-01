"use strict";
import I from "immutable";
import sinon from "sinon";
import assert from "assert";
import rewire from "rewire";
import { items as sampleitems } from "../testdata/items";
import { sameVal } from "../setup/utils";
import SelectionStore from "../../../src/js/stores/SelectionStore";
import AppDispatcher from "../../../src/js/dispatchers/AppDispatcher";

describe("ItemsStore", () => {
	let ItemsStore, onReceivingAction;

	beforeEach(() => {
		ItemsStore = rewire("../../../src/js/stores/ItemsStore");
		onReceivingAction = ItemsStore.__get__("onReceivingAction");
		ItemsStore.__set__("items", I.fromJS(sampleitems));
	});

	it("#getFilteredItems returns a filtered List of items", () => {
		const filters = I.fromJS({
			sortTerm: "job_id",
			isAsc: false,
			filterBy: "",
			dateField: "shipping_date",
			startDate: "2016-01-01",
			endDate: "",
			restrictions: {
				"job_status": {
					key: "job_status"
				},
				"order_type": {
					key: "order_type"
				}
			}
		});

		ItemsStore.__set__("filters", filters);
		const itemsWeGotBack = ItemsStore.getFilteredItems();
		const itemsWeWant = I.fromJS(sampleitems.filter((e) =>
			Date.parse(e.shipping_date) > Date.parse(filters.get("startDate"))
		));
		sameVal(itemsWeGotBack, itemsWeWant);
	});

	it("#getFilters returns a Map of filters", () => {
		const filters = I.fromJS({
			sortTerm: "job_id",
			isAsc: false,
			filterBy: "",
			dateField: "shipping_date",
			startDate: "2016-01-01",
			endDate: "",
			restrictions: {
				"job_status": {
					key: "job_status"
				},
				"payment": {
					key: "payment"
				}
			}
		});
		ItemsStore.__set__("filters", filters);

		assert.deepEqual(ItemsStore.getFilters(), filters);
	});

	it("#getNumberOfItems returns the size of the items List", () => {
		ItemsStore.__set__("itemLength", 3);
		assert.equal(ItemsStore.getNumberOfItems(), 3);
		ItemsStore.__set__("itemLength", 5);
		assert.equal(ItemsStore.getNumberOfItems(), 5);
	});

	it("#updates the items List upon a RECEIVE_ALL_ITEMS action", () => {
		const itemAction = {
			type: "RECEIVE_ALL_ITEMS",
			data: sampleitems
		};

		onReceivingAction(itemAction);
		sameVal(ItemsStore.getFilteredItems(), I.fromJS(itemAction.data.filter(e =>
			["Confirmed", "Packaged"].indexOf(e.job_status) !== -1
		)));
	});

	it("#updates the filterBy filter upon a FILTER_ITEMS_BY action", () => {
		const filterTerm = "JIM";
		assert.notEqual(ItemsStore.getFilters().get("filterBy"), filterTerm);

		onReceivingAction({
			type: "FILTER_ITEMS_BY",
			data: filterTerm
		});

		assert.equal(ItemsStore.getFilters().get("filterBy"), filterTerm);
	});

	it("#updates the sortTerm filter upon a SORT_ITEMS action, flipping isAsc if same", () => {
		const sortTerm = "product";
		const sortTerm2 = "shipping_date";
		let filters;

		onReceivingAction({
			type: "SORT_ITEMS",
			data: sortTerm
		});

		const filtersWeGotBack = ItemsStore.getFilters();

		sameVal(filtersWeGotBack.get("sortTerm"), sortTerm);
		sameVal(filtersWeGotBack.get("isAsc"), false);

		onReceivingAction({
			type: "SORT_ITEMS",
			data: sortTerm
		});

		const moreFiltersWeGotBack = ItemsStore.getFilters();

		sameVal(moreFiltersWeGotBack.get("sortTerm"), sortTerm);
		sameVal(moreFiltersWeGotBack.get("isAsc"), true);

		onReceivingAction({
			type: "SORT_ITEMS",
			data: sortTerm2
		});

		const evenMoreFiltersWeGotback = ItemsStore.getFilters();

		sameVal(evenMoreFiltersWeGotback.get("sortTerm"), sortTerm2);
		sameVal(evenMoreFiltersWeGotback.get("isAsc"), false);
	});

	it("#updates the startDate filter upon a SET_ITEMS_START_DATE action", () => {
		const startDate = "1999-01-01";

		onReceivingAction({
			type: "SET_ITEMS_START_DATE",
			data: startDate
		});

		assert.equal(ItemsStore.getFilters().get("startDate"), startDate);
	});

	it("#updates the endDate filter upon a SET_ITEMS_END_DATE action", () => {
		const endDate = "2019-01-01";

		onReceivingAction({
			type: "SET_ITEMS_END_DATE",
			data: endDate
		});

		assert.equal(ItemsStore.getFilters().get("endDate"), endDate);
	});

	it("#updates the restrictions object upon a RESTRICT_ITEMS_TO action", () => {
		const newRestrictions = {
			key: "job_status",
			options: ["Accepted", "TBC", "Non-Starter"]
		};
		onReceivingAction({
			type: "RESTRICT_ITEMS_TO",
			data: newRestrictions
		});
		const filtersWeGotBack = ItemsStore.getFilters().getIn(["restrictions", newRestrictions.key]);

		sameVal(filtersWeGotBack, I.fromJS(newRestrictions));
	});

	it("#resets the filters Map upon a CLEAR_ITEMS_FILTERS action", () => {
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

		ItemsStore.__set__("emptyFilters", emptyFilters);

		onReceivingAction({
			type: "CLEAR_ITEMS_FILTERS"
		});

		const filtersWeGotBack = ItemsStore.getFilters();

		sameVal(filtersWeGotBack, emptyFilters);
	});

	it("#populates each restriction's options upon a RECEIVE_ALL_SELECTIONS action", () => {
		const selections = I.fromJS({
			job_status: ["hi", "mate"],
			order_type: ["nice", "one"]
		});

		const dispyStub = sinon.stub(AppDispatcher, "waitFor", () => {
			return true;
		});
		const SelStoreStub = sinon.stub(SelectionStore, "getSelections", () => {
			return selections;
		});
		let filters;

		onReceivingAction({
			type: "RECEIVE_ALL_SELECTIONS"
		});

		filters = ItemsStore.getFilters();

		Object.keys(selections).forEach(function(key) {
			sameVal(filters.getIn(["restrictions", key, "options"], selections.get(key)));
		});
		SelStoreStub.restore();
		dispyStub.restore();

	});
});
