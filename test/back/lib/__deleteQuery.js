"use strict";
import assert from "assert";
import deleteQuery from "../../../api/lib/deleteQuery";

describe("#deleteQuery", () => {

	it("#takes a tablename, and idField", () => {
		assert.equal(deleteQuery.length, 2);
	});

	it("#returns a command string based on the inputs", () => {
		const commandWeWant = "DELETE FROM test WHERE chicken=($1)";
		assert.equal(deleteQuery("test", "chicken"), commandWeWant);
	});

	it("#throws if either argument is missing or falsy", () => {
		assert.throws(() => deleteQuery(undefined, undefined));
		assert.throws(() => deleteQuery("timmy", undefined));
		assert.throws(() => deleteQuery(null, "timmy"));
	});
});
