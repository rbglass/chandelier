"use strict";
var products = require("../models/products");
var crud     = require("./crud");

var productsHandler = crud(products);

module.exports = productsHandler;
