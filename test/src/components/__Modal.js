"use strict";
import assert from "assert";
import React from "react/addons";
let { TestUtils }  = React.addons;

import Modal from "../../../src/js/components/common/Modal";

describe("Modal", () => {

	it("#renders a single Modal section", () => {
		const ShallowRenderer = TestUtils.createRenderer();
		ShallowRenderer.render(
			<Modal isVisible={true} hide={() => {}}/>
		);
		const renderedOutput = ShallowRenderer.getRenderOutput();
		assert.equal(renderedOutput.type, "section");
	});

	it("#displays block or none depending on the isVisible prop", () => {
		const ShallowRenderer = TestUtils.createRenderer();
		ShallowRenderer.render(
			<Modal isVisible={false} hide={() => {}}/>
		);
		const renderedOutput = ShallowRenderer.getRenderOutput();

		const modalContents = renderedOutput.props.children;

		modalContents.forEach(el => {
			assert.equal(el.props.style.display, "none");
		});

		ShallowRenderer.render(
			<Modal isVisible={true} hide={() => {}}/>
		);
		const renderedOutputVisible = ShallowRenderer.getRenderOutput();

		const modalContentsVisible = renderedOutputVisible.props.children;

		modalContentsVisible.forEach(el => {
			assert.equal(el.props.style.display, "block");
		});
	});

	it("#renders any children passed to it in the dialogue", () => {
		const ShallowRenderer = TestUtils.createRenderer();
		ShallowRenderer.render(
			<Modal isVisible={false} hide={() => {}}>
				<button className="testing" />
			</Modal>
		);
		const renderedOutput = ShallowRenderer.getRenderOutput();

		const dialogueContents = renderedOutput.props.children.filter(el =>
			el.className === "modal-dialogue"
		);

		assert(dialogueContents.filter(el => el.className === "testing"));
	});
});
