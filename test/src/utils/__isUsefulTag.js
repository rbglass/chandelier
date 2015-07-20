"use strict";
import assert from "assert";
import isUsefulTag from "../../../src/js/utils/isUsefulTag";
import keyMirror from "react/lib/keyMirror";

describe("isUsefulTag", () => {
	it("#takes an anycase HTML tagName & returns whether it is useful or not", () => {
		const usefulTags = keyMirror({
			"SELECT": null,
			"select": null,
			"input": null,
			"textarea": null,
			"option": null,
			"button": null
		});

		const aFewUselessTags = keyMirror({
			"div": null,
			"form": null,
			"h1": null
		});

		Object.keys(usefulTags).forEach(tag => {
			assert(isUsefulTag(usefulTags[tag]));
		});

		Object.keys(aFewUselessTags).forEach(tag => {
			assert.equal(isUsefulTag(aFewUselessTags[tag]), false);
		});

	});
});
