"use strict";
import assert from "assert";
import rewire from "rewire";

describe("PaginationStore", () => {
	let PaginationStore, onReceivingAction;

	beforeEach(done => {
		PaginationStore = rewire("../../../src/js/stores/PaginationStore");
		onReceivingAction = PaginationStore.__get__("onReceivingAction");
		done();
	});


	it("#getDisplayStart returns the index of the first element to be rendered given the current Y", () => {
		PaginationStore.__set__("currentY", 70);
		const bufs = PaginationStore.__get__("BUFFER_ROWS");
		const rows = PaginationStore.__get__("ROW_HEIGHT");

		assert.equal(PaginationStore.getDisplayStart(), Math.floor((70 / rows)) - bufs);

		PaginationStore.__set__("currentY", 140);
		assert.equal(PaginationStore.getDisplayStart(), Math.floor((140 / rows)) - bufs);
	});

	it("#getDisplayEnd returns the index of the last element to be rendered given the current Y", () => {
		PaginationStore.__set__("currentY", 70);
		PaginationStore.__set__("tableHeight", 210);
		const bufs = PaginationStore.__get__("BUFFER_ROWS");
		const rows = PaginationStore.__get__("ROW_HEIGHT");

		assert.equal(PaginationStore.getDisplayEnd(), Math.floor((70 + 210) / rows) + bufs);

		PaginationStore.__set__("currentY", 140);
		assert.equal(PaginationStore.getDisplayEnd(), Math.floor((140 + 210) / rows) + bufs);
	});

	it("#changes the table height to action.data upon a SET_TABLE_HEIGHT action", () => {
		const heightAction = {
			type: "SET_TABLE_HEIGHT",
			data: 45
		};

		onReceivingAction(heightAction);
		assert.equal(PaginationStore.__get__("tableHeight"), 45);
	});

	it("#getCurrentY returns the current y pos", () => {
		assert.equal(PaginationStore.getCurrentY(), 0);

		PaginationStore.__set__("currentY", 5);
		assert.equal(PaginationStore.getCurrentY(), 5);
	});

	it("#getRowHeight returns the current row height", () => {
		PaginationStore.__set__("ROW_HEIGHT", 100);
		assert.equal(PaginationStore.getRowHeight(), 100);
	});


	it("#changes the current y to action.data upon a SET_CURRENT_Y action", () => {
		const nextPageAction = {
			type: "SET_CURRENT_Y",
			data: 4
		};

		assert.equal(PaginationStore.__get__("currentY"), 0);

		onReceivingAction(nextPageAction);
		assert.equal(PaginationStore.__get__("currentY"), 4);
	});

	it("#changes the current y to 0 upon a FILTER action", () => {
		const filterAction = {
			type: "FILTER_JOBS_BY"
		};

		PaginationStore.__set__("currentY", 5);
		assert.equal(PaginationStore.__get__("currentY"), 5);

		onReceivingAction(filterAction);
		assert.equal(PaginationStore.__get__("currentY"), 0);
	});

	it("#changes the current y to 0 upon a RESTRICT action", () => {
		const filterAction = {
			type: "RESTRICT_TINGS_TO"
		};

		PaginationStore.__set__("currentY", 5);
		assert.equal(PaginationStore.__get__("currentY"), 5);

		onReceivingAction(filterAction);
		assert.equal(PaginationStore.__get__("currentY"), 0);
	});


});
