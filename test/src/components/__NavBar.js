"use strict";
import assert from "assert";
import { Link } from "react-router";
import React from "react/addons";
let { TestUtils } = React.addons;

import NavBar from "../../../src/js/components/common/NavBar";

describe("NavBar", () => {


	it("#should render the correct title", () => {
		const ShallowRenderer = TestUtils.createRenderer();
		ShallowRenderer.render(<NavBar title="testing" />);

		const renderedOutput = ShallowRenderer.getRenderOutput();

		const numTitleNodes = renderedOutput.props.children.filter(el => {
			return el && el.props && el.props.children === "testing";
		}).length;

		assert.equal(numTitleNodes, 1);
	});

	it("#should render links for each routeConfig object passed to it", () => {
		const routeConfig = [
			{ display: "highway", to: "hell" },
			{ display: "road", to: "the toilet" }
		];

		const ShallowRenderer = TestUtils.createRenderer();
		ShallowRenderer.render(<NavBar routeConfig={routeConfig}/>);

		const renderedOutput = ShallowRenderer.getRenderOutput();

		const linkNodes = renderedOutput.props.children.filter(el =>
			el && el.props && el.props.className === "nav nav-links"
		).pop().props.children[0];

		assert.equal(linkNodes.length, routeConfig.length);

		linkNodes.forEach((link, i) => {
			assert.equal(link.props.children.props.children, routeConfig[i].display);
			assert.equal(link.props.children.props.to, routeConfig[i].to);
			assert.deepEqual(link.props.children.type, Link);
		});
	});
});
