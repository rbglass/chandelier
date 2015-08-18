"use strict";
import I from "immutable";
import assert from "assert";
import React from "react/addons";
let { TestUtils }  = React.addons;

import Select from "../../../src/js/components/table/Select";

describe("Select", () => {

	const selections = I.List(["First", "Secundo", "tree"]);

	it("#renders a single select, with options for each element in the selections List", () => {
		const ShallowRenderer = TestUtils.createRenderer();
		ShallowRenderer.render(
			<Select selections={selections} value="First"/>
		);
		const renderedOutput = ShallowRenderer.getRenderOutput();
		const optionList = renderedOutput.props.children.filter(e => e instanceof I.List).pop();

		assert.equal(renderedOutput.type, "select");
		assert.equal(optionList.size, 3);

		optionList.forEach((e, i) => {
			assert.equal(e.type, "option");
			assert.equal(e.props.children, selections.get(i));
		});
	});

	it("#renders an extra disabled option if the current value is not in the selections list", () => {
		const val = "fourth";

		const ShallowRenderer = TestUtils.createRenderer();
		ShallowRenderer.render(
			<Select selections={selections} value={val} />
		);
		const kids = ShallowRenderer.getRenderOutput().props.children;
		const normalOption = kids.filter(e => e && e.type === "option").pop();
		const extraOptions = kids.filter(e => e instanceof I.List).pop();
		const moreSelections = selections.push(val);

		ShallowRenderer.render(
			<Select selections={moreSelections} value={val} />
		);
		const moreKids = ShallowRenderer.getRenderOutput().props.children;
		const normalPerhaps = moreKids.filter(e => e && e.type === "option").pop();
		const adequateOptions = moreKids.filter(e => e instanceof I.List).pop();

		assert.equal(extraOptions.push(normalOption).size, adequateOptions.size);
		assert(normalOption && normalOption.type === "option");
		assert.equal(normalPerhaps, undefined);
	});

	// it("renders the displayed option with a different text color if the 'colored' prop is passed", () => {
	// 	const ShallowRenderer = TestUtils.createRenderer();
	// 	const [val1, val2] = selections.slice(1);
	//
	// 	ShallowRenderer.render(
	// 		<Select selections={selections} value={val1} colored />
	// 	);
	//
	// 	const select = ShallowRenderer.getRenderOutput();
	//
	// 	assert.equal(select.props.style.color, "blue");
	//
	// 	ShallowRenderer.render(
	// 		<Select selections={selections} value={val2} colored />
	// 	);
	//
	// 	const select2 = ShallowRenderer.getRenderOutput();
	//
	// 	assert.equal(select2.props.style.color, "green");
	// });
});
