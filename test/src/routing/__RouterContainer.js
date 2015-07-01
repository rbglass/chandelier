"use strict";
import assert from "assert";
import * as RouterContainer from "../../../src/js/routing/RouterContainer";

describe("RouterContainer", () => {

	it(".set sets the router to the input, and get returns it", () => {
		const brandNewRouter = {
			routing: "to tooting"
		};

		RouterContainer.set(brandNewRouter);

		assert.deepEqual(RouterContainer.get(), brandNewRouter);
	});
});
