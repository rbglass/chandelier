"use strict";
import assert from "assert";

import rbPrefixer from "../../../src/js/utils/rbPrefixer";

describe("rbPrefixer", () => {
	it("#prefixes the passed argument with RB", () => {
		const str = "LUE";
		const num = 12;
		assert.equal(rbPrefixer(str), "RBLUE");
		assert.equal(rbPrefixer(num), "RB12");
	});
});
