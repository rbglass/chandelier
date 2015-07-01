"use strict";
import assert from "assert";
import deleteQuery from "../../../api/lib/deleteQuery";

describe("#deleteQuery", () => {

	it("#takes a tablename, an id, and an idField", () => {
		assert.equal(deleteQuery.length, 3);
	});

	it("#returns a command string & data array based on the inputs", () => {
		const commandWeWant = "DELETE FROM test WHERE chicken=($1)";
		const dataWeWant = [3];

		const result = deleteQuery("test", 3, "chicken");
		assert.equal(result.command, commandWeWant);
		assert.deepEqual(result.data, dataWeWant);
	});

	it("#throws if an argument is missing or falsy", () => {
		assert.throws(() => deleteQuery(undefined, undefined));
		assert.throws(() => deleteQuery("timmy", undefined));
		assert.throws(() => deleteQuery(null, "timmy"));
		assert.throws(() => deleteQuery("timmy", "timmy"));
		assert.throws(() => deleteQuery("timmy", undefined, "timmy"));
	});
});
