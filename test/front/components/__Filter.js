"use strict";
import I from "immutable";
import assert from "assert";
import React from "react/addons";
let { TestUtils }  = React.addons;

import FilterInput from "../../../src/js/components/filter/FilterInput";
import MultiSelect from "../../../src/js/components/filter/MultiSelect";
import Preset from "../../../src/js/components/filter/Preset";

import Filter from "../../../src/js/components/filter/Filter";

describe("Filter", () => {

	const setFilter = () => {};
	const setStartDate = () => {};
	const setEndDate = () => {};
	const restrictTo = () => {};
	const onSelect = () => {};

	const filters = I.fromJS({
		filterBy: "hi",
		startDate: "2015-01-01",
		endDate: "2016-01-01",
		restrictions: {
			name: {
				key: "name",
				options: ["jim", "tim"]
			}
		}
	});

	const selections = I.fromJS({
		name: ["jim"]
	});

	const	presetConfig = [
		{description: "preset", onSelect: []}
	];

	const ShallowRenderer = TestUtils.createRenderer();

	ShallowRenderer.render(
		<Filter filters={filters} selections={selections}
			setFilter={setFilter} setStartDate={setStartDate}
			setEndDate={setEndDate}
			restrictTo={restrictTo}
			presetConfig={presetConfig}
			currentPage={1} totalPages={4}
		/>
	);

	const renderedOutput = ShallowRenderer.getRenderOutput();
	const youngers = renderedOutput.props.children.filter(el => el.type === "div");
	const columns = youngers.filter(el => el.props.className.indexOf("table-manip-col") !== -1);

	it("#renders a preset row and 2 columns if passed no children", () => {
		assert.equal(columns.length, 2);
	});

	it("#renders a FilterInput in the first row of the first column", () => {
		const row = columns[0].props.children.filter(el =>
			el.props.className && el.props.className.indexOf("table-manip-row") !== -1
		).pop();
		assert.equal(row.props.children.filter(el => el.type === FilterInput).length, 1);
	});

	it("#renders a MultiSelect for each element in filters.restrictions", () => {
		const kids = columns[1].props.children;

		assert.equal(
			kids.filter(el => el.type === MultiSelect).length,
			filters.get("restrictions").size
		);
	});

	it("#renders a Preset component for each element in presetConfig, with description and onSelect props", () => {
		const kids = youngers.filter(el => el.props.className.indexOf("table-manip-presets") !== -1);
		const presets = kids[0].props.children.filter(el => el.type === Preset);

		assert.equal(
			presets.length,
			Object.keys(presetConfig).length
		);

		assert.equal(presets[0].props.description, presetConfig[0].description);
		assert.deepEqual(presets[0].props.onSelect, presetConfig[0].onSelect);
	});
});
