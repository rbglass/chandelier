"use strict";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../dispatchers/AppDispatcher";

export function receiveAlert(alert) {
	AppDispatcher.dispatch({
		type: ActionTypes.RECEIVE_ALERT,
		data: alert
	});
}
