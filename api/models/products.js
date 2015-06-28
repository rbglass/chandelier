"use strict";
var schema = require("./schema");
var crud   = require("../lib/crudModel");

var productsModel = crud({
	tableName: "products",
	primaryKey: "id",
	defaultSort: "name",
	schema: schema.products
});

module.exports = productsModel;
