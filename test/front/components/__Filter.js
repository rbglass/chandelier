"use strict";
import assert from "assert";
import React from "react/addons";
let { TestUtils }  = React.addons;

import FilterInput from "../../../src/js/components/common/FilterInput";
import MultiSelect from "../../../src/js/components/common/MultiSelect";
import Preset from "../../../src/js/components/common/Preset";

import Filter from "../../../src/js/components/common/Filter";

describe("Filter", () => {

	const setFilter = () => {};
	const setStartDate = () => {};
	const setEndDate = () => {};
	const restrictTo = () => {};
	const onSelect = () => {};

	const filters = {
		filterBy: "hi",
		startDate: "2015-01-01",
		endDate: "2016-01-01",
		restrictions: {
			name: {
				key: "name",
				options: ["jim", "tim"]
			}
		}
	};

	const selections = {
		name: ["jim"]
	};

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
		/>
	);

	const renderedOutput = ShallowRenderer.getRenderOutput();
	const columns = renderedOutput.props.children.filter(el => el.type === "div");

	it("#renders 2 columns if passed no children", () => {
		assert.equal(columns.length, 2);
	});

	it("#renders 3 FilterInputs in the first column", () => {
		const kids = columns[0].props.children;
		assert.equal(kids.filter(el => el.type === FilterInput).length, 3);
	});

	it("#renders a MultiSelect for each element in filters.restrictions", () => {
		const kids = columns[1].props.children;
		assert.equal(
			kids.filter(el => el.type === MultiSelect).length,
			Object.keys(filters.restrictions).length
		);
	});

	it("#renders a Preset component for each element in presetConfig, with description and onSelect props", () => {
		const kids = columns[0].props.children;
		const presets = kids[0].props.children.filter(el => el.type === Preset);

		assert.equal(
			presets.length,
			Object.keys(presetConfig).length
		);

		assert.equal(presets[0].props.description, presetConfig[0].description);
		assert.deepEqual(presets[0].props.onSelect, presetConfig[0].onSelect);
	});
});
