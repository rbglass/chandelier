"use strict";
import assert from "assert";
import rewire from "rewire";

const FilterUtils = rewire("../../../src/js/utils/FilterUtils");

describe("strIncludes", () => {
	const strIncludes = FilterUtils.__get__("strIncludes");

	it("#takes 2 arguments", () => {
		assert.equal(strIncludes.length, 2);
	});

	it("#checks if a string includes a term", () => {
		assert(strIncludes("hello", "h"));
		assert.equal(strIncludes("hello", "z"), false);
	});

	it("#is case insensitive", () => {
		assert(strIncludes("hello", "H"));
		assert(strIncludes("Hello", "h"));
		assert(strIncludes("Hello", "H"));
	});

	it("#returns false if given a non-string term", () => {
		assert.equal(strIncludes("hi", true), false);
		assert.equal(strIncludes("hi", 3), false);
		assert.equal(strIncludes("hi", {}), false);
	});
});

describe("isDateStr", () => {
	const isDateStr = FilterUtils.__get__("isDateStr");

	it("#takes 1 argument", () => {
		assert.equal(isDateStr.length, 1);
	});

	it("#checks if a string is a YYYY-MM-DD date", () => {
		assert(isDateStr("2015-01-01"));
		assert.equal(isDateStr("2015-0a-01"), false);
		assert.equal(isDateStr(4444), false);
	});
});

describe("contains", () => {
	const contains = FilterUtils.contains;
	let testObj = {
			name: "james",
			age: 22,
			job: "dev",
			cool: true,
			thoughts: null
		};

	it("#takes 2 arguments", () => {
		assert.equal(contains.length, 2);
	});

	it("#returns true if no term/empty string is passed", () => {
		assert(contains({}));
		assert(contains({}, ""));
	});

	it("#checks if some value of an obj matches the term", () => {
		assert(contains(testObj, "james"));
		assert.equal(contains(testObj, "hello"), false);
	});

	it("#works for numbers", () => {
		assert(contains(testObj, 2));
		assert.equal(contains(testObj, 12), false);
	});

	it("#works for bools", () => {
		assert(contains(testObj, true));
		assert.equal(contains(testObj, false), false);
	});

	it("#doesn't work for complex data types (objects & arrays)", () => {
		const o = {
			"hello": "mate"
		};
		const n = [1, 2, 3];

		testObj.greet = o;
		testObj.count = n;

		assert.equal(contains(testObj, o), false);
		assert.equal(contains(testObj, n), false);
	});
});

describe("genericSort", () => {
	const genericSort = FilterUtils.genericSort;
	const arrToSort = [
		{ name: "Neats29", age: 3, DOB: "2012-06-08", hobbies: { name: "command line" }, cool: false },
		{ name: "mij",     age: 1, DOB: "2014-06-08", hobbies: { name: "scribble" },     cool: true  },
		{ name: "Roz",     age: 2, DOB: "2013-06-08", hobbies: { name: "fishing" },      cool: false }
	];

	const byName = [
		{ name: "Roz",     age: 2, DOB: "2013-06-08", hobbies: { name: "fishing" },      cool: false },
		{ name: "Neats29", age: 3, DOB: "2012-06-08", hobbies: { name: "command line" }, cool: false },
		{ name: "mij",     age: 1, DOB: "2014-06-08", hobbies: { name: "scribble" },     cool: true  }
	];

	const byAge = [
		{ name: "Neats29", age: 3, DOB: "2012-06-08", hobbies: { name: "command line" }, cool: false },
		{ name: "Roz",     age: 2, DOB: "2013-06-08", hobbies: { name: "fishing" },      cool: false },
		{ name: "mij",     age: 1, DOB: "2014-06-08", hobbies: { name: "scribble" },     cool: true  }
	];

	const byDOB = [
		{ name: "mij",     age: 1, DOB: "2014-06-08", hobbies: { name: "scribble" },     cool: true  },
		{ name: "Roz",     age: 2, DOB: "2013-06-08", hobbies: { name: "fishing" },      cool: false },
		{ name: "Neats29", age: 3, DOB: "2012-06-08", hobbies: { name: "command line" }, cool: false }
	];

	const byBool = [
		{ name: "mij",     age: 1, DOB: "2014-06-08", hobbies: { name: "scribble" },     cool: true  },
		{ name: "Neats29", age: 3, DOB: "2012-06-08", hobbies: { name: "command line" }, cool: false },
		{ name: "Roz",     age: 2, DOB: "2013-06-08", hobbies: { name: "fishing" },      cool: false }
	];

	const byHobbies = byAge;

	it("#takes up to 4 arguments", () => {
		assert.equal(genericSort.length, 4);
	});

	it("#sorts an array of objects (descending) by some term", () => {
		assert.notDeepEqual(genericSort(arrToSort, "name"), arrToSort);
	});

	it("#works for strings, caring not for case", () => {
		assert.deepEqual(genericSort(arrToSort, "name"), byName);
	});

	it("#works for numbers", () => {
		assert.deepEqual(genericSort(arrToSort, "age"), byAge);
	});

	it("#works for YYYY-MM-DD dates", () => {
		assert.deepEqual(genericSort(arrToSort, "DOB"), byDOB);
	});

	it("#works for bools", () => {
		assert.deepEqual(genericSort(arrToSort, "cool"), byBool);
	});

	it("#doesn't mutate the original array", () => {
		assert.deepEqual((() => {
			genericSort(arrToSort, "name");
			return arrToSort;
		}()), arrToSort);
	});

	it("#takes an optional ascending arg", () => {
		assert.deepEqual(genericSort(arrToSort, "age", true), byAge.slice(0).reverse());
	});

	it("#takes an optional single-level path to sort prop", () => {
		assert.deepEqual(genericSort(arrToSort, "name", true, "hobbies"), byHobbies);
	});
});

describe("isWithinBounds", () => {
	const isWithinBounds = FilterUtils.isWithinBounds;

	it("#takes 3 arguments", () => {
		assert.equal(isWithinBounds.length, 3);
	});

	it("#checks if a date field is within 2 bounds (inclusive)", () => {
		assert(isWithinBounds("2010-01-01", "2009-12-12", "2010-01-02"));
		assert.equal(isWithinBounds("2010-01-01", "2011-12-12", "2010-01-02"), false);
		assert.equal(isWithinBounds("2010-01-01", "2009-12-12", "2009-01-02"), false);
	});

	it("#returns true if both lower & upper are empty strings", () => {
		assert(isWithinBounds(null, "", ""));
		assert.equal(isWithinBounds(null, null, ""), false);
		assert.equal(isWithinBounds(null, "", null), false);
	});

	it("#defaults to lower: 1970, upper: 3070 for a respective falsy arg", () => {
		assert(isWithinBounds("1971-01-01", null, "1972-01-01"));
		assert.equal(isWithinBounds("1969-01-01", null, "1972-01-01"), false);
		assert(isWithinBounds("3069-01-01", "2000-01-01", null));
		assert.equal(isWithinBounds("3071-01-01", "2000-01-01", null), false);
	});

	it("#returns false if the specified field is not YYYY-MM-DD", () => {
		assert.equal(isWithinBounds("hello", "1066-01-01", "2899-01-01"), false);
	});
});

describe("restrictTo", () => {
	const restrictTo = FilterUtils.restrictTo;
	let o = {
		name: "james"
	};

	let ro = {
		name: {
			options: ["james", "robert", "tim"]
		},
		age: {
			options: [1]
		}
	};

	it("#takes 2 arguments", () => {
		assert.equal(restrictTo.length, 2);
	});

	it("#expects the object and restriction object to have the same field names", () => {

		assert.equal(restrictTo(o, ro), false);
	});

	it("#returns true if the restriction object has no 'options' array/string prop on a field", () => {
		let willThrow = {
			name: "hi"
		};

		let willNotThrow = ro;

		willThrow.name = { options: true };
		assert.throws(() => { restrictTo(o, willThrow); });

		willThrow.name = { options: {name: true} };
		assert.throws(() => { restrictTo(o, willThrow); });

		assert.doesNotThrow(() => { restrictTo(o, willNotThrow); });
	});

	it("#checks that a set of fields in an obj contain one of a set of restriction primitives", () => {
		o.age = 1;
		assert(restrictTo(o, ro));

		o.name = "robert";
		assert(restrictTo(o, ro));

		o.age = 2;
		assert.equal(restrictTo(o, ro), false);

		ro.DOB = "2015-01-12";
		assert.equal(restrictTo(o, ro), false);
	});

	it("#is case sensitive", () => {
		assert.equal(restrictTo({name: "JAMES"}, ro), false);
	});

});
