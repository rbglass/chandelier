"use strict";
import I from "immutable";
import assert from "assert";
import { Link } from "react-router";
import React from "react/addons";
let { TestUtils } = React.addons;

import Select from "../../../src/js/components/table/Select";
import NumInput from "../../../src/js/components/table/NumInput";
import TextInput from "../../../src/js/components/table/TextInput";
import DateSelector from "../../../src/js/components/common/DateSelector";
import TextArea from "react-textarea-autosize";

import TableRow from "../../../src/js/components/table/TableRow";
import { withContainer, stubRouterContext } from "../setup/utils";

let testId = null;
let testKey = null;
let testValue = null;
let testCells = null;
let counter = 0;

const cells = I.Map({
	description  : "desvalue",
	qty_req      : 123,
	bulb         : "bulbvalue",
	offbulb      : "offbulbvalue",
	shipping_date: "2015-01-01",
	job_status   : "jobstatval",
	"-"          : "-val",
	job_id       : "jobidval",
	item_id      : "itemidval"
});

const selections = I.Map({
	job_status: I.List(["hello", "hi", "test", "one"])
});

const primaryKey = "bulb";

const onBlur = function(primVal, rowCells) {
	counter += 1;
	testValue = primVal;
	testCells = rowCells;
};

const onChange = function(sealedObj) {
	testId = sealedObj.id;
	testKey = sealedObj.key;
	testValue = sealedObj.value;
};

const onClick = function(jobid, rowCells) {
	testId = jobid;
	testCells = cells;
};

const cellConfig = [
	{ key: "description",   display: "Description",   className: "descr",     type: "textarea", onChange: onChange },
	{ key: "qty_req",       display: "Qty Req",       className: "qty-sm",    type: "number",   onChange: onChange },
	{ key: "bulb",          display: "Bulb",          className: "bulb",			type: "text",     onChange: onChange },
	{ key: "offbulb",       display: "BulbOff",       className: "off",			  type: "text"                         },
	{ key: "shipping_date", display: "Shipping Date", className: "shipdate",  type: "date",     onChange: onChange },
	{ key: "job_status",    display: "Job Status",    className: "jobstat",   type: "select",   onChange: onChange },
	{ key: "-", 	          display: "",              className: "fixed-col", type: "button",   onClick : onClick, inputClassName: "btn-left" },
	{ key: "job_id",        display: "Job #",         className: "qty-md",    type: "link",                        to: "singlejob" },
	{ key: "item_id", 	    display: "Item",          className: "qty-lg",    type: "" }
];

describe("TableRow", () => {

	var Subject = stubRouterContext(TableRow, {
		cells: cells,
		selections: selections,
		primaryKey: primaryKey,
		cellConfig: cellConfig,
		onBlur: onBlur
	});

	let RenderedComponent = TestUtils.renderIntoDocument(
		<Subject cells={cells} selections={selections}
				primaryKey={primaryKey} cellConfig={cellConfig}
				onBlur={onBlur}
		/>
	);

	const row = TestUtils.findRenderedDOMComponentWithClass(
		RenderedComponent,
		"table-row"
	);

	afterEach(done => {
		counter = 0;
		testId = null;
		testKey = null;
		testValue = null;
		testCells = null;
		done();
	});

	it("#renders an element for each item in cellConfig, according to the specified 'type'", () => {
		const kids = row.props.children;
		const inputs = TestUtils.scryRenderedDOMComponentsWithTag(
			RenderedComponent,
			"input"
		);
		let numInputs = inputs.filter(input => React.findDOMNode(input).type === "number");
		let dateInputs = inputs.filter(input => React.findDOMNode(input).type === "date");
		let textInputs = inputs.filter(input => React.findDOMNode(input).type === "text");

		assert.equal(kids.length, cellConfig.length);
		assert.equal(inputs.length, 4);

		assert.equal(numInputs.length, 1);
		assert.equal(dateInputs.length, 1);
		assert.equal(textInputs.length, 2);

		kids.forEach((youngling, i) => {
			let babies = youngling.props.children;

			switch (cellConfig[i].type) {
				case "link":
						assert.deepEqual(babies.type, Link);
						break;

				case "date":
						assert.deepEqual(babies.type, DateSelector);
						break;

				case "textarea":
						assert.deepEqual(babies.type, TextArea);
						break;

				case "text":
						assert.deepEqual(babies.type, TextInput);
						break;

				case "number":
						assert.deepEqual(babies.type, NumInput);
						break;

				case "select":
						assert.deepEqual(babies.type, Select);
						break;

				case "button":
						assert.equal(babies.type, "button");
						break;

				default:
						assert.equal(babies.type, "span");
						break;
			}
		});
	});

	it("#renders each element wrapped in a div with the specified className & keySealed onChange", () => {
		const kids = row.props.children;

		kids.forEach((youngling, i) => {
			assert.equal(youngling.type, "div");
			assert.notEqual(youngling.props.className.indexOf(cellConfig[i].className), -1);

			assert.equal(!!youngling.props.onChange, !!cellConfig[i].onChange);
		});
	});

	it("#cell types: textarea", () => {
		const textarea = TestUtils.findRenderedComponentWithType(
			RenderedComponent,
			TextArea
		);

		const textareaNode = React.findDOMNode(TestUtils.findRenderedDOMComponentWithTag(
			RenderedComponent,
			"textarea"
		));

		assert(textarea);
		assert(textareaNode);
		assert.equal(textareaNode.textContent, cells.get("description"));
	});

	it("#cell types: number", () => {
		const number = TestUtils.findRenderedDOMComponentWithClass(
			RenderedComponent,
			"qty-sm"
		);

		assert.equal(number.props.children.type, NumInput);
		assert.equal(number.props.children.props.value, cells.get("qty_req"));
	});

	it("#cell types: text - enabled", () => {
		const text = TestUtils.findRenderedDOMComponentWithClass(
			RenderedComponent,
			"bulb"
		);

		// const textNode = React.findDOMNode(text);

		// assert.equal(textNode.value, cells.get("bulb"));
	});

	it("#cell types: text - disabled", () => {
		// const text = TestUtils.scryRenderedDOMComponentsWithTag(
		// 	RenderedComponent,
		// 	"text"
		// ).filter(c => !c.props.onChange);
		// const textNode = React.findDOMNode(text);

		// assert.equal(textNode.value, cells.get("offbulb"));
		// assert(textNode.disabled);
		// assert(textNode.readOnly);
	});

	// it("#cell types: date", () => {

	// });

	// it("#cell types: select", () => {

	// });

	// it("#cell types: button", () => {

	// });

	// it("#cell types: link", () => {

	// });

	// it("#cell types: default", () => {

	// });

	it("#onBlur is called with the (cells.get(primaryKey), cells) only when focus is lost from the row", () => {
		var rowNode = React.findDOMNode(row);

		TestUtils.Simulate.blur(rowNode, {
			relatedTarget: {
				parentElement: {
					parentElement: rowNode
				}
			},
			target: {
				tagName: "INPUT"
			}
		});

		assert.equal(counter, 0);

		TestUtils.Simulate.blur(rowNode, {
			relatedTarget: null,
			target: {
				tagName: "INPUT"
			}});
		assert.equal(testValue, cells.get(primaryKey));
		assert.deepEqual(testCells, cells);
		assert.equal(counter, 1);

		TestUtils.Simulate.blur(rowNode, {
			relatedTarget: {
				parentElement: {
					parentElement: "hi"
				}
			},
			target: {
				tagName: "INPUT"
			}
		});
		assert.equal(counter, 2);

	});

	it("#onBlur is called only if the focus-lost element is useful (inputtable)", () => {
		var rowNode = React.findDOMNode(row);

		TestUtils.Simulate.blur(rowNode, {
			relatedTarget: null,
			target: {
				tagName: "DIV"
			}
		});

		assert.equal(counter, 0);

		TestUtils.Simulate.blur(rowNode, {
			relatedTarget: null,
			target: {
				tagName: "TEXTAREA"
			}});
		assert.equal(counter, 1);

		TestUtils.Simulate.blur(rowNode, {
			relatedTarget: null,
			target: {
				tagName: "SELECT"
			}
		});
		assert.equal(counter, 2);

		TestUtils.Simulate.blur(rowNode, {
			relatedTarget: null,
			target: {
				tagName: "OPTION"
			}
		});
		assert.equal(counter, 3);

	});

	it("#onChange is called with an object w/ key, id and value props", () => {
		const select = TestUtils.findRenderedDOMComponentWithTag(
			RenderedComponent,
			"select"
		);
		const selectNode = React.findDOMNode(select);

		TestUtils.Simulate.change(selectNode, {target: {value: "hi"}});
		assert.equal(testId, cells.get(primaryKey));
		assert.equal(testKey, "job_status");
		assert.equal(testValue, "hi");

	});

	it("#onChange's value prop is e.target.value, attempted num coerced", () => {
		const select = TestUtils.findRenderedDOMComponentWithTag(
			RenderedComponent,
			"select"
		);
		const selectNode = React.findDOMNode(select);

		TestUtils.Simulate.change(selectNode, {target: {value: "123"}});
		assert.equal(testId, cells.get(primaryKey));
		assert.equal(testKey, "job_status");
		assert.equal(testValue, 123);
	});

	it("#onClick is called with the row's job_id and cells", () => {
		const button = TestUtils.findRenderedDOMComponentWithTag(
			RenderedComponent,
			"button"
		);
		const buttonNode = React.findDOMNode(button);

		TestUtils.Simulate.click(buttonNode);

		assert.equal(testId, cells.get("job_id"));
		assert.deepEqual(testCells, cells);
	});

});
