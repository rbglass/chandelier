"use strict";
var assert = require("assert");
var tidy = require("../../../src/js/utils/tidy");

describe("tidy", function() {
	it("#returns a same-length string", function() {
		var nonsense = "he_o";
		assert.equal(tidy(nonsense).length, 4);
	});

	it("#replaces all underscores with spaces", function() {
		var nonsense = "bork_bork_bork";
		assert.equal(tidy(nonsense).indexOf("_"), -1);
	});

	it("#jadencases a string", function() {
		var nonsense = "how can mirrors be real if our eyes aren't real?";
		assert.equal(tidy(nonsense), "How Can Mirrors Be Real If Our Eyes Aren't Real?");
	});

	it("#works with numerical strings", function() {
		var nope = "444abc_123";
		assert.equal(tidy(nope), "444abc 123");
	});

	it("#handles multiple underscores in a row", function() {
		var uhoh = "a____b";
		assert.throws(function() {
			return tidy(uhoh);
		}, Error);
	});

});
