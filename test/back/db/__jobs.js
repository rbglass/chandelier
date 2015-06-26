"use strict";
import assert from "assert";
import assign from "object-assign";
import helpers from "./helpers";

import jobs from "../../../api/models/jobs";

describe("jobs", () => {
	const datesWeDontWant = ["updatedat", "shipping_date", "createdat"];
	let data;

	before(done => helpers.start("jobs", helpers.job_items.bind(null, done)));
	after(done => helpers.drop(done));

	beforeEach(done => {
		data = require("./json/jobs.json");
		done();
	});

	function cleanseOfDates(rows1, rows2, dates) {
		return rows1.map((row, i) => {
			dates.forEach(datefield => {
				delete row[datefield];
				delete rows2[i][datefield];
			});
			return row;
		});
	}

	describe("#getAll", () => {
		it("#takes an options object and a callback", () => {
			assert.equal(jobs.getAll.length, 2);
		});

		it("#passes all jobs to the cb, sort by job_id descending", () => {
			const opts = {
				sortBy: "job_id",
				asc: "false"
			};

			const jobsWeWant = data.sort((a, b) => b.job_id - a.job_id);

			jobs.getAll(opts, (err, rows) => {
				const cleansed = cleanseOfDates(rows, jobsWeWant, datesWeDontWant);
				assert.equal(err, null);
				assert.deepEqual(cleansed, jobsWeWant);
			});
		});

		it("#passes all jobs to the cb, sort by joined qty_items ascending", () => {
			const opts = {
				sortBy: "qty_items",
				asc: "anything"
			};

			const jobsWeWant = data.sort((a, b) => a.qty_items - b.qty_items);

			jobs.getAll(opts, (err, rows) => {
				const cleansed = cleanseOfDates(rows, jobsWeWant, datesWeDontWant);
				assert.equal(err, null);
				assert.deepEqual(cleansed, jobsWeWant);
			});
		});

		it("#passes all jobs to the cb, sorted by the sortBy and asc options - defaults", () => {
			const opts = {};

			const jobsWeWant = data.sort((a, b) =>
				Date.parse(a.shipping_date) - Date.parse(b.shipping_date)
			);

			jobs.getAll(opts, (err, rows) => {
				const cleansed = cleanseOfDates(rows, jobsWeWant, datesWeDontWant);
				assert.equal(err, null);
				assert.deepEqual(cleansed, jobsWeWant);
			});
		});
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

