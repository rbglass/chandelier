"use strict";
import assert from "assert";

import * as JobAPIUtils from "../../../src/js/utils/JobAPIUtils";

describe("#turnErrorIntoAlert", () => {
	it("#takes a superagent err obj, returns a stripped obj", () => {
		const err = {
			message: "hi",
			response: {
				text: "chicken"
			}
		};

		const expectedAlert = {
			type: "error",
			message: "hi",
			details: "chicken"
		};

		assert.deepEqual(JobAPIUtils.turnErrorIntoAlert(err), expectedAlert);
	});
});
