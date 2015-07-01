"use strict";
import assert from "assert";
import tidy from "../../../src/js/utils/tidy";

describe("tidy", () => {
	it("#returns a same-length string", () => {
		const nonsense = "he_o";
		assert.equal(tidy(nonsense).length, 4);
	});

	it("#replaces all underscores with spaces", () => {
		const nonsense = "bork_bork_bork";
		assert.equal(tidy(nonsense).indexOf("_"), -1);
	});

	it("#jadencases a string", () => {
		const nonsense = "how can mirrors be real if our eyes aren't real?";
		assert.equal(tidy(nonsense), "How Can Mirrors Be Real If Our Eyes Aren't Real?");
	});

	it("#works with numerical strings", () => {
		const nope = "444abc_123";
		assert.equal(tidy(nope), "444abc 123");
	});

	it("#handles multiple underscores in a row", () => {
		const uhoh = "a____b";
		assert.throws(() => {
			return tidy(uhoh);
		}, Error);
	});

});
