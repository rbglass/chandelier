"use strict";
var products = require("../models/products");
var crud     = require("../lib/crudHandlers");

var productsHandler = crud(products);

module.exports = productsHandler;
