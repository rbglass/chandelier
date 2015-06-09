"use strict";
import assert from "assert";
import jsdom from "jsdom";

global.document = jsdom.jsdom("<html><body></body></html>");
global.window = document.parentWindow;
global.navigator = {
	userAgent: "node.js"
};

import React from "react/addons";
let { TestUtils } = React.addons;

import TableHeader from "../../../src/js/components/common/TableHeader";

describe("TableHeader", () => {

	const ShallowRenderer = TestUtils.createRenderer();

	const headers = [
		{ key: "say",   display: "display",   className: "im"     },
		{ key: "one",   display: "something", className: "pretty" },
		{ key: "thing", display: "else",      className: "classy" }
	];
	const filters = {
		sortTerm: "one",
		isAsc: false
	};

	let columns;

	it("#renders a set of headers based on a header scheme", () => {
		ShallowRenderer.render(<TableHeader headers={headers} filters={filters} />);
		const renderedOutput = ShallowRenderer.getRenderOutput();

		columns = renderedOutput.props.children;

		assert.equal(columns.length, 3);

		columns.forEach((column, i) => {
			assert.equal(column.props.children, headers[i].display);
			assert.notEqual(column.props.className.indexOf(headers[i].className), -1);

		});
	});

	it("#applies a className of 'asc' or 'desc' according to the filters prop", () => {
		ShallowRenderer.render(<TableHeader headers={headers} filters={filters} />);
		const renderedOutput = ShallowRenderer.getRenderOutput();

		columns = renderedOutput.props.children;

		let sortingColumn = columns.filter((column) => {
			return column.props.children === "something";
		})[0];

		assert.notEqual(sortingColumn.props.className.indexOf("desc"), -1);
	});

	it("#calls a sorting function when a column is clicked, with the respective 'key'", () => {
		let clickedColKey;

		const sortFunc = (key) => {
			clickedColKey = key;
		};

		const RenderedComponent = TestUtils.renderIntoDocument(
			<TableHeader headers={headers} filters={filters} sortFunc={sortFunc} />
		);

		const singleHeader = TestUtils.scryRenderedDOMComponentsWithClass(RenderedComponent, "table-row-item")[0];
		const headerNode = React.findDOMNode(singleHeader);
		const displayTerm = singleHeader.props.children;
		const singleHeaderKey = headers.filter(e => e.display === displayTerm)[0].key;

		assert.equal(clickedColKey, undefined);
		TestUtils.Simulate.click(headerNode);
		assert.equal(clickedColKey, singleHeaderKey);
	});

});
