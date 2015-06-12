"use strict";
import assert from "assert";

import * as JobAPIUtils from "../../../src/js/utils/JobAPIUtils";

describe("#turnErrorIntoAlert", () => {
	it("#takes a superagent err obj, returns a stripped obj", () => {
		const err = {
			status: 404,
			message: "hi"
		};

		const expectedAlert = {
			type: "error",
			message: 404,
			details: "hi"
		};

		assert.deepEqual(JobAPIUtils.turnErrorIntoAlert(err), expectedAlert);
	});
});
