"use strict";

import assert from "assert";
import Router from "react-router";
import React from "react/addons";
let { TestUtils } = React.addons;

import NavBar from "../../../src/js/components/common/NavBar";

describe("NavBar", () => {

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
