"use strict";
import assert from "assert";
import assign from "object-assign";
import helpers from "./helpers";
import data from "./json/jobs.json";

import jobs from "../../../api/models/jobs";

describe("jobs", () => {
	before(done => helpers.start("jobs", helpers.job_items.bind(null, done)));
	after(done => helpers.drop(done));

	describe("#getAll", () => {
		it("#takes an options object and a callback", () => {
			assert.equal(jobs.getAll.length, 2);
		});

		it("#passes all jobs to the cb, sorted by the sortBy and asc options 1", () => {
			const opts = {
				sortBy: "job_id",
				asc: "false"
			};

			const jobsWeWant = data.sort((a, b) => b.job_id - a.job_id);

			jobs.getAll(opts, (err, rows) => {
				// rows.forEach(row => console.log(row.job_id + " has " + row.qty_items));
				assert.equal(err, null);
				assert.deepEqual(rows, jobsWeWant);
			});
		});

	// 	it("#passes all jobs to the cb, sorted by the sortBy and asc options 2", () => {
	// 		const opts = {
	// 			sortBy: "qty_items",
	// 			asc: "anything"
	// 		};

	// 		const jobsWeWant = data.sort((a, b) => a.type.localeCompare(b.type));

	// 		jobs.getAll(opts, (err, rows) => {
	// 			assert.equal(err, null);
	// 			assert.deepEqual(rows, jobsWeWant);
	// 		});
	// 	});

	// 	it("#passes all jobs to the cb, sorted by the sortBy and asc options - defaults", () => {
	// 		const opts = {};

	// 		const jobsWeWant = data.sort((a, b) => a.name.localeCompare(b.name));

	// 		jobs.getAll(opts, (err, rows) => {
	// 			assert.equal(err, null);
	// 			assert.deepEqual(rows, jobsWeWant);
	// 		});
	// 	});
	});

	// describe("#getSingle", () => {
	// });

	// describe("#create", () => {
	// });

	// describe("#update", () => {
	// });

	// describe("#delete", () => {
	// });
});

