"use strict";
import I from "immutable";
import assert from "assert";
import { sameVal } from "../setup/utils";
import React from "react/addons";
let { TestUtils } = React.addons;

import MultiSelect from "../../../src/js/components/common/MultiSelect";

describe("MultiSelect", () => {
	let currentOptions = {};

	const key = "tube_lines";
	const selections = I.List(["met", "central", "piccadilly", "district", "victoria"]);

	const onSelect = function(k, itemsToSelect) {
		currentOptions = I.fromJS({
			key: k,
			options: itemsToSelect
		});
	};

	afterEach(done => {
		currentOptions = {};
		done();
	});

	it("#should render the selected.key as a tidied-up title in the first label", () => {

		const selected = I.fromJS({
			key: key,
			options: ["met", "central"]
		});

		const RenderedComponent = TestUtils.renderIntoDocument(
			<MultiSelect onSelect={onSelect} selected={selected} selections={selections}/>
		);

		const title = TestUtils.findRenderedDOMComponentWithClass(
			RenderedComponent,
			"multiselect-title"
		);

		const titleNode = React.findDOMNode(title);

		assert.equal(titleNode.textContent, "Tube Lines");
	});

	it("#should render a 'Select All' checkbox that, when unchecked, deselects all items", () => {

		const selected = I.fromJS({
			key: key,
			options: ["met", "central"]
		});

		const RenderedComponent = TestUtils.renderIntoDocument(
			<MultiSelect onSelect={onSelect} selected={selected} selections={selections}/>
		);
		const checkbox = TestUtils.findRenderedDOMComponentWithClass(
			RenderedComponent,
			"multiselect-checkbox"
		);

		const checkboxNode = React.findDOMNode(checkbox);

		assert.equal(checkboxNode.checked, false);

		TestUtils.Simulate.change(checkboxNode);
		assert.equal(currentOptions.get("key"), key);
		sameVal(currentOptions.get("options"), I.List());
	});

	it("#should render a 'Select All' checkbox that, when checked, selects all items", () => {

		const selected = I.fromJS({
			key: key,
			options: selections
		});

		const RenderedComponent = TestUtils.renderIntoDocument(
			<MultiSelect onSelect={onSelect} selected={selected} selections={selections}/>
		);
		const checkbox = TestUtils.findRenderedDOMComponentWithClass(
			RenderedComponent,
			"multiselect-checkbox"
		);

		const checkboxNode = React.findDOMNode(checkbox);

		assert.equal(checkboxNode.checked, true);

		TestUtils.Simulate.change(checkboxNode);
		assert.equal(currentOptions.get("key"), key);
		sameVal(currentOptions.get("options"), selections);
	});

	it("#should render a multi-select, with a value determined by selected.option", () => {
		const selected = I.fromJS({
			key: key,
			options: ["met", "central"]
		});

		const RenderedComponent = TestUtils.renderIntoDocument(
			<MultiSelect onSelect={onSelect} selected={selected} selections={selections}/>
		);
		const select = TestUtils.findRenderedDOMComponentWithTag(
			RenderedComponent,
			"select"
		);

		// How to get value of multiselect???
		assert(select.props.multiple);
		assert.deepEqual(select.props.value, selected.get("options").toArray());
		assert.equal(select.props.children.size, 5);

	});

	it("#should fire onChange with the selected options when selected", () => {
		const selected = I.fromJS({
			key: key,
			options: ["met", "central"]
		});

		const RenderedComponent = TestUtils.renderIntoDocument(
			<MultiSelect onSelect={onSelect} selected={selected} selections={selections}/>
		);
		const select = TestUtils.findRenderedDOMComponentWithTag(
			RenderedComponent,
			"select"
		);

		const line1 = "district";
		const line2 = "victoria";

		const selectNode = React.findDOMNode(select);
		assert.deepEqual(currentOptions, {});

		TestUtils.Simulate.change(selectNode, {
			target: {
				selectedOptions: [{ value: line1 }, { value: line2 }]
			}
		});

		sameVal(currentOptions, I.fromJS({
			key: key,
			options: [line1, line2]
		}));
	});
});
