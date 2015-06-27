"use strict";
var jobitems = require("../models/jobitems");
var crud     = require("./crud");

var itemsHandler = crud(jobitems);

module.exports = itemsHandler;
