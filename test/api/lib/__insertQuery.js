"use strict";
import assert from "assert";
import insertQuery from "../../../api/lib/insertQuery";

describe("#insertQuery", () => {

	it("#takes a tablename and data object", () => {
		assert.equal(insertQuery.length, 2);
	});

	it("#returns a command string  & data array based on the inputs", () => {
		const data = {
			job_id: 2213,
			product: "Mug Of Tea Plz",
			description: "mmm",
			glass: "bottle",
			qty_req: 15,
			notes: "hi m8"
		};

		const dataWeWant = Object.keys(data).map(e => data[e]);
		const commandWeWant = "INSERT INTO job_items (job_id, product, description, " +
														"glass, qty_req, notes) values " +
														"($1, $2, $3, $4, $5, $6) RETURNING *";

		const result = insertQuery("job_items", data);
		assert.equal(result.command, commandWeWant);
		assert.deepEqual(result.data, dataWeWant);
	});

	it("#returns a default insertion string & empty data array if no/empty data input is passed", () => {

		const commandWeWant = "INSERT INTO job_items DEFAULT VALUES RETURNING *";

		const result = insertQuery("job_items");
		assert.equal(result.command, commandWeWant);
		assert.deepEqual(result.data, []);

		const result2 = insertQuery("job_items", {});
		assert.equal(result.command, commandWeWant);
		assert.deepEqual(result.data, []);
	});

	it("#throws if the table argument is missing", () => {
		assert.throws(() => insertQuery());
		assert.doesNotThrow(() => insertQuery("timmy"));
	});
});
