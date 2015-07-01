"use strict";
import assert from "assert";
import keySealer from "../../../src/js/utils/keySealer";

describe("keySealer", () =>  {

	it("#returns a function which takes 1 argument", () =>  {
		assert.equal(typeof keySealer(), "function");
		assert.equal(keySealer().length, 1);
	});

	it("#the function does some action on an obj with an id, key and value", () =>  {

		const dummyEvent1 = {
			target: {
				value: "one"
			}
		};

		const sealed = keySealer("hi", "nice", (obj) => {
			assert.equal(obj.id, "hi");
			assert.equal(obj.key, "nice");
			assert.equal(obj.value, "one");
		});

		sealed(dummyEvent1);
	});

	it("#tries to coerce e.target.value into a number if isNum arg is true", () =>  {
		const dummyEvent2 = {
			target: {
				value: "1"
			}
		};

		const sealed = keySealer("hi", "nice", (obj) => {
			assert.equal(obj.value, 1);
		}, true);

		sealed(dummyEvent2);
	});

	it("#uses e.target.checked instead if isBool arg is true", () =>  {
		const dummyEvent1 = {
			target: {
				value: "true"
			}
		};

		const dummyEvent2 = {
			target: {
				checked: true
			}
		};

		const sealed = keySealer("hi", "nice", (obj) => {
			assert.equal(obj.value, undefined);
		}, null, true);

		const sealed2 = keySealer("hi", "nice", (obj) => {
			assert.equal(obj.value, true);
		}, null, true);

		sealed(dummyEvent1);
		sealed2(dummyEvent2);
	});
});
