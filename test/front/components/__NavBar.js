"use strict";
var assert = require("assert");
var jsdom = require("jsdom");
var Router = require("react-router");

global.document = jsdom.jsdom("<html><body></body></html>");
global.window = document.parentWindow;
global.navigator = {
	userAgent: "node.js"
};

describe("NavBar", function() {
	var React = require("react");
	var TestUtils = require("react/addons").addons.TestUtils;
	var NavBar = require("../../../src/js/components/common/NavBar");

	var ShallowRenderer = TestUtils.createRenderer();
	ShallowRenderer.render(<NavBar title="testing" />);

	var renderedOutput = ShallowRenderer.getRenderOutput();


	it("#should render the correct title", function() {
		var numTitleNodes = renderedOutput.props.children.filter(function(el) {
			return el.props.children === "testing";
		}).length;

		assert.equal(renderedOutput.props.children.length, 3);
		assert.equal(numTitleNodes, 1);
	});

	it("#should render two links", function() {
		var numLinkNodes = renderedOutput.props.children.filter(function(el) {
			return el.props.children.type === Router.Link;
		}).length;

		assert.equal(numLinkNodes, 2);
	});
});
