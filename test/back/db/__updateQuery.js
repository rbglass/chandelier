"use strict";
import assert from "assert";
import updateQuery from "../../../api/models/updateQuery";

describe("#updateQuery", () => {

	it("#takes a tablename, id, idField, and data object", () => {
		assert.equal(updateQuery.length, 4);
	});

	it("#returns an object with a 'command' string and a 'data' array", () => {
		const objWeGotBack = updateQuery("dog", 123, "woof", {name: "scruff"});

		assert.equal(typeof objWeGotBack, "object");
		assert.equal(typeof objWeGotBack.command, "string");
		assert(objWeGotBack.data instanceof Array);
	});

	it("#constructs a psql command string & argument array from the inputs 1", () => {
		const stringWeWant =
			"UPDATE jobs SET first=($2), second=($3) " +
			"WHERE test_id=($1) RETURNING *";

		const result =
			updateQuery("jobs", 123, "test_id", {first: "1", second: "2"});

		assert.equal(result.command, stringWeWant);
		assert.deepEqual(result.data, [123, "1", "2"]);
	});

	it("#constructs command string & argument array 2", () => {});
	it("#constructs command string & argument array 3", () => {});
	it("#throws if an argument is absent", () => {});
});
