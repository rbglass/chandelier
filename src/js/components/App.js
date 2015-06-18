"use strict";
import React, { Component } from "react";
import { RouteHandler } from "react-router";

var Perf = window.Perf = require("react/addons").addons.Perf;

Perf.start();

export default class App extends Component {
	render() {
		return <RouteHandler />;
	}
}

