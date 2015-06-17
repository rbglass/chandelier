"use strict";
import { createStore } from "../utils/StoreUtils";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";

var pendingAction = null;

const ModalStore = createStore({
	getPendingAction() {
		return pendingAction;
	}
});

const onReceivingAction = action => {

	switch (action.type) {

		case ActionTypes.PENDING_ACTION:
				pendingAction = action.data;
				ModalStore.emitChange();
				break;
	}
};

export default ModalStore;

AppDispatcher.register(onReceivingAction);
