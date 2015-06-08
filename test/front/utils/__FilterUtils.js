"use strict";
var assert = require("assert");
var rewire = require("rewire");
var FilterUtils = rewire("../../../src/js/utils/FilterUtils");

describe("strIncludes", function() {
	var strIncludes = FilterUtils.__get__("strIncludes");

	it("#takes 2 arguments", function() {
		assert.equal(strIncludes.length, 2);
	});

	it("#checks if a string includes a term", function() {
		assert(strIncludes("hello", "h"));
		assert.equal(strIncludes("hello", "z"), false);
	});

	it("#is case insensitive", function() {
		assert(strIncludes("hello", "H"));
		assert(strIncludes("Hello", "h"));
		assert(strIncludes("Hello", "H"));
	});

	it("#returns false if given a non-string term", function() {
		assert.equal(strIncludes("hi", true), false);
		assert.equal(strIncludes("hi", 3), false);
		assert.equal(strIncludes("hi", {}), false);
	});
});

describe("isDateStr", function() {
	var isDateStr = FilterUtils.__get__("isDateStr");

	it("#takes 1 argument", function() {
		assert.equal(isDateStr.length, 1);
	});

	it("#checks if a string is a YYYY-MM-DD date", function() {
		assert(isDateStr("2015-01-01"));
		assert.equal(isDateStr("2015-0a-01"), false);
		assert.equal(isDateStr(4444), false);
	});
});

describe("contains", function() {
	var contains = FilterUtils.contains;
	var testObj = {
			name: "james",
			age: 22,
			job: "dev",
			cool: true,
			thoughts: null
		};

	it("#takes 2 arguments", function() {
		assert.equal(contains.length, 2);
	});

	it("#returns true if no term/empty string is passed", function() {
		assert(contains({}));
		assert(contains({}, ""));
	});

	it("#checks if some value of an obj matches the term", function() {
		assert(contains(testObj, "james"));
		assert.equal(contains(testObj, "hello"), false);
	});

	it("#works for numbers", function() {
		assert(contains(testObj, 2));
		assert.equal(contains(testObj, 12), false);
	});

	it("#works for bools", function() {
		assert(contains(testObj, true));
		assert.equal(contains(testObj, false), false);
	});

	it("#doesn't work for complex data types (objects & arrays)", function() {
		var o = {
			"hello": "mate"
		};
		var n = [1, 2, 3];

		testObj.greet = o;
		testObj.count = n;

		assert.equal(contains(testObj, o), false);
		assert.equal(contains(testObj, n), false);
	});
});

describe("genericSort", function() {
	var genericSort = FilterUtils.genericSort;
	var arrToSort = [
		{ name: "Neats29", age: 3, DOB: "2012-06-08", hobbies: { name: "command line" }, cool: false },
		{ name: "mij",     age: 1, DOB: "2014-06-08", hobbies: { name: "scribble" },     cool: true  },
		{ name: "Roz",     age: 2, DOB: "2013-06-08", hobbies: { name: "fishing" },      cool: false }
	];

	var byName = [
		{ name: "Roz",     age: 2, DOB: "2013-06-08", hobbies: { name: "fishing" },      cool: false },
		{ name: "Neats29", age: 3, DOB: "2012-06-08", hobbies: { name: "command line" }, cool: false },
		{ name: "mij",     age: 1, DOB: "2014-06-08", hobbies: { name: "scribble" },     cool: true  }
	];

	var byAge = [
		{ name: "Neats29", age: 3, DOB: "2012-06-08", hobbies: { name: "command line" }, cool: false },
		{ name: "Roz",     age: 2, DOB: "2013-06-08", hobbies: { name: "fishing" },      cool: false },
		{ name: "mij",     age: 1, DOB: "2014-06-08", hobbies: { name: "scribble" },     cool: true  }
	];

	var byDOB = [
		{ name: "mij",     age: 1, DOB: "2014-06-08", hobbies: { name: "scribble" },     cool: true  },
		{ name: "Roz",     age: 2, DOB: "2013-06-08", hobbies: { name: "fishing" },      cool: false },
		{ name: "Neats29", age: 3, DOB: "2012-06-08", hobbies: { name: "command line" }, cool: false }
	];

	var byBool = [
		{ name: "mij",     age: 1, DOB: "2014-06-08", hobbies: { name: "scribble" },     cool: true  },
		{ name: "Neats29", age: 3, DOB: "2012-06-08", hobbies: { name: "command line" }, cool: false },
		{ name: "Roz",     age: 2, DOB: "2013-06-08", hobbies: { name: "fishing" },      cool: false }
	];

	var byHobbies = byAge;

	it("#takes up to 4 arguments", function() {
		assert.equal(genericSort.length, 4);
	});

	it("#sorts an array of objects (descending) by some term", function() {
		assert.notDeepEqual(genericSort(arrToSort, "name"), arrToSort);
	});

	it("#works for strings, caring not for case", function() {
		assert.deepEqual(genericSort(arrToSort, "name"), byName);
	});

	it("#works for numbers", function() {
		assert.deepEqual(genericSort(arrToSort, "age"), byAge);
	});

	it("#works for YYYY-MM-DD dates", function() {
		assert.deepEqual(genericSort(arrToSort, "DOB"), byDOB);
	});

	it("#works for bools", function() {
		assert.deepEqual(genericSort(arrToSort, "cool"), byBool);
	});

	it("#doesn't mutate the original array", function() {
		assert.deepEqual((function() {
			genericSort(arrToSort, "name");
			return arrToSort;
		}()), arrToSort);
	});

	it("#takes an optional ascending arg", function() {
		assert.deepEqual(genericSort(arrToSort, "age", true), byAge.slice(0).reverse());
	});

	it("#takes an optional single-level path to sort prop", function() {
		assert.deepEqual(genericSort(arrToSort, "name", true, "hobbies"), byHobbies);
	});
});

describe("isWithinBounds", function() {
	var isWithinBounds = FilterUtils.isWithinBounds;

	it("#takes 3 arguments", function() {
		assert.equal(isWithinBounds.length, 3);
	});

	it("#checks if a date field is within 2 bounds (inclusive)", function() {
		assert(isWithinBounds("2010-01-01", "2009-12-12", "2010-01-02"));
		assert.equal(isWithinBounds("2010-01-01", "2011-12-12", "2010-01-02"), false);
		assert.equal(isWithinBounds("2010-01-01", "2009-12-12", "2009-01-02"), false);
	});

	it("#returns true if both lower & upper are empty strings", function() {
		assert(isWithinBounds(null, "", ""));
		assert.equal(isWithinBounds(null, null, ""), false);
		assert.equal(isWithinBounds(null, "", null), false);
	});

	it("#defaults to lower: 1970, upper: 3070 for a respective falsy arg", function() {
		assert(isWithinBounds("1971-01-01", null, "1972-01-01"));
		assert.equal(isWithinBounds("1969-01-01", null, "1972-01-01"), false);
		assert(isWithinBounds("3069-01-01", "2000-01-01", null));
		assert.equal(isWithinBounds("3071-01-01", "2000-01-01", null), false);
	});

	it("#returns false if the specified field is not YYYY-MM-DD", function() {
		assert.equal(isWithinBounds("hello", "1066-01-01", "2899-01-01"), false);
	});
});

describe("restrictTo", function() {
	var restrictTo = FilterUtils.restrictTo;
	var o = {
		name: "james"
	};

	var ro = {
		name: {
			options: ["james", "robert", "tim"]
		},
		age: {
			options: [1]
		}
	};

	it("#takes 2 arguments", function() {
		assert.equal(restrictTo.length, 2);
	});

	it("#expects the object and restriction object to have the same field names", function() {

		assert.equal(restrictTo(o, ro), false);
	});

	it("#expects the restriction object to have an 'options' array/string prop on each field", function() {
		var willThrow = {
			name: "hi"
		};

		var willNotThrow = ro;

		assert.throws(function() { restrictTo(o, willThrow); });

		willThrow.name = { options: true };
		assert.throws(function() { restrictTo(o, willThrow); });

		willThrow.name = { options: {name: true} };
		assert.throws(function() { restrictTo(o, willThrow); });

		assert.doesNotThrow(function() { restrictTo(o, willNotThrow); });
	});

	it("#checks that a set of fields in an obj contain one of a set of restriction primitives", function() {
		o.age = 1;
		assert(restrictTo(o, ro));

		o.name = "robert";
		assert(restrictTo(o, ro));

		o.age = 2;
		assert.equal(restrictTo(o, ro), false);

		ro.DOB = "2015-01-12";
		assert.equal(restrictTo(o, ro), false);
	});

	it("#is case sensitive", function() {
		assert.equal(restrictTo({name: "JAMES"}, ro), false);
	});

});
