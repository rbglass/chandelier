"use strict";
import assert from "assert";
import React from "react/addons";
let { TestUtils }  = React.addons;

import PaginationInfo from "../../../src/js/components/filter/PaginationInfo";

describe("PaginationInfo", () => {
	const numberOfRows = 20;

	const RenderedComponent = TestUtils.renderIntoDocument(
		<PaginationInfo numberOfRows={20}/>
	);

	const div = TestUtils.findRenderedDOMComponentWithTag(RenderedComponent, "div");
	const divNode = React.findDOMNode(div);


	it("#should render a div with the number of rows", () => {
		assert.equal(div.props.children.includes(`${numberOfRows}`), true);
	});
});
