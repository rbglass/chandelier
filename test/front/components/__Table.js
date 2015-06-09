"use strict";
import assert from "assert";
import React from "react/addons";
let { TestUtils } = React.addons;

import Table from "../../../src/js/components/common/Table";
import TableHeader from "../../../src/js/components/common/TableHeader";
import TableRow from "../../../src/js/components/common/TableRow";

describe("Table", () => {

	const ShallowRenderer = TestUtils.createRenderer();

	const tableScheme = "dummytablescheme";
	const items = ["dummycells1", "dummycells2", "dummycells3"];
	const selections = "dummyselections";
	const filters = "dummyfilter";
	const primaryKey = "dummykey";
	const onBlur = "dummyfuncblur"
	const sortFunc = "dummyfuncsort";

	let columns;

	ShallowRenderer.render(
		<Table tableScheme={tableScheme} items={items} selections={selections}
				filters={filters} primaryKey={primaryKey} onBlur={onBlur}
				sortFunc={sortFunc}
		/>
	);
	const renderedOutput = ShallowRenderer.getRenderOutput();
	const header = renderedOutput.props.children[0];
	const rows = renderedOutput.props.children[1];

	it("#renders a TableHeader component at the top of the table", () => {
		assert.equal(header.type, TableHeader);
	});

	it("#passes TableHeader filters, headers and sortFunc props", () => {
		assert.equal(header.props.filters, filters);
		assert.equal(header.props.headers, tableScheme);
		assert.equal(header.props.sortFunc, sortFunc);
	});

	it("#renders a TableRow component for every element in the 'items' prop", () => {
		assert.equal(rows.length, items.length)
		rows.forEach((row, i) => {
			assert.equal(row.type, TableRow);
		});
	});

	it("#passes TableRow cells, cellConfig, selections, primaryKey and onBlur props", () => {
		rows.forEach((row, i) => {
			assert.equal(row.props.cells, items[i]);
			assert.equal(row.props.cellConfig, tableScheme);
			assert.equal(row.props.selections, selections);
			assert.equal(row.props.primaryKey, primaryKey);
			assert.equal(row.props.onBlur, onBlur);
		});
	});

});
