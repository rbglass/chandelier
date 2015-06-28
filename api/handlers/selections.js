"use strict";
var selections = require("../models/selections");
var crud       = require("../lib/crudHandlers");

var selectionsHandler = crud(selections);

module.exports = selectionsHandler;
