"use strict";
import React from "react";
import Router from "react-router";
import routes from "./routing/routes";
import * as RouterContainer from "./routing/RouterContainer";

const rootEl = document.getElementById("content");

RouterContainer.set(Router.create({
	routes: routes,
	location: Router.HashLocation
}));

RouterContainer.get().run(Handler =>
  React.render(<Handler />, rootEl)
);
