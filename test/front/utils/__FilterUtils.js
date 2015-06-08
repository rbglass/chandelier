"use strict";
var assert = require("assert");
var rewire = require("rewire");
var FilterUtils = rewire("../../../src/js/utils/FilterUtils");

describe("strIncludes", function() {
	var strIncludes = FilterUtils.__get__("strIncludes");

	it("#checks if a string includes a term", function() {

		assert(strIncludes("hello", "h"));
		assert.equal(strIncludes("hello", "z"), false);
	});

	it("#is case insensitive", function() {
		assert(strIncludes("hello", "H"));
		assert(strIncludes("Hello", "h"));
		assert(strIncludes("Hello", "H"));
	});
});

describe("isDateStr", function() {
	var isDateStr = FilterUtils.__get__("isDateStr");

	it("#checks if a string is a YYYY-MM-DD date", function() {
		assert(isDateStr("2015-01-01"));
		assert.equal(isDateStr("2015-0a-01"), false);
		assert.equal(isDateStr(4444), false);
	});
});
