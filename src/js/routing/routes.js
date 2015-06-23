"use strict";
import React from "react";
import { Route, DefaultRoute } from "react-router";
import App from "../components/App";
import JobsPage from "../pages/JobsPage";
import SingleJobPage from "../pages/SingleJobPage";
import JobItemsPage from "../pages/JobItemsPage";
import ProductPage from "../pages/ProductPage";

export default (
  <Route path="/" handler={App}>
    <DefaultRoute name="jobs" handler={JobsPage} />
    <Route name="singlejob" path="/jobs/:id" handler={SingleJobPage} />
    <Route name="items" path="/items" handler={JobItemsPage} />
    <Route name="products" path="/products" handler={ProductPage} />
  </Route>
);
