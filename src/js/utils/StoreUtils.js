"use strict";
import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

export function createStore(spec) {
	const emitter = new EventEmitter();
	emitter.setMaxListeners(0);

	const store = Object.assign({
		emitChange() {
			emitter.emit(CHANGE_EVENT);
		},

		addChangeListener(callback) {
			emitter.on(CHANGE_EVENT, callback);
		},

		removeChangeListener(callback) {
			emitter.removeListener(CHANGE_EVENT, callback);
		}
	}, spec);

	// Auto-bind store methods for convenience
	Object.keys(store).forEach((e, i) => {
		if (typeof store[e] === "function") {
			store[e] = store[e].bind(store);
		}
	});

	return store;
}
