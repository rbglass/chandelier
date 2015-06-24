"use strict";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";

// TODO modify this so it uses compose
export function modifyPendingAction(type, pendingAction, ...args) {
	AppDispatcher.dispatch({
		type: ActionTypes.PENDING_ACTION,
		data: {
			type: type,
			action: pendingAction.bind(null, args[0], args[1])
		}
	});
}

export function clearPendingAction() {
	AppDispatcher.dispatch({
		type: ActionTypes.PENDING_ACTION,
		data: null
	});
}

export function executePendingAction(pendingAction) {
	pendingAction();
	clearPendingAction();
}
