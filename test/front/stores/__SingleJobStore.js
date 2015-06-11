"use strict";
var sinon = require("sinon");
var assert = require("assert");
var rewire = require("rewire");
var samplejob = require("../testdata/job").job;
var SelectionStore = require("../../../src/js/stores/SelectionStore");
var AppDispatcher = require("../../../src/js/dispatchers/AppDispatcher");

describe("SingleJobStore", function() {
	beforeEach(function() {
		this.SingleJobStore = rewire("../../../src/js/stores/SingleJobStore");
		this.onReceivingAction = this.SingleJobStore.__get__("onReceivingAction");
		this.SingleJobStore.__set__("job", samplejob);
	});

	it("#getSortedItems returns an array of sorted items", function() {
		var sortTerm = "item_id";

		var sortedItems = samplejob.items.sort(function(a, b) {
			return -(a[sortTerm].localeCompare(b[sortTerm]));
		});

		assert.deepEqual(this.SingleJobStore.getSortedItems(), sortedItems);
	});

	it("#getJobDetails returns an object containing job details", function() {
		var details = samplejob.details;

		assert.deepEqual(this.SingleJobStore.getJobDetails(), details);
	});

	it("#getFilters returns a set of filters", function() {
		var filters = {
			sortTerm: "shipping_date",
			isAsc: false
		};

		this.SingleJobStore.__set__("filters", filters);

		assert.deepEqual(this.SingleJobStore.getFilters(), filters);
	});

	it("#updates the job object upon a RECEIVE_SINGLE_JOB action", function() {
		var newJob = {
			id: "RB1101",
			details: {
				job_id: "RB1101"
			},
			items: [
				{item_id: "1105"},
				{item_id: "1103"}
			]
		};

		this.onReceivingAction({
			type: "RECEIVE_SINGLE_JOB",
			data: newJob
		});

		assert.deepEqual(this.SingleJobStore.getJobDetails(), newJob.details);
		assert.deepEqual(this.SingleJobStore.getSortedItems(), newJob.items);
	});

	it("#updates the job.items array upon a RECEIVE_SINGLE_ITEM action", function() {
		var newItem = {
			item_id: "hello everyone"
		};

		this.onReceivingAction({
			type: "RECEIVE_SINGLE_ITEM",
			data: newItem
		});

		var itemWeGotBack = this.SingleJobStore.getSortedItems().filter(function(item) {
			return item.item_id === newItem.item_id;
		})[0];

		assert.deepEqual(itemWeGotBack, newItem);
	});

	it("#updates the job.items array upon a RECEIVE_UPDATED_ITEM action", function() {
		var itemToUpdate = {
			item_id: samplejob.items[0].item_id,
			details: {
				"client": "snoop dogg"
			}
		};

		this.onReceivingAction({
			type: "RECEIVE_UPDATED_ITEM",
			data: itemToUpdate
		});

		var itemWeGotBack = this.SingleJobStore.getSortedItems().filter(function(item) {
			return item.item_id === itemToUpdate.item_id;
		})[0];

		assert.equal(itemWeGotBack.details.client, itemToUpdate.details.client);
	});

	it("#changes the details of the job upon a CHANGE_SINGLE_JOB_DETAILS action", function() {
		var detailsToChange = {
			key: "shipping_date",
			value: "hello m80"
		};

		this.onReceivingAction({
			type: "CHANGE_SINGLE_JOB_DETAILS",
			data: detailsToChange
		});

		var detailsWeGotBack = this.SingleJobStore.getJobDetails();

		assert.equal(detailsWeGotBack[detailsToChange.key], detailsToChange.value);
	});

	it("#updates the job.items array upon a CHANGE_SINGLE_JOB_ITEM action", function() {
		var itemToChange = {
			id: samplejob.items[0].item_id,
			key: "changedStuff",
			value: "what is life"
		};

		this.onReceivingAction({
			type: "CHANGE_SINGLE_JOB_ITEM",
			data: itemToChange
		});

		var itemWeGotBack = this.SingleJobStore.getSortedItems().filter(function(item) {
			return item.item_id === itemToChange.id;
		})[0];

		assert.equal(itemWeGotBack[itemToChange.key], itemToChange.value);
	});

	// it("#deletes an item from the job.items array upon a DELETE_ITEM action", function() {
	// 	var itemToDelete = {
	// 		id: samplejob.items[0].item_id
	// 	};
	// 	var oldLen = this.SingleJobStore.getSortedItems().length;

	// 	this.onReceivingAction({
	// 		type: "DELETE_ITEM",
	// 		data: itemToDelete.id
	// 	});

	// 	var itemWeGotBack = this.SingleJobStore.getSortedItems().filter(function(item) {
	// 		return item.item_id === itemToDelete.id;
	// 	})[0];

	// 	assert.equal(itemWeGotBack, undefined);
	// 	assert.equal(this.SingleJobStore.getSortedItems().length, oldLen - 1);
	// });

	it("#updates the sortTerm filter upon a SORT_ONE action, flipping isAsc if the term is the same, else false", function() {
		var sortTerm = "job_status";
		var sortTerm2 = "shipping_date";
		var filters;

		this.onReceivingAction({
			type: "SORT_ONE",
			data: sortTerm
		});

		assert.equal(this.SingleJobStore.getFilters().sortTerm, sortTerm);
		assert.equal(this.SingleJobStore.getFilters().isAsc, false);

		this.onReceivingAction({
			type: "SORT_ONE",
			data: sortTerm
		});

		assert.equal(this.SingleJobStore.getFilters().sortTerm, sortTerm);
		assert.equal(this.SingleJobStore.getFilters().isAsc, true);

		this.onReceivingAction({
			type: "SORT_ONE",
			data: sortTerm2
		});

		assert.equal(this.SingleJobStore.getFilters().sortTerm, sortTerm2);
		assert.equal(this.SingleJobStore.getFilters().isAsc, false);
	});

});
