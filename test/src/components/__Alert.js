"use strict";
import assert from "assert";
import React from "react/addons";
let { TestUtils }  = React.addons;

import Alert from "../../../src/js/components/common/Alert";

describe("Alert", () => {

	it("#renders a single alert div", () => {
		const ShallowRenderer = TestUtils.createRenderer();
		ShallowRenderer.render(
			<Alert isLoading={false} alert={{type: "error"}}/>
		);
		const renderedOutput = ShallowRenderer.getRenderOutput();
		assert.equal(renderedOutput.type, "div");
	});

	it("#has a different class depending on the isLoading prop", () => {
		const ShallowRenderer = TestUtils.createRenderer();
		ShallowRenderer.render(
			<Alert isLoading={false} />
		);
		const renderedOutput = ShallowRenderer.getRenderOutput();

		const class1 = renderedOutput.props.className;

		ShallowRenderer.render(
			<Alert isLoading={true} />
		);

		const class2 = ShallowRenderer.getRenderOutput().props.className;

		assert.notEqual(class1, class2);
	});

	it("#renders different content depending on the isLoading prop", () => {
		const ShallowRenderer = TestUtils.createRenderer();
		ShallowRenderer.render(
			<Alert isLoading={true} />
		);
		const renderedOutput1 = ShallowRenderer.getRenderOutput();

		ShallowRenderer.render(
			<Alert isLoading={false} />
		);
		const renderedOutput2 = ShallowRenderer.getRenderOutput();

		assert.notEqual(renderedOutput1.props.children, renderedOutput2.props.children);
	});

	it("#renders different content depending on the isUnsaved prop", () => {
		const ShallowRenderer = TestUtils.createRenderer();
		ShallowRenderer.render(
			<Alert isUnsaved={true} />
		);
		const renderedOutput1 = ShallowRenderer.getRenderOutput();

		ShallowRenderer.render(
			<Alert isUnsaved={false} />
		);
		const renderedOutput2 = ShallowRenderer.getRenderOutput();

		assert.notEqual(renderedOutput1.props.children, renderedOutput2.props.children);
	});

	it("#displays error text if the alert type is 'error'", () => {
		const ShallowRenderer = TestUtils.createRenderer();
		ShallowRenderer.render(
			<Alert isLoading={false} alert={{type: "error", details:"whoops!"}}/>
		);
		const renderedOutput = ShallowRenderer.getRenderOutput();

		assert.notEqual(renderedOutput.props.children.indexOf("whoops!"), -1);
	});

});
