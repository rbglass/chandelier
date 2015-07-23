"use strict";
import assert from "assert";
import render from "../../../api/utils/render";

describe("render", () => {
	it("replaces any of toRender's #{field}s found in the html with their corresponding value", () => {
		const html = "<helmet>To #{be} or not to #{be}, #{that} is the question</helmet>";
		const toRender = {
			be: "code",
			that: "where's my money"
		};
		const whatWeWant = "<helmet>To code or not to code, where's my money is the question</helmet>";

		const result = render(toRender, html);

		assert.equal(result, whatWeWant);
	});
});
