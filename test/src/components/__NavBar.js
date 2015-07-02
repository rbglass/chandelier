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

	it("#should render children in a nav nav-item div", () => {

		const ShallowRenderer = TestUtils.createRenderer();
		ShallowRenderer.render(
			<NavBar>
				<button className="test1" />
			</NavBar>
		);

		const renderedOutput = ShallowRenderer.getRenderOutput();

		const kid1 = renderedOutput.props.children.filter(el =>
			el && el.props && el.props.className === "nav nav-item"
		).pop().props.children;

		assert.equal(kid1.props.className, "test1");

		ShallowRenderer.render(
			<NavBar>
				<button className="test1" />
				<button className="test2" />
			</NavBar>
		);

		const renderedOutput2 = ShallowRenderer.getRenderOutput();

		const kids = renderedOutput2.props.children.filter(el =>
			el instanceof Array
		).pop();

		assert.equal(kids.length, 2);

		kids.forEach((kid, i) => {
			assert.equal(kid.props.className, "nav nav-item");
			assert.equal(kid.props.children.props.className, `test${i + 1}`);
		});

	});
});
