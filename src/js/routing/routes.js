"use strict";
import React from "react";
import { Route, DefaultRoute } from "react-router";
import App from "../components/App";

export default (
  <Route path="/" handler={App}>
    <DefaultRoute name="jobs" path="/jobs" handler={()=>{}} />
    <Route name="singlejob" path="/jobs/:id" handler={()=>{}} />
  </Route>
);
