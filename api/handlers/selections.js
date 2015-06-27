"use strict";
var selections = require("../models/selections");
var crud       = require("./crud");

var selectionsHandler = crud(selections);

module.exports = selectionsHandler;
