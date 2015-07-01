"use strict";
import I from "immutable";
import assert from "assert";
import React from "react/addons";
let { TestUtils } = React.addons;

import TableHeader from "../../../src/js/components/table/TableHeader";

describe("TableHeader", () => {

	const ShallowRenderer = TestUtils.createRenderer();

	const headers = [
		{ key: "say",   display: "display",   className: "im"     },
		{ key: "one",   display: "something", className: "pretty" },
		{ key: "thing", display: "else",      className: "classy" }
	];
	const filters = I.Map({
		sortTerm: "one",
		isAsc: false
	});

	let columns;
	// cba with this dry testing, too implementation-tied
	// it("#renders a set of headers based on a header scheme", () => {
	// 	ShallowRenderer.render(<TableHeader headers={headers} filters={filters} />);
	// 	const renderedOutput = ShallowRenderer.getRenderOutput();

	// 	columns = renderedOutput.props.children;

	// 	assert.equal(columns.length, 3);

	// 	columns.forEach((column, i) => {
	// 		console.log(column.props.children[0].props)
	// 		assert.equal(column.props.children[0].props.className, headers[i].display);
	// 		assert.notEqual(column.props.className.indexOf(headers[i].className), -1);

	// 	});
	// });

	// it("#applies a className of 'asc' or 'desc' according to the filters prop", () => {
	// 	ShallowRenderer.render(<TableHeader headers={headers} filters={filters} />);
	// 	const renderedOutput = ShallowRenderer.getRenderOutput();

	// 	columns = renderedOutput.props.children;
	// 	console.log(columns[0])

	// 	let sortingColumn = columns.filter((column) => {
	// 		return column.props.children === "something";
	// 	})[0];

	// 	assert.notEqual(sortingColumn.props.className.indexOf("desc"), -1);
	// });

	it("#calls a sorting function when a column is clicked, with the respective 'key' & current sort direction", () => {
		let clickedColKey, currentSortDir;

		const sortFunc = (key, sortDir) => {
			clickedColKey = key;
			currentSortDir = sortDir;
		};

		const RenderedComponent = TestUtils.renderIntoDocument(
			<TableHeader headers={headers} filters={filters} sortFunc={sortFunc} />
		);

		const singleHeader = TestUtils.scryRenderedDOMComponentsWithClass(RenderedComponent, "table-row-item")[0];
		const headerNode = React.findDOMNode(singleHeader);

		assert.equal(clickedColKey, undefined);
		TestUtils.Simulate.click(headerNode);
		assert.notEqual(clickedColKey, undefined);
	});

});
