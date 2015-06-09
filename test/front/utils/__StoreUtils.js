"use strict";
import assert from "assert";
import { EventEmitter } from "events";
import * as StoreUtils from "../../../src/js/utils/StoreUtils";

describe("createStore", () => {
	const createStore = StoreUtils.createStore;
	const testStore = createStore({});

	it("#takes 1 argument", () => {
		assert.equal(createStore.length, 1);
	});

	it("#returns an object with a addChangeListener(), removeChangeListener(), and emitChange()", () => {
		assert(testStore.addChangeListener);
		assert(testStore.removeChangeListener);
		assert(testStore.emitChange);
	});

	it("# addChangeListener takes a callback & subs to the store", () => {
		let called = false;

		testStore.addChangeListener(() => { called = true; });
		testStore.emitChange();
		assert(called);
	});

	it("#removeChangeListener takes a callback & unsubs from the store", () => {
		let called = 0;
		const listener = () => {
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

	it("#does not have EventEmitter in its prototype chain", () => {
		assert.equal(testStore instanceof EventEmitter, false);
	});

	it("#returns an object with our spec attached", () => {
		const testStore2 = createStore({
			name: "james"
		});

		assert.equal(testStore2.name, "james");
	});

	it("#autobinds store methods", () => {
		// not a great test
		const otherObj = {
			name: "don",
			getName() {
				return this.name;
			}
		};

		const testStore3 = createStore({
			name: "jimmy",
			getName: otherObj.getName
		});

		assert.equal(testStore3.getName(), "jimmy");
	});
});
