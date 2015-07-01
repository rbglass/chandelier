"use strict";
import assert from "assert";
import formatter from "../../../api/utils/formatter";

describe("formatter", () => {

	describe(".job", () => {
		it("#takes a job and returns a formatted version with job_id and details", () => {
			const dummy = {
				job_id: "hi mate",
				others: "chickens"
			};

			const result = formatter.job(dummy);
			const whatWeWant = {
				job_id: dummy.job_id,
				details: dummy
			};
			assert.deepEqual(result, whatWeWant);
		});
	});

	describe(".jobWithItems", () => {
		it("#takes a job and some items and returns a formatted version with job_id, details and items", () => {
			const dummy = {
				job_id: "hi mate",
				others: "chickens"
			};
			const items = ["hello", "hi"];

			const result = formatter.jobWithItems(dummy, items);

			const whatWeWant = {
				job_id: dummy.job_id,
				details: dummy,
				items: items
			};

			assert.deepEqual(result, whatWeWant);
		});

		it("#defaults to an empty array for items", () => {
			const dummy = {
				job_id: "hi mate",
				others: "chickens"
			};

			const items = null;

			const result = formatter.jobWithItems(dummy, items);

			const whatWeWant = {
				job_id: dummy.job_id,
				details: dummy,
				items: []
			};

			assert.deepEqual(result, whatWeWant);
		});
	});

	describe(".products", () => {
		it("#takes an array of products and returns a formatted object of type: [products]", () => {
			const products = [ { type: "hat" }, { type: "hat" }, { type: "cat"} ];
			const result = formatter.products(products);
			const whatWeWant = {
				hat: [{ type: "hat" }, { type: "hat" }],
				cat: [{ type: "cat"} ]
			};

			assert.deepEqual(result, whatWeWant);
		});
	});
});
