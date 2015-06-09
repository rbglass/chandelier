"use strict";
import assert from "assert";
import jsdom from "jsdom";

global.document = jsdom.jsdom("<html><body></body></html>");
global.window = document.parentWindow;
global.navigator = {
	userAgent: "node.js"
};

import React from "react/addons";
let { TestUtils }  = React.addons;
import FilterInput from "../../../src/js/components/common/FilterInput";

describe("FilterInput", () => {

	after(done => {
		React.unmountComponentAtNode(document.body);
		document.body.innerHTML = "";
		setTimeout(done, 0);
	});

	let currentKey;

	const RenderedComponent = TestUtils.renderIntoDocument(
		<FilterInput type="text" filterBy="hi" setFilter={key => { currentKey = key; }}
				className="testing" placeholder="..." />
	);

	const input = TestUtils.findRenderedDOMComponentWithTag(RenderedComponent, "input");
	const inputNode = React.findDOMNode(input);

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
});
