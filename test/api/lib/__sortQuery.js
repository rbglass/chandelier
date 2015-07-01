"use strict";
import assert from "assert";
import sortQuery from "../../../api/lib/sortQuery";

describe("sortQuery", () => {

	it("#takes a field and asc string", () => {
		assert.equal(sortQuery.length, 2);
	});

	it("#constructs a psql sorting string from the inputs", () => {
		const stringWeWant = "ORDER BY name DESC NULLS LAST";
		const q = sortQuery("name", "false");

		assert.equal(q, stringWeWant);
	});

	it("#sorts ascending or descending depending on the asc string", () => {
		const stringWeWant = "ORDER BY test ASC NULLS LAST";
		const otherstringWeWant = "ORDER BY test DESC NULLS LAST";
		const q1 = sortQuery("test", true);
		const q2 = sortQuery("test", "false");

		assert.equal(q1, stringWeWant);
		assert.equal(q2, otherstringWeWant);
	});

	it("#only sorts descending if asc === 'false' (string)", () => {
		const stringWeWant = "ORDER BY name ASC NULLS LAST";
		const q1 = sortQuery("name");
		const q2 = sortQuery("name", false);
		const q3 = sortQuery("name", null);
		const q4 = sortQuery("name", "");

		assert.equal(q1, stringWeWant);
		assert.equal(q2, stringWeWant);
		assert.equal(q3, stringWeWant);
		assert.equal(q4, stringWeWant);
	});

	it("#throws if no field is given", () => {
		assert.throws(() => sortQuery(undefined, "false"));
	});

	it("#doesn't leave a space at the end", () => {
		const q = sortQuery("name", "false");

		assert.notEqual(q[q.length - 1], " ");
	});

});
