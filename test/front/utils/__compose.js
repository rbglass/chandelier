"use strict";
import assert from "assert";
import compose from "../../../src/js/utils/compose";

describe("compose", () => {
	function add(arr) {
		return arr.reduce(function(a, b) {
			return a + b;
		}, 0);
	}

	function add3(n) {
		return n + 3;
	}

	function multiplyByTwo(n) {
		return n * 2;
	}

	function numToString(n) {
		return "" + n;
	}

	const result = compose(add, add3, multiplyByTwo, numToString);

	it("#returns a composed function", () => {
		assert.equal("function", typeof result);
	});

	it("#composes in the correct order", () => {
		assert.equal("16", result([2, 3]));
	});
});
