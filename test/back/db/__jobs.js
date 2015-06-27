"use strict";
import assert from "assert";
import assign from "object-assign";
import helpers, { coerceToNum } from "./helpers";

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


	describe("#getAll", () => {

		beforeEach(done => {
			itemdata = JSON.parse(JSON.stringify(require("./json/job_items.json")));
			data = JSON.parse(JSON.stringify(require("./json/jobs.json")));
			done();
		});

		it("#takes an options object and a callback", () => {
			assert.equal(jobs.getAll.length, 2);
		});

		it("#passes all jobs to the cb, sorted by opts-specified job_id descending", done => {
			const opts = {
				sortBy: "job_id",
				asc: "false"
			};


			jobs.getAll(opts, (err, rows) => {
				const cleansed = rows.map((e, i) => dCoerce(dCleanse(e, data[i])));
				const jobsWeWant = data.sort((a, b) => +b.job_id - +a.job_id);
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


			jobs.getAll(opts, (err, rows) => {
				const cleansed = rows.map((e, i) => dCoerce(dCleanse(e, data[i])));
				const jobsWeWant = data.sort((a, b) => +a.qty_items - +b.qty_items);

				assert.equal(err, null);
				assert.deepEqual(cleansed, jobsWeWant);
				done();
			});
		});

		it("#passes all jobs to the cb, sorted by default shipping_date ascending", done => {
			const opts = {};

			const jobsWeWant = data.sort((a, b) =>
				Date.parse(a.shipping_date) - Date.parse(b.shipping_date)
			);

			jobs.getAll(opts, (err, rows) => {
				const cleansed = rows.map((e, i) => dCoerce(dCleanse(e, data[i])));
				assert.equal(err, null);
				assert.deepEqual(cleansed, jobsWeWant);
				done();
			});
		});
	});

	describe("#getSingle", () => {

		beforeEach(done => {
			itemdata = JSON.parse(JSON.stringify(require("./json/job_items.json")));
			data = JSON.parse(JSON.stringify(require("./json/jobs.json")));
			done();
		});

		it("#takes an id, opts object and a callback", () => {
			assert.equal(jobs.getSingle.length, 3);
		});

		it("#passes a single job and its associated items to the cb, fixed sorting", done => {
			const theChosenOne = data[3];

			jobs.getSingle(theChosenOne.job_id, {}, (err, job, items) => {
				assert.equal(err, null);

				items = items.map(e => coerceToNum(["item_id", "pdf_rank"], e));
				const cleansed = dCoerce(dCleanse((job, theChosenOne)));
				const extracted = itemdata.filter(item => item.job_id === theChosenOne.job_id)
																		.sort((a, b) => a.pdf_rank - b.pdf_rank)
																		.sort((a, b) =>
																			a.pdf_rank === b.pdf_rank ?
																				b.qty_req - a.qty_req :
																				a.pdf_rank - b.pdf_rank
																		);
				delete theChosenOne.qty_items;


				assert.deepEqual(cleansed, theChosenOne);
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

	describe("#update", () => {

		it("#takes an id, data object and a callback", () => {
			assert.equal(jobs.update.length, 3);
		});

		it("#updates a job according to the data object, passing the updated obj to the cb", done => {
			const updateObj = {
				client: "Chicken King"
			};

			jobs.update(data[1].job_id, updateObj, (err, updated) => {
				assert.equal(err, null);
				assert.equal(updated.client, updateObj.client);
				done();
			});
		});

		it("#retains the previously joined qty_items field of the orig object", done => {
			const num = 24;
			const updateObj = {
				client_ref: "1101110111dog",
				qty_items: num
			};

			jobs.update(data[2].job_id, updateObj, (err, updated) => {
				assert.equal(err, null);
				assert.equal(updated.qty_items, num);
				done();
			});
		});

		it("#turns falsy shipping dates into null, for the db", done => {
			const updateObj = {
				shipping_date: ""
			};

			jobs.update(data[0].job_id, updateObj, (err, updated) => {
				assert.equal(err, null);
				assert.equal(updated.shipping_date, null);
				done();
			});
		});
	});
});

