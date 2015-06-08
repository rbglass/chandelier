"use strict";
var assert = require("assert");
var jsdom = require("jsdom");

global.document = jsdom.jsdom("<html><body></body></html>");
global.window = document.parentWindow;
global.navigator = {
	userAgent: "node.js"
};

describe("FilterInput", function() {
	var React = require("react");
	var TestUtils = require("react/addons").addons.TestUtils;
	var FilterInput = require("../../../src/js/components/common/FilterInput");
	var currentKey;

	var RenderedComponent = TestUtils.renderIntoDocument(
		<FilterInput type="text" filterBy="hi" setFilter={function(key) { currentKey = key; }}
				className="testing" placeholder="..." />
	);

	var input = TestUtils.findRenderedDOMComponentWithTag(RenderedComponent, "input");
	var inputNode = React.findDOMNode(input);

	it("#should render an input with specified type, value, class and placeholder", function() {

		assert.equal(inputNode.value, "hi");
		assert.equal(inputNode.getAttribute("type"), "text");
		assert.equal(inputNode.className, "testing");
		assert.equal(inputNode.tagName, "INPUT");
	});

	it("#should call setFilter with e.target.value on change", function() {
		assert.equal(currentKey, undefined);
		TestUtils.Simulate.change(inputNode, {target: {value: "h"}});
		assert.equal(currentKey, "h");
	});
});
