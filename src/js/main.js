"use strict";
import React from 'react';
import { Router } from "react-router";
import routes from "./routing/routes";

const rootEl = document.getElementById('content');
Router.run(routes, Router.HistoryLocation, (Handler) =>
  React.render(<Handler />, rootEl)
);

