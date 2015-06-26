"use strict";
import assert from "assert";
import assign from "object-assign";
import helpers from "./helpers";

import jobs from "../../../api/models/jobs";

describe("jobs", () => {
	const datesWeDontWant = ["updatedat", "shipping_date", "createdat"];
	let data, itemdata;

	before(done => helpers.start("jobs", helpers.job_items.bind(null, done)));
	after(done => helpers.drop(done));

	beforeEach(done => {
		itemdata = require("./json/job_items.json");
		data = require("./json/jobs.json");
		done();
	});

	function cleanseOfDates(dates, row1, ...rows) {
		dates.forEach(datefield => {
			delete row1[datefield];
			rows.forEach(row => delete row[datefield]);
		});
		return row1;
	}

	const dCleanse = cleanseOfDates.bind(null, datesWeDontWant);

	describe("#getAll", () => {
		it("#takes an options object and a callback", () => {
			assert.equal(jobs.getAll.length, 2);
		});

		it("#passes all jobs to the cb, sorted by opts-specified job_id descending", done => {
			const opts = {
				sortBy: "job_id",
				asc: "false"
			};

			const jobsWeWant = data.sort((a, b) => b.job_id - a.job_id);

			jobs.getAll(opts, (err, rows) => {
				const cleansed = rows.map((e, i) => dCleanse(e, data[i]));
				assert.equal(err, null);
				assert.deepEqual(cleansed, jobsWeWant);
				done();
			});
		});

		it("#passes all jobs to the cb, sorted by opts-specified joined qty_items ascending", done => {
			const opts = {
				sortBy: "qty_items",
				asc: "anything"
			};

			const jobsWeWant = data.sort((a, b) => a.qty_items - b.qty_items);

			jobs.getAll(opts, (err, rows) => {
				const cleansed = rows.map((e, i) => dCleanse(e, data[i]));
				assert.equal(err, null);
				assert.deepEqual(cleansed, jobsWeWant);
				done();
			});
		});

		it("#passes all jobs to the cb, sorted by default shipping_date ascending", () => {
			const opts = {};

			const jobsWeWant = data.sort((a, b) =>
				Date.parse(a.shipping_date) - Date.parse(b.shipping_date)
			);

			jobs.getAll(opts, (err, rows) => {
				const cleansed = rows.map((e, i) => dCleanse(e, data[i]));
				assert.equal(err, null);
				assert.deepEqual(cleansed, jobsWeWant);
			});
		});
	});

	describe("#getSingle", () => {

		it("#takes an id, opts object and a callback", () => {
			assert.equal(jobs.getSingle.length, 3);
		});

		it("#passes a single job and its associated items to the cb, fixed sorting", done => {
			const theChosenOne = data[5].job_id;

			jobs.getSingle(theChosenOne, {}, (err, job, items) => {
				assert.equal(err, null);

				const cleansed = dCleanse(job, data[5]);
				const extracted = itemdata.filter(item => item.job_id === data[5].job_id)
																		.sort((a, b) => a.pdf_rank - b.pdf_rank)
																		.sort((a, b) =>
																			a.pdf_rank === b.pdf_rank ?
																				b.qty_req - a.qty_req :
																				a.pdf_rank - b.pdf_rank
																		);
				delete data[5].qty_items;

				assert.deepEqual(cleansed, data[5]);
				assert.deepEqual(items, extracted);
				done();
			});
		});
	});

	describe("#create", () => {
		it("#takes a callback", () => {
			assert.equal(jobs.create.length, 1);
		});

		it("#inserts a job into the db with the default values & unique id, returning the new job", done => {
			jobs.create((err, job) => {
				assert.equal(err, null);
				assert.deepEqual(data.filter(existing => existing.job_id === job.job_id), []);
				done();
			});
		});
	});

	// describe("#update", () => {
	// });

	// describe("#delete", () => {
	// });
});

