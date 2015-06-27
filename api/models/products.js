"use strict";
var crud = require("./crud");

var productsModel = crud({
	tableName: "products",
	primaryKey: "id",
	defaultSort: "name"
});

module.exports = productsModel;
