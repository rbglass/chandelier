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
			<Alert isLoading={false} alert={{type: "error"}}/>
		);
		const renderedOutput = ShallowRenderer.getRenderOutput();

		const class1 = renderedOutput.props.className;

		ShallowRenderer.render(
			<Alert isLoading={true} alert={{type: "error"}}/>
		);

		const class2 = ShallowRenderer.getRenderOutput().props.className;

		assert.notEqual(class1, class2);
	});

	it("#renders a spinner depending on the isLoading prop", () => {
		const ShallowRenderer = TestUtils.createRenderer();
		ShallowRenderer.render(
			<Alert isLoading={true} alert={{type: "error"}}/>
		);
		const renderedOutput = ShallowRenderer.getRenderOutput();

		const class1 = renderedOutput.props.children.props.className;

		assert.equal(class1, "spinner");
	});

	it("#has a different class depending on the alert type", () => {
		const ShallowRenderer = TestUtils.createRenderer();
		ShallowRenderer.render(
			<Alert isLoading={false} alert={{type: "error"}}/>
		);
		const renderedOutput = ShallowRenderer.getRenderOutput();

		const class1 = renderedOutput.props.className;

		ShallowRenderer.render(
			<Alert isLoading={false} alert={{type: "success"}}/>
		);

		const class2 = ShallowRenderer.getRenderOutput().props.className;

		assert.notEqual(class1, class2);
	});

	it("#displays error text if the alert type is 'error'", () => {
		const ShallowRenderer = TestUtils.createRenderer();
		ShallowRenderer.render(
			<Alert isLoading={false} alert={{type: "error", message:"whoops!"}}/>
		);
		const renderedOutput = ShallowRenderer.getRenderOutput();

		assert.notEqual(renderedOutput.props.children.indexOf("whoops!"), -1);
	});

});
