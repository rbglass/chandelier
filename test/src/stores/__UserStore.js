"use strict";
import I from "immutable";
import assert from "assert";
import rewire from "rewire";

describe("UserStore", () => {
	let UserStore, onReceivingAction;

	beforeEach(done => {
		UserStore = rewire("../../../src/js/stores/UserStore");
		onReceivingAction = UserStore.__get__("onReceivingAction");
		done();
	});


	it("#getProfile returns the current user's profile", () => {
		const profile = {
			name: "tim"
		};

		UserStore.__set__("profile", profile);

		assert.deepEqual(UserStore.getProfile(), profile);
	});

	it("#updates the user's profile upon a RECEIVE_USER_PROFILE action", () => {
		const profileAction = {
			type: "RECEIVE_USER_PROFILE",
			data: {
				name: "jim"
			}
		};

		onReceivingAction(profileAction);
		assert(I.is(UserStore.getProfile(), I.fromJS(profileAction.data)));
	});

});
