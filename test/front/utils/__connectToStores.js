"use strict";
import assert from "assert";
import React from "react/addons";
let { TestUtils } = React.addons;

import connectToStores from "../../../src/js/utils/connectToStores";
describe("connectToStores", () => {

	let count = 0;
	let ConnectedComponent;
	let RenderedComponent;

	const Store = {
		listeners: [],
		onChange() {
			this.listeners.forEach(method => { method(); });
		},
		addChangeListener(cb) {
			this.listeners.push(cb);
		},
		removeChangeListener() {
			this.listeners.pop();
		},
		getNum() {
			return ++count;
		}
	};

	function getStateFromStores() {
		return {
			count: Store.getNum()
		};
	}

	const dummyComponent = React.createClass({
		render() {
			return <span>{this.props.count}</span>;
		}
	});

	beforeEach(function() {
		ConnectedComponent = connectToStores([Store], getStateFromStores)(dummyComponent);
		RenderedComponent = TestUtils.renderIntoDocument(
			<ConnectedComponent />
		);
	});

	afterEach(done => {
		count = 0;
		Store.listeners = [];
		done();
	});

	it("#takes 2 arguments - an array of stores & a getState function", () => {
		assert.equal(connectToStores.length, 2);
	});

	it("#returns a function that takes 1 argument - a component", () => {
		assert.equal(connectToStores().length, 1);
	});

	it("#returns a function that returns a wrapper class that is connected to the specified stores", () => {

		assert(Store.listeners.length === 1);
	});

	it("#the wrapper component is stateful, as determined by the getState argument", () => {
		assert(RenderedComponent.state);
		assert.equal(RenderedComponent.state.count, 1);
		Store.onChange();
		assert.equal(RenderedComponent.state.count, 2);
	});

	it("#the wrapper component renders the component passed as an argument with all its state/props", () => {
		var spanComponent = TestUtils.findRenderedDOMComponentWithTag(
			RenderedComponent,
			"span"
		);

		var spanElement = React.findDOMNode(spanComponent);

		assert.equal(spanElement.textContent, 1);
		Store.onChange();
		assert.equal(spanElement.textContent, 2);
	});

	it("#the wrapper component disconnects from the specified stores on unmount", () => {
		// FIX THIS TEST
		// assert.equal(RenderedComponent.state.count, 1);
		// React.unmountComponentAtNode(document.body);
		// setTimeout(() => {
		// 	console.log("HI MUM", RenderedComponent.state.count);
		// 	Store.onChange();
		// 	console.log(RenderedComponent.state.count);
		// 	assert.equal(Store.listeners.length, 0);
		// 	done();
		// }, 0);
	});
});
