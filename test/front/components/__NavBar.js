"use strict";
import assert from "assert";
import { Link } from "react-router";
import React from "react/addons";
let { TestUtils } = React.addons;

import NavBar from "../../../src/js/components/common/NavBar";

describe("NavBar", () => {


	it("#should render the correct title", () => {
		const ShallowRenderer = TestUtils.createRenderer();
		ShallowRenderer.render(<NavBar title="testing" routeConfig={[]} />);

		const renderedOutput = ShallowRenderer.getRenderOutput();

		const numTitleNodes = renderedOutput.props.children.filter(el => {
			return el.props && el.props.children === "testing";
		}).length;

		assert.equal(numTitleNodes, 1);
	});

	it("#should render one logout link by default", () => {
		const ShallowRenderer = TestUtils.createRenderer();
		ShallowRenderer.render(<NavBar title="testing" routeConfig={[]} />);

		const renderedOutput = ShallowRenderer.getRenderOutput();

		const linkNode = renderedOutput.props.children.filter(el => {
			return el.props && el.props.children && el.props.children.type === "a";
		})[0];

		assert(linkNode);
		assert.equal(linkNode.props.children.props.children, "Logout");
	});

	it("#should render links for each routeConfig object passed to it", () => {
		const routeConfig = [
			{ display: "highway", to: "hell" },
			{ display: "road", to: "the toilet" }
		];

		const ShallowRenderer = TestUtils.createRenderer();
		ShallowRenderer.render(<NavBar title="toasting" routeConfig={routeConfig}/>);

		const renderedOutput = ShallowRenderer.getRenderOutput();

		const linkNodes = renderedOutput.props.children.filter(el => {
			return Array.isArray(el);
		}).reduce((a, b) => a.concat(b), [])
			.map(div => div.props.children);

		assert.equal(linkNodes.length, routeConfig.length);

		linkNodes.forEach((link, i) => {
			assert.equal(link.props.children, routeConfig[i].display);
			assert.equal(link.props.to, routeConfig[i].to);
			assert.deepEqual(link.type, Link);
		});
	});
});
