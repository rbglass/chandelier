"use strict";
import I from "immutable";
import assert from "assert";
import React from "react/addons";
let { TestUtils, CSSTransitionGroup } = React.addons;

import Table from "../../../src/js/components/table/Table";
import TableHeader from "../../../src/js/components/table/TableHeader";
import TableRow from "../../../src/js/components/table/TableRow";

describe("Table", () => {

	const ShallowRenderer = TestUtils.createRenderer();

	const tableScheme = [{key: "dummytablescheme"}];
	const items = I.fromJS([{key: "dummycells1"}, {key: "dummycells2"}, {key: "dummycells3"}]);
	const selections = I.fromJS({items: ["dummyselections"]});
	const filters = I.fromJS({key: "dummyfilter"});
	const primaryKey = "dummykey";
	const onBlur = () => {};
	const sortFunc = () => {};

	let columns;

	ShallowRenderer.render(
		<Table tableScheme={tableScheme} items={items} selections={selections}
				filters={filters} primaryKey={primaryKey} onBlur={onBlur}
				sortFunc={sortFunc}
		/>
	);
	const renderedOutput = ShallowRenderer.getRenderOutput();
	const header = renderedOutput.props.children[0];
	const tableBody = renderedOutput.props.children[1];
	const rows = tableBody.props.children;

	it("#renders a TableHeader component at the top of the table, and a table body div under it", () => {
		assert.equal(header.type, TableHeader);
		assert.equal(tableBody.type, CSSTransitionGroup);
	});

	it("#passes TableHeader filters, headers and sortFunc props", () => {
		assert.equal(header.props.filters, filters);
		assert.equal(header.props.headers, tableScheme);
		assert.equal(header.props.sortFunc, sortFunc);
	});

	it("#renders a TableRow component for every element in the 'items' prop", () => {
		assert.equal(rows.size, items.size);
		rows.forEach((row, i) => {
			assert.equal(row.type, TableRow);
		});
	});

	it("#passes TableRow cells, cellConfig, selections, primaryKey and onBlur props", () => {
		rows.forEach((row, i) => {
			assert.equal(row.props.cells, items.get(i));
			assert.equal(row.props.cellConfig, tableScheme);
			assert.equal(row.props.selections, selections);
			assert.equal(row.props.primaryKey, primaryKey);
			assert.equal(row.props.onBlur, onBlur);
		});
	});

});
