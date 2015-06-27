"use strict";
import assert from "assert";
import deleteQuery from "../../../api/models/deleteQuery";

describe("#deleteQuery", () => {

	it("#takes a tablename, and idField", () => {
		assert.equal(deleteQuery.length, 2);
	});

	it("#returns a command string based on the inputs", () => {
		const commandWeWant = "DELETE FROM test WHERE chicken=($1)";
		assert.equal(deleteQuery("test", "chicken"), commandWeWant);
	});

	it("#throws if either argument is missing", () => {
		assert.throws(() => deleteQuery());
		assert.throws(() => deleteQuery("timmy"));
		assert.throws(() => deleteQuery(null, "timmy"));
	});
});
