"use strict";
import assert from "assert";
import React from "react/addons";
let { TestUtils }  = React.addons;

import PaginationInfo from "../../../src/js/components/filter/PaginationInfo";

describe("PaginationInfo", () => {
	let result;

	const numberOfRows = 20;
	const rowsPerPage = 10;
	const setRowsPerPage = val => {
		result = val;
	};

	const RenderedComponent = TestUtils.renderIntoDocument(
		<PaginationInfo numberOfRows={20} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage}/>
	);

	const select = TestUtils.findRenderedDOMComponentWithTag(RenderedComponent, "select");
	const selectNode = React.findDOMNode(select);

	beforeEach(done => {
		result = undefined;
		done();
	});

	it("#should render a select with options for 50, 100, 250 and All", () => {
		const vals = [50, 100, 250, "All"];

		assert.equal(selectNode.tagName, "SELECT");
		assert.equal(select.props.children.length, 4);

		select.props.children.forEach((kid, i) => {
			assert.equal(kid.type, "option");
			assert.equal(kid.props.children, vals[i]);
		});
	});

	it("#should call setRowsPerPage with e.target.value coerced to number on change", () => {
		assert.equal(result, undefined);
		TestUtils.Simulate.change(selectNode, {target: {value: 30}});
		assert.equal(result, 30);
	});

	it("#should call setRowsPerPage with infinity if coercion fails", () => {
		assert.equal(result, undefined);
		TestUtils.Simulate.change(selectNode, {target: {value: NaN }});
		assert.equal(result, Infinity);
	});
});
