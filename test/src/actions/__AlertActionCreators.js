"use strict";
import { dispyDouble } from "../helpers/doubles";
import * as AlertActionCreators from "../../../src/js/actions/AlertActionCreators";

describe("AlertActionCreators", () => {
	it(".receiveAlert dispatches an alert with ActionType RECEIVE_ALERT", () => {
		const alert = {hello: "hi"};

		const st = dispyDouble("RECEIVE_ALERT", alert);
		AlertActionCreators.receiveAlert(alert);
		st.restore();
	});
});
