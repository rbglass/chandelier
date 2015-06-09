// https://github.com/robertknight/react-testing
"use strict";

export function withContainer(callback) {
	if (typeof document === "undefined") {
		throw new Error("DOM environment has not been set up");
	}

	var ExecutionEnvironment = require("react/lib/ExecutionEnvironment");
	if (!ExecutionEnvironment.canUseDOM) {
		throw new Error("document or window was not set up when React detected its environment");
	}

	var React = require("react");

	let testElement = document.getElementById("app");
	if (!testElement) {
		testElement = document.createElement("div");
		testElement.id = "app";
		document.body.appendChild(testElement);
	}

	testElement.innerHTML = "";
	callback(testElement);
	React.unmountComponentAtNode(testElement);
}
