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

	it("#tries to coerce e.target.value into a number", () =>  {
		const dummyEvent2 = {
			target: {
				value: "1"
			}
		};

		const sealed = keySealer("hi", "nice", (obj) => {
			assert.equal(obj.value, 1);
		});

		sealed(dummyEvent2);
	});
});
