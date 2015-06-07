"use strict";
var assert = require("assert");
var compose = require("../../../src/js/utils/compose");

describe("compose", function() {
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

	var result = compose(add, add3, multiplyByTwo, numToString);

	it("#returns a composed function", function() {
		assert.equal("function", typeof result);
	});

	it("#composes in the correct order", function() {
		assert.equal("16", result([2, 3]));
	});
});
