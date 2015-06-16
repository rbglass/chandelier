"use strict";
import assert from "assert";
import yyyyMMdd, { isyyyyMMdd, ddMMyyyy, ddMMMyyyy } from "../../../src/js/utils/yyyyMMdd";

describe("isyyyyMMdd", () => {

	it("#checks if a string is a YYYY-MM-DD date", () => {
		assert(isyyyyMMdd("2015-01-01"));
		assert.equal(isyyyyMMdd("2015-0a-01"), false);
	});

	it("#doesn't care about the rest of the characters after DD", () => {
		assert(isyyyyMMdd("2015-02-01Y324"));
	});

	it("#returns false if a non-string argument is passed", () => {
		assert.equal(isyyyyMMdd(4444), false);
	});
});

describe("yyyyMMdd", () => {
	it("#returns null if a falsy argument is passed", () => {
		assert.equal(yyyyMMdd(""), null);
		assert.equal(yyyyMMdd(false), null);
		assert.equal(yyyyMMdd(null), null);
		assert.equal(yyyyMMdd(), null);
	});

	it("#returns only the YYYY-MM-DD portion of YYYY-MM-DDa435-esque strings", () => {
		assert.equal(yyyyMMdd("2015-01-01a435-esque"), "2015-01-01");
	});

	it("#tries to convert other inputs to ISO and then slices them", () => {
		const d = new Date(2015, 0, 5);
		assert.equal(yyyyMMdd(d), "2015-01-05");
	});

	it("#throws if non-falsy, non-YYYY-MM-DD, non-date inputs are given", () => {
		assert.throws(() => yyyyMMdd("chicken"));
	});
});

describe("ddMMyyyy", () => {
	it("#returns null if a falsy argument is passed", () => {
		assert.equal(ddMMyyyy(""), null);
		assert.equal(ddMMyyyy(false), null);
		assert.equal(ddMMyyyy(null), null);
		assert.equal(ddMMyyyy(), null);
	});

	it("#returns only the YYYY-MM-DD portion of YYYY-MM-DDa435-esque strings, in dd/MM/yyyy format", () => {
		assert.equal(ddMMyyyy("2015-01-01a435-esque"), "01/01/2015");
	});

	it("#tries to convert other inputs to ISO and then slices them", () => {
		const d = new Date(2015, 0, 5);
		assert.equal(ddMMyyyy(d), "05/01/2015");
	});

	it("#throws if non-falsy, non-YYYY-MM-DD, non-date inputs are given", () => {
		assert.throws(() => ddMMyyyy("chicken"));
	});
});

describe("ddMMMyyyy", () => {
	it("#returns null if a falsy argument is passed", () => {
		assert.equal(ddMMMyyyy(""), null);
		assert.equal(ddMMMyyyy(false), null);
		assert.equal(ddMMMyyyy(null), null);
		assert.equal(ddMMMyyyy(), null);
	});

	it("#returns only the YYYY-MM-DD portion of YYYY-MM-DDa435-esque strings, in dd MMM yyyy format", () => {
		assert.equal(ddMMMyyyy("2015-01-01a435-esque"), "01 Jan 2015");
	});

	it("#tries to convert other inputs to ISO and then slices them", () => {
		const d = new Date(2015, 0, 5);
		assert.equal(ddMMMyyyy(d), "05 Jan 2015");
	});

	it("#doesn't throw if non-falsy, non-YYYY-MM-DD, non-date inputs are given", () => {
		assert.doesNotThrow(() => ddMMMyyyy("chicken"));
	});
});
