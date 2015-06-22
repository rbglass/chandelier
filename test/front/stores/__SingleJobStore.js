"use strict";
import I from "immutable";
import assert from "assert";
import rewire from "rewire";
import { job as samplejob } from "../testdata/job";
import { sameVal } from "../setup/utils";
import SelectionStore from "../../../src/js/stores/SelectionStore";
import AppDispatcher from "../../../src/js/dispatchers/AppDispatcher";

describe("SingleJobStore", () => {
	let SingleJobStore, onReceivingAction;

	beforeEach(() => {
		SingleJobStore = rewire("../../../src/js/stores/SingleJobStore");
		onReceivingAction = SingleJobStore.__get__("onReceivingAction");
		SingleJobStore.__set__("job", I.fromJS(samplejob));
	});

	it("#getSortedItems returns a List of items", () => {
		sameVal(SingleJobStore.getSortedItems(), I.fromJS(samplejob.items));
	});

	it("#getJobDetails returns a Map containing job details", () => {
		const details = I.Map(samplejob.details);
		sameVal(SingleJobStore.getJobDetails(), details);
	});

	it("#getFilters returns a Map of filters", () => {
		const filters = I.Map({
			sortTerm: "shipping_date",
			isAsc: false
		});

		SingleJobStore.__set__("filters", filters);

		sameVal(SingleJobStore.getFilters(), filters);
	});

	it("#updates the job Map upon a RECEIVE_SINGLE_JOB action", () => {
		const newJob = {
			id: "RB1101",
			details: {
				job_id: "RB1101"
			},
			items: [
				{item_id: "1105"},
				{item_id: "1103"}
			]
		};

		onReceivingAction({
			type: "RECEIVE_SINGLE_JOB",
			data: newJob
		});

		sameVal(SingleJobStore.getJobDetails(), I.Map(newJob.details));
		sameVal(SingleJobStore.getSortedItems(), I.fromJS(newJob.items));
	});

	it("#updates the job.items List upon a RECEIVE_SINGLE_ITEM action", () => {
		const newItem = {
			item_id: "hello everyone"
		};
		const newItem2 = {
			item_id: "tim"
		};

		onReceivingAction({
			type: "RECEIVE_SINGLE_ITEM",
			data: newItem
		});

		const itemWeGotBack = SingleJobStore.getSortedItems().filter(item =>
			item.get("item_id") === newItem.item_id
		).last();

		sameVal(itemWeGotBack, I.fromJS(newItem));

		onReceivingAction({
			type: "RECEIVE_SINGLE_ITEM",
			data: newItem2
		});

		const itemsWeGotBack = SingleJobStore.getSortedItems();
		const allOurSampleItems = samplejob.items.concat([newItem, newItem2]);

		sameVal(itemsWeGotBack, I.fromJS(allOurSampleItems));

	});

	it("#changes the details of the job upon a CHANGE_SINGLE_JOB_DETAILS action", () => {
		var detailsToChange = {
			key: "shipping_date",
			id: samplejob.job_id,
			value: "hello m80"
		};

		onReceivingAction({
			type: "CHANGE_SINGLE_JOB_DETAILS",
			data: detailsToChange
		});

		var detailsWeGotBack = SingleJobStore.getJobDetails();

		sameVal(detailsWeGotBack.get(detailsToChange.key), detailsToChange.value);
	});

	it("#updates the job.items List upon a CHANGE_SINGLE_JOB_ITEM action", () => {
		const itemToChange = {
			id: samplejob.items[0].item_id,
			key: "changedStuff",
			value: "what is life"
		};

		onReceivingAction({
			type: "CHANGE_SINGLE_JOB_ITEM",
			data: itemToChange
		});

		const itemsWeGotBack = SingleJobStore.getSortedItems();
		const itemWeGotBack = itemsWeGotBack.filter(item =>
			item.get("item_id") === itemToChange.id
		).last();

		sameVal(itemWeGotBack.get(itemToChange.key), itemToChange.value);
	});

	it("#deletes an item from the job.items List upon a RECEIVE_DELETION_CONFIRMATION action", () => {
		const itemToDelete = {
			id: samplejob.items[0].item_id
		};
		const oldLen = SingleJobStore.getSortedItems().size;

		onReceivingAction({
			type: "RECEIVE_DELETION_CONFIRMATION",
			data: itemToDelete.id
		});

		const itemsWeGotBack = SingleJobStore.getSortedItems();
		const itemWeGotBack = itemsWeGotBack.filter(item =>
			item.item_id === itemToDelete.id
		).last();

		sameVal(itemWeGotBack, undefined);
		sameVal(itemsWeGotBack.size, oldLen - 1);
	});

	it("#updates the sortTerm filter upon a SORT_ONE action, flipping isAsc if same, & sorts the List", () => {
		const sortTerm = "job_status";
		const sortTerm2 = "shipping_date";
		let filters;

		onReceivingAction({
			type: "SORT_ONE",
			data: sortTerm
		});

		const filtersWeGotBack = SingleJobStore.getFilters();

		sameVal(filtersWeGotBack.get("sortTerm"), sortTerm);
		sameVal(filtersWeGotBack.get("isAsc"), false);
		sameVal(SingleJobStore.getSortedItems(), I.fromJS(samplejob.items.slice(0).sort((a, b) =>
			b[sortTerm].localeCompare(a[sortTerm])
		)));

		onReceivingAction({
			type: "SORT_ONE",
			data: sortTerm
		});

		const moreFiltersWeGotBack = SingleJobStore.getFilters();

		sameVal(moreFiltersWeGotBack.get("sortTerm"), sortTerm);
		sameVal(moreFiltersWeGotBack.get("isAsc"), true);
		sameVal(SingleJobStore.getSortedItems(), I.fromJS(samplejob.items.slice(0).sort((a, b) =>
			a[sortTerm].localeCompare(b[sortTerm])
		)));

		onReceivingAction({
			type: "SORT_ONE",
			data: sortTerm2
		});

		const evenMoreFiltersWeGotback = SingleJobStore.getFilters();

		sameVal(evenMoreFiltersWeGotback.get("sortTerm"), sortTerm2);
		sameVal(evenMoreFiltersWeGotback.get("isAsc"), false);
		// sameVal(SingleJobStore.getSortedItems(), I.fromJS(samplejob.items.sort((a, b) =>
		// 	b[sortTerm] - a[sortTerm]
		// )));
	});

});
