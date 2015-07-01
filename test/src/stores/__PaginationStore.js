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

	it("#getCurrentPage returns the current page", () => {
		assert.equal(PaginationStore.getCurrentPage(), 0);

		PaginationStore.__set__("currentPage", 5);
		assert.equal(PaginationStore.getCurrentPage(), 5);
	});


	it("#getRowsPerPage returns the number of rows per page", () => {
		PaginationStore.__set__("rowsPerPage", 30);
		assert.equal(PaginationStore.getRowsPerPage(), 30);

		PaginationStore.__set__("rowsPerPage", 100);
		assert.equal(PaginationStore.getRowsPerPage(), 100);
	});

	it("#getOffset returns the current offset", () => {
		assert.equal(PaginationStore.getOffset(), 0);

		PaginationStore.__set__("rowsPerPage", 100);
		assert.equal(PaginationStore.getOffset(), 0);

		PaginationStore.__set__("currentPage", 3);
		assert.equal(PaginationStore.getOffset(), 300);
	});

	it("#changes the current page to action.data upon a SWITCH_PAGE_NUMBER action", () => {
		const nextPageAction = {
			type: "SWITCH_PAGE_NUMBER",
			data: 4
		};

		assert.equal(PaginationStore.getCurrentPage(), 0);

		onReceivingAction(nextPageAction);
		assert.equal(PaginationStore.getCurrentPage(), 4);
	});

});
