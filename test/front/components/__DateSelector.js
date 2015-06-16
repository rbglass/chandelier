"use strict";
import assert from "assert";
import React from "react/addons";
let { TestUtils }  = React.addons;

import DateSelector from "../../../src/js/components/common/DateSelector";

describe("DateSelector", () => {
	let ting = null;
	let ting2 = null;

	afterEach(done => {
		ting = null;
		done();
	});

	const onChange = val => {
		ting = val;
	};

	const propagatedOnChange = val => {
		console.log("hi");
		ting2 = val;
	};

	const RenderedComponent = TestUtils.renderIntoDocument(
		<div onChange={propagatedOnChange} >
			<DateSelector value={"2015-01-05"} onChange={onChange}/>
		</div>
	);

	const input = TestUtils.findRenderedDOMComponentWithTag(
		RenderedComponent,
		"input"
	);
	const display = TestUtils.findRenderedDOMComponentWithClass(
		RenderedComponent,
		"date-selector-display"
	);

	const inputNode = React.findDOMNode(input);
	const displayNode = React.findDOMNode(display);

	it("#Should render an input with the value the same as what we give it", () => {
		assert(inputNode);
	});

	it("#Should display the date according to some format we specify", () => {
		assert.equal(displayNode.textContent, "05 Jan 2015");
	});

});
