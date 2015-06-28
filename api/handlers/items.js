"use strict";
var jobitems = require("../models/jobitems");
var crud     = require("../lib/crudHandlers");

var itemsHandler = crud(jobitems);

module.exports = itemsHandler;
