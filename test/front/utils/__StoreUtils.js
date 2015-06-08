"use strict";
var assert = require("assert");
var EventEmitter = require("events").EventEmitter;
var StoreUtils = require("../../../src/js/utils/StoreUtils");

describe("createStore", function() {
	var createStore = StoreUtils.createStore;
	var testStore = createStore({});

	it("#takes 1 argument", function() {
		assert.equal(createStore.length, 1);
	});

	it("#returns an object with a addChangeListener(), removeChangeListener(), and emitChange()", function() {
		assert(testStore.addChangeListener);
		assert(testStore.removeChangeListener);
		assert(testStore.emitChange);
	});

	it("# addChangeListener takes a callback & subs to the store", function() {
		var called = false;

		testStore.addChangeListener(function() { called = true; });
		testStore.emitChange();
		assert(called);
	});

	it("#removeChangeListener takes a callback & unsubs from the store", function() {
		var called = 0;
		var listener = function() {
			called += 1;
		};

		testStore.addChangeListener(listener);
		testStore.emitChange();
		assert.equal(called, 1);

		testStore.removeChangeListener(listener);
		testStore.emitChange();
		assert.equal(called, 1);

		testStore.emitChange();
		assert.equal(called, 1);
	});

	it("#does not have EventEmitter in its prototype chain", function() {
		assert.equal(testStore instanceof EventEmitter, false);
	});

	it("#returns an object with our spec attached", function() {
		var testStore2 = createStore({
			name: "james"
		});

		assert.equal(testStore2.name, "james");
	});

	it("#autobinds store methods", function() {
		// not a great test
		var otherObj = {
			name: "don",
			getName: function() {
				return this.name;
			}
		};

		var testStore3 = createStore({
			name: "jimmy",
			getName: otherObj.getName
		});

		assert.equal(testStore3.getName(), "jimmy");
	});
});
