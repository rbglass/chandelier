"use strict";
import assert from "assert";
import React from "react/addons";
let { TestUtils }  = React.addons;

import Filter from "../../../src/js/components/common/Filter";

let filters;
let selections;

// describe("Filter", () => {
// 	const ShallowRenderer = TestUtils.createRenderer();
// 	ShallowRenderer.render(
// 		<Filter filters={filters} selections={selections}
// 			setFilter={} setStartDate={}
// 			setEndDate={}
// 			restrictTo={}
// 			sortFunc={}
// 		/>
// 	);
// 	const renderedOutput = ShallowRenderer.getRenderOutput();

	// it("#renders 3 FilterInputs", () => {

	// });

	// it("#renders each FilterInput", () => {

	// });

	// it("#renders a MultiSelect for each element in filters.restrictions", () => {

	// });

	// it("#", () => {

	// });
// });
