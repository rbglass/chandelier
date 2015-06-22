"use strict";
import assert from "assert";
import React from "react/addons";
let { TestUtils } = React.addons;

import Preset from "../../../src/js/components/common/Preset";

describe("Preset", () => {
	let testValue1 = false;
	let testValue2 = false;

	const testSelect1 = () => {
		testValue1 = true;
	};

	const testSelect2 = () => {
		testValue2 = true;
	};

	const presetConfig = { description: "confirmed & <2 weeks shipping date", onSelect: [ testSelect1, testSelect2] };


	afterEach(done => {
		testValue1 = false;
		testValue2 = false;
		done();
	});

	it("#should render the description in the button", () => {

		const RenderedComponent = TestUtils.renderIntoDocument(
			<Preset description={presetConfig.description} onSelect={presetConfig.onSelect} />
		);

		const button = TestUtils.findRenderedDOMComponentWithTag(
			RenderedComponent,
			"button"
		);

		const buttonNode = React.findDOMNode(button);

		assert.equal(buttonNode.textContent, presetConfig.description);
	});

	it("#should render a button that, when clicked, calls each of its config callbacks", () => {

		const RenderedComponent = TestUtils.renderIntoDocument(
			<Preset description={presetConfig.description} onSelect={presetConfig.onSelect} />
		);

		const button = TestUtils.findRenderedDOMComponentWithTag(
			RenderedComponent,
			"button"
		);

		const buttonNode = React.findDOMNode(button);

		TestUtils.Simulate.click(buttonNode);

		assert.equal(testValue1, true);
		assert.deepEqual(testValue2, true);
	});
});
