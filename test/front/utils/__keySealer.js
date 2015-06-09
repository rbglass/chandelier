"use strict";
var assert = require("assert");
var keySealer = require("../../../src/js/utils/keySealer");

describe("keySealer", function() {

	it("#returns a function which takes 1 argument", function() {
		assert.equal(typeof keySealer(), "function");
		assert.equal(keySealer().length, 1);
	});

	it("#the function does some action on an obj with an id, key and value", function() {

		var dummyEvent1 = {
			target: {
				value: "one"
			}
		};

		var sealed = keySealer("hi", "nice", function(obj) {
			assert.equal(obj.id, "hi");
			assert.equal(obj.key, "nice");
			assert.equal(obj.value, "one");
		});

		sealed(dummyEvent1);
	});

	it("#tries to coerce e.target.value into a number", function() {
		var dummyEvent2 = {
			target: {
				value: "1"
			}
		};

		var sealed = keySealer("hi", "nice", function(obj) {
			assert.equal(obj.value, 1);
		});

		sealed(dummyEvent2);
	});
});
