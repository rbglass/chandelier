// https://github.com/robertknight/react-testing
"use strict";
import I from "immutable";
import assert from "assert";

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


export function stubRouterContext(Component, props, stubs) {

	var React = require("react");
  function RouterStub() { }

  Object.assign(RouterStub, {
    makePath () {},
    makeHref () {},
    transitionTo () {},
    replaceWith () {},
    goBack () {},
    getCurrentPath () {},
    getCurrentRoutes () {},
    getCurrentPathname () {},
    getCurrentParams () {},
    getCurrentQuery () {},
    isActive () {},
    getRouteAtDepth() {},
    setRouteComponentAtDepth() {}
  }, stubs);

  return React.createClass({
    childContextTypes: {
      router: React.PropTypes.func,
      routeDepth: React.PropTypes.number
    },

    getChildContext () {
      return {
        router: RouterStub,
        routeDepth: 0
      };
    },

    render () {
      return <Component {...props} />;
    }
  });
}

export function sameVal(first, second) {
	return assert(I.is(first, second));
}
