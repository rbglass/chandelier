"use strict";
import jsdom from "jsdom";

global.document = jsdom.jsdom("<html><body></body></html>");
global.window = document.parentWindow;
global.navigator = {
	userAgent: "node.js"
};

import assert from "assert";
import Router from "react-router";
import React from "react/addons";
let { TestUtils } = React.addons;

import NavBar from "../../../src/js/components/common/NavBar";

describe("NavBar", () => {

	after(done => {
		React.unmountComponentAtNode(document.body);
		document.body.innerHTML = "";
		setTimeout(done, 0);
	});

	var ShallowRenderer = TestUtils.createRenderer();
	ShallowRenderer.render(<NavBar title="testing" />);

	var renderedOutput = ShallowRenderer.getRenderOutput();


	it("#should render the correct title", () => {
		var numTitleNodes = renderedOutput.props.children.filter(el => {
			return el.props.children === "testing";
		}).length;

		assert.equal(renderedOutput.props.children.length, 3);
		assert.equal(numTitleNodes, 1);
	});

	it("#should render two links", () => {
		var numLinkNodes = renderedOutput.props.children.filter(el => {
			return el.props.children.type === Router.Link;
		}).length;

		assert.equal(numLinkNodes, 2);
	});
});
