"use strict";
import I from "immutable";
import assert from "assert";
import rewire from "rewire";
import { sameVal } from "../setup/utils";

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

describe("contains", () => {
	const contains = FilterUtils.contains;
	let testObj = I.Map({
			name: "james",
			age: 22,
			job: "dev",
			cool: true,
			thoughts: null
		});

	it("#takes 2 arguments", () => {
		assert.equal(contains.length, 2);
	});

	it("#returns true if no term/empty string is passed", () => {
		assert(contains(I.Map({})));
		assert(contains(I.Map({}), ""));
	});

	it("#checks if some value of a Map matches the term", () => {
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

		testObj = testObj.set("greet", o);
		testObj = testObj.set("count", n);

		assert.equal(contains(testObj, o), false);
		assert.equal(contains(testObj, n), false);
	});
});

describe("genericSort", () => {
	const genericSort = FilterUtils.genericSort;
	const arrToSort = I.fromJS([
		{ name: "Neats29", age: 3, DOB: "2012-06-08", hobbies: { name: "command line" }, cool: false },
		{ name: "mij",     age: 1, DOB: "2014-06-08", hobbies: { name: "scribble" },     cool: true  },
		{ name: "Roz",     age: 2, DOB: "2013-06-08", hobbies: { name: "fishing" },      cool: false }
	]);

	const byName = I.fromJS([
		{ name: "Roz",     age: 2, DOB: "2013-06-08", hobbies: { name: "fishing" },      cool: false },
		{ name: "Neats29", age: 3, DOB: "2012-06-08", hobbies: { name: "command line" }, cool: false },
		{ name: "mij",     age: 1, DOB: "2014-06-08", hobbies: { name: "scribble" },     cool: true  }
	]);

	const byAge = I.fromJS([
		{ name: "Neats29", age: 3, DOB: "2012-06-08", hobbies: { name: "command line" }, cool: false },
		{ name: "Roz",     age: 2, DOB: "2013-06-08", hobbies: { name: "fishing" },      cool: false },
		{ name: "mij",     age: 1, DOB: "2014-06-08", hobbies: { name: "scribble" },     cool: true  }
	]);

	const byDOB = I.fromJS([
		{ name: "mij",     age: 1, DOB: "2014-06-08", hobbies: { name: "scribble" },     cool: true  },
		{ name: "Roz",     age: 2, DOB: "2013-06-08", hobbies: { name: "fishing" },      cool: false },
		{ name: "Neats29", age: 3, DOB: "2012-06-08", hobbies: { name: "command line" }, cool: false }
	]);

	const byBool = I.fromJS([
		{ name: "mij",     age: 1, DOB: "2014-06-08", hobbies: { name: "scribble" },     cool: true  },
		{ name: "Neats29", age: 3, DOB: "2012-06-08", hobbies: { name: "command line" }, cool: false },
		{ name: "Roz",     age: 2, DOB: "2013-06-08", hobbies: { name: "fishing" },      cool: false }
	]);

	const byHobbies = byAge;

	it("#takes up to 4 arguments", () => {
		assert.equal(genericSort.length, 4);
	});

	it("#sorts an array of objects (descending) by some term", () => {
		assert(!I.is(genericSort(arrToSort, "name"), arrToSort));
	});

	it("#works for strings, caring not for case", () => {
		sameVal(genericSort(arrToSort, "name"), byName);
	});

	it("#works for numbers", () => {
		sameVal(genericSort(arrToSort, "age"), byAge);
	});

	it("#works for YYYY-MM-DD dates", () => {
		sameVal(genericSort(arrToSort, "DOB"), byDOB);
	});

	it("#works for bools", () => {
		sameVal(genericSort(arrToSort, "cool"), byBool);
	});

	it("#takes an optional ascending arg", () => {
		sameVal(genericSort(arrToSort, "age", true), byAge.reverse());
	});

	it("#takes an optional single-level path to sort prop", () => {
		sameVal(genericSort(arrToSort, "name", true, "hobbies"), byHobbies);
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

describe("satisfies", () => {
	const satisfies = FilterUtils.satisfies;
	let o = I.fromJS({
		name: "james"
	});

	let ro = I.fromJS({
		name: {
			options: ["james", "robert", "tim"]
		},
		age: {
			options: [1]
		}
	});

	it("#takes 2 arguments", () => {
		assert.equal(satisfies.length, 2);
	});

	it("#expects the Map and restriction Map to have the same field names", () => {

		assert.equal(satisfies(o, ro), false);
	});

	it("#returns true if the restriction Map has no 'options' List prop on a field", () => {
		let willThrow = I.fromJS({
			name: {
				options: true
			}
		});

		let willNotThrow = ro;

		assert.throws(() => satisfies(o, willThrow));

		let optionsNotAList = willThrow.set("name", I.fromJS({ options: {name: true} }));
		assert.equal(satisfies(o, optionsNotAList), false);

		assert.doesNotThrow(() => { satisfies(o, willNotThrow); });
	});

	it("#checks that a set of fields in an obj contain one of a set of restriction primitives", () => {
		o = o.set("age", 1);
		assert(satisfies(o, ro));

		o = o.set("name", "robert");
		assert(satisfies(o, ro));

		o = o.set("age", 2);
		assert.equal(satisfies(o, ro), false);

		ro = ro.set("DOB", "2015-01-12");
		assert.equal(satisfies(o, ro), false);
	});

	it("#is case sensitive", () => {
		assert.equal(satisfies(I.Map({name: "JAMES"}), ro), false);
	});

});
