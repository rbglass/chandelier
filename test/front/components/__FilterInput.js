"use strict";
var assert = require("assert");
var jsdom = require("jsdom");

global.document = jsdom.jsdom("<html><body></body></html>");
global.window = document.parentWindow;
global.navigator = {
	userAgent: "node.js"
};

describe("FilterInput", function() {
	var React = require("react");
	var TestUtils = require("react/addons").addons.TestUtils;
	var FilterInput = require("../../../src/js/components/common/FilterInput");
});
