"use strict";
import assert from "assert";
import flop from "../../../src/js/utils/flop";

describe("flop", () => {
	it("#takes a uniform array of objects, and a key string", () => {});
	it("#returns an array of values of those keys", () => {
		var arrOfObj = [{name: "tim"}, {name: "jim"}];
		assert.deepEqual(flop(arrOfObj, "name"), ["tim", "jim"]);
	});

	it("#ignores other values", () => {
		var arrOfObj = [{name: "tim", job: "cat"}, {name: "jim", age: "22"}];
		assert.deepEqual(flop(arrOfObj, "name"), ["tim", "jim"]);
	});
});
