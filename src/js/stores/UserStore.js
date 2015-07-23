"use strict";
import I from "immutable";
import { createStore } from "../utils/StoreUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";

var profile = I.Map();

const UserStore = createStore({
	getProfile() {
		return profile;
	}
});

const onReceivingAction = action => {

	if (action.type === ActionTypes.RECEIVE_USER_PROFILE) {
		profile = I.fromJS(action.data);
		UserStore.emitChange();
	}
};

export default UserStore;
