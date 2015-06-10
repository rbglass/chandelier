"use strict";
import assert from "assert";
import { Link } from "react-router";
import React from "react/addons";
let { TestUtils } = React.addons;

import TableRow from "../../../src/js/components/common/TableRow";
import { withContainer, stubRouterContext } from "../setup/utils";

let testId = null;
let testKey = null;
let testValue = null;
let testCells = null;
let counter = 0;

const cells = {
	description  : "desvalue",
	qty_req      : 123,
	bulb         : "bulbvalue",
	offbulb      : "offbulbvalue",
	shipping_date: "2015-01-01",
	job_status   : "jobstatval",
	"-"          : "-val",
	job_id       : "jobidval",
	item_id      : "itemidval"
};

const selections = {
	job_status: [1, 2, 3, 4]
};

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

			if (typeof babies.type === "function") {
				assert.equal(babies.type, Link);
			} else if (!babies.type) {
				assert.equal(!!babies.type, !!cellConfig[i].type);
			} else if (babies.type !== "input") {
				assert.equal(babies.type, cellConfig[i].type);
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
		const textarea = TestUtils.findRenderedDOMComponentWithTag(
			RenderedComponent,
			"textarea"
		);
		const textareaNode = React.findDOMNode(textarea);

		assert(textarea);
		assert.equal(textareaNode.textContent, cells.description);
	});

	it("#cell types: number", () => {
		// const number = TestUtils.findRenderedDOMComponentWithClass(
		// 	RenderedComponent,
		// 	"qty-sm"
		// );
		// const numberNode = React.findDOMNode(number);

		// console.log(React.findDOMNode(number.props.children));
		// assert.equal(numberNode.value, cells.qty_req);
	});

	it("#cell types: text - enabled", () => {
		// const text = TestUtils.scryRenderedDOMComponentsWithTag(
		// 	RenderedComponent,
		// 	"text"
		// ).filter(c => c.props.onChange);

		// // console.log(text);
		// const textNode = React.findDOMNode(text);

		// assert.equal(textNode.value, cells.bulb);
	});

	it("#cell types: text - disabled", () => {
		// const text = TestUtils.scryRenderedDOMComponentsWithTag(
		// 	RenderedComponent,
		// 	"text"
		// ).filter(c => !c.props.onChange);
		// const textNode = React.findDOMNode(text);

		// assert.equal(textNode.value, cells.offbulb);
		// assert(textNode.disabled);
		// assert(textNode.readOnly);
	});

	it("#cell types: date", () => {

	});

	it("#cell types: select", () => {

	});

	it("#cell types: button", () => {

	});

	it("#cell types: link", () => {

	});

	it("#cell types: default", () => {

	});

	it("#onBlur is called with the (cells[primaryKey], cells) only when focus is lost from the row", () => {
		var rowNode = React.findDOMNode(row);

		TestUtils.Simulate.blur(rowNode, {
			relatedTarget: {
				parentElement: {
					parentElement: rowNode
				}
			}
		});

		assert.equal(counter, 0);

		TestUtils.Simulate.blur(rowNode, {relatedTarget: null});
		assert.equal(testValue, cells[primaryKey]);
		assert.deepEqual(testCells, cells);
		assert.equal(counter, 1);

		TestUtils.Simulate.blur(rowNode, {
			relatedTarget: {
				parentElement: {
					parentElement: "hi"
				}
			}
		});
		assert.equal(counter, 2);

	});

	it("#onChange is called with an object w/ key, id and value props", () => {
		const select = TestUtils.findRenderedDOMComponentWithTag(
			RenderedComponent,
			"select"
		);
		const selectNode = React.findDOMNode(select);

		TestUtils.Simulate.change(selectNode, {target: {value: "hi"}});
		assert.equal(testId, cells[primaryKey]);
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
		assert.equal(testId, cells[primaryKey]);
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

		assert.equal(testId, cells.job_id);
		assert.deepEqual(testCells, cells);
	});

});
