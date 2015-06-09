"use strict";
var assert = require("assert");
var React = require("react");
var TestUtils = require("react/addons").addons.TestUtils;

describe("connectToStores", function() {
	var connectToStores = require("../../../src/js/utils/connectToStores");

	var count = 0;

	var Store = {
		listeners: [],
		onChange: function() {
			this.listeners.forEach(function(method) { method(); });
		},
		addChangeListener: function(cb) {
			this.listeners.push(cb);
		},
		removeChangeListener: function() {
			this.listeners.pop();
		},
		getNum: function() {
			return ++count;
		}
	};

	function getStateFromStores() {
		return {
			count: Store.getNum()
		};
	}

	var dummyComponent = React.createClass({
		render: function() {
			return <span>{this.props.count}</span>;
		}
	});

	beforeEach(function() {
		this.ConnectedComponent = connectToStores([Store], getStateFromStores)(dummyComponent);

		this.RenderedComponent = TestUtils.renderIntoDocument(
			<this.ConnectedComponent />
		);
	});

	afterEach(function(done) {
		count = 0;
		Store.listeners = [];
		done();
	});

	it("#takes 2 arguments - an array of stores & a getState function", function() {
		assert.equal(connectToStores.length, 2);
	});

	it("#returns a function that takes 1 argument - a component", function() {
		assert.equal(connectToStores().length, 1);
	});

	it("#returns a function that returns a wrapper class that is connected to the specified stores", function() {

		assert(Store.listeners.length === 1);
	});

	it("#the wrapper component is stateful, as determined by the getState argument", function() {
		assert(this.RenderedComponent.state);
		assert.equal(this.RenderedComponent.state.count, 1);
		Store.onChange();
		assert.equal(this.RenderedComponent.state.count, 2);
	});

	it("#the wrapper component renders the component passed as an argument with all its state/props", function() {
		var spanComponent = TestUtils.findRenderedDOMComponentWithTag(
			this.RenderedComponent,
			"span"
		);

		var spanElement = React.findDOMNode(spanComponent);

		assert.equal(spanElement.textContent, 1);
		Store.onChange();
		assert.equal(spanElement.textContent, 2);
	});

	it("#the wrapper component disconnects from the specified stores on unmount", function(done) {
		assert.equal(this.RenderedComponent.state.count, 1);
		React.unmountComponentAtNode(document.body);
		setTimeout(function() {
			Store.onChange();
			// assert.equal(Store.listeners.length, 0);
			assert.throws(function() { return this.RenderedComponent.state.count; });
			done();
		}, 0);
	});
});
