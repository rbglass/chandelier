"use strict";
var formatter = require("../utils/formatter");
var crud      = require("../lib/crud");

var selectionsModel = crud({
	tableName: "selections",
	defaultSort: "rank",
	formatterM: formatter.products
});

module.exports = selectionsModel;
