"use strict";
import assert from "assert";
import assign from "object-assign";
import helpers, { coerceToNum } from "../helpers/helpers";

import jobs from "../../../api/models/jobs";

describe("jobs", () => {
	const datesWeDontWant = ["updatedat", "shipping_date", "createdat"];
	const thingsWeWantAsNum = ["job_id", "qty_items"];
	let data, itemdata;

	before(done => helpers.start("jobs", helpers.job_items.bind(null, done)));
	after(done => helpers.drop(done));


	function cleanseOfDates(dates, ...rows) {
		dates.forEach(datefield => {
			rows.forEach(row => row ? delete row[datefield] : null);
		});
		return rows[0];
	}

	const dCleanse = cleanseOfDates.bind(null, datesWeDontWant);
	const dCoerce = coerceToNum.bind(null, thingsWeWantAsNum);


	describe(".getAll", () => {

		beforeEach(done => {
			itemdata = JSON.parse(JSON.stringify(require("./json/job_items.json")));
			data = JSON.parse(JSON.stringify(require("./json/jobs.json")));
			done();
		});

		it("#takes an options object and a callback", () => {
			assert.equal(jobs.getAll.length, 2);
		});

		it("#passes all jobs to the cb, sorted by opts-specified job_id descending, formatted", done => {
			const opts = {
				sortBy: "job_id",
				asc: "false"
			};


			jobs.getAll(opts, (err, rows) => {
				const cleansed = rows.map((e, i) => dCoerce(dCleanse(e.details, data[i])));
				const jobsWeWant = data.sort((a, b) => +b.job_id - +a.job_id);
				assert.equal(err, null);
				assert.deepEqual(cleansed, jobsWeWant);
				done();
			});
		});

		it("#passes all jobs to the cb, sorted by opts-specified joined qty_items ascending, formatted", done => {
			const opts = {
				sortBy: "qty_items",
				asc: "anything"
			};


			jobs.getAll(opts, (err, rows) => {
				const cleansed = rows.map((e, i) => dCoerce(dCleanse(e.details, data[i])));
				const jobsWeWant = data.sort((a, b) => +a.qty_items - +b.qty_items);

				assert.equal(err, null);
				assert.deepEqual(cleansed, jobsWeWant);
				done();
			});
		});

		it("#passes all jobs to the cb, sorted by default shipping_date ascending, formatted", done => {
			const opts = {};

			const jobsWeWant = data.sort((a, b) =>
				Date.parse(a.shipping_date) - Date.parse(b.shipping_date)
			);

			jobs.getAll(opts, (err, rows) => {
				const cleansed = rows.map((e, i) => dCoerce(dCleanse(e.details, data[i])));
				assert.equal(err, null);
				assert.deepEqual(cleansed, jobsWeWant);
				done();
			});
		});
	});

	describe(".getSingle", () => {

		beforeEach(done => {
			itemdata = JSON.parse(JSON.stringify(require("./json/job_items.json")));
			data = JSON.parse(JSON.stringify(require("./json/jobs.json")));
			done();
		});

		it("#takes an id, opts object and a callback", () => {
			assert.equal(jobs.getSingle.length, 3);
		});

		it("#passes a single job and its associated items to the cb, fixed sorting, formatted", done => {
			const theChosenOne = data[3];

			jobs.getSingle(theChosenOne.job_id, {}, (err, jobWithItems) => {
				assert.equal(err, null);
				jobWithItems.items = jobWithItems.items.map(e => coerceToNum(["item_id", "pdf_rank"], e));
				const cleansed = dCoerce(dCleanse((jobWithItems.details, theChosenOne)));
				const extracted = itemdata.filter(item => item.job_id === theChosenOne.job_id)
																		.sort((a, b) => a.pdf_rank - b.pdf_rank)
																		.sort((a, b) =>
																			a.pdf_rank === b.pdf_rank ?
																				b.qty_req - a.qty_req :
																				a.pdf_rank - b.pdf_rank
																		);
				delete theChosenOne.qty_items;


				assert.deepEqual(cleansed, theChosenOne);
				assert.deepEqual(jobWithItems.items, extracted);
				done();
			});
		});
	});
});

