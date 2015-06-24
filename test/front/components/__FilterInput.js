"use strict";
import assert from "assert";
import React from "react/addons";
let { TestUtils }  = React.addons;

import FilterInput from "../../../src/js/components/filter/FilterInput";

describe("FilterInput", () => {

	let currentKey;

	const RenderedComponent = TestUtils.renderIntoDocument(
		<FilterInput type="text" value="hi" setFilter={key => { currentKey = key; }}
				className="testing" placeholder="..." />
	);

	const input = TestUtils.findRenderedDOMComponentWithTag(RenderedComponent, "input");
	const inputNode = React.findDOMNode(input);
	const button = TestUtils.findRenderedDOMComponentWithTag(RenderedComponent, "button");
	const buttonNode = React.findDOMNode(button);

	beforeEach(done => {
		currentKey = undefined;
		done();
	});

	it("#should render an input with specified type, value, class and placeholder", () => {

		assert.equal(inputNode.value, "hi");
		assert.equal(inputNode.getAttribute("type"), "text");
		assert.equal(inputNode.className, "testing");
		assert.equal(inputNode.tagName, "INPUT");
	});

	it("#should call setFilter with e.target.value on change", () => {
		assert.equal(currentKey, undefined);
		TestUtils.Simulate.change(inputNode, {target: {value: "h"}});
		assert.equal(currentKey, "h");
	});

	it("#should call setFilter with empty string if the clear button is clicked", () => {
		assert.equal(currentKey, undefined);
		TestUtils.Simulate.click(buttonNode);
		assert.equal(currentKey, "");
	});
});
