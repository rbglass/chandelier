"use strict";
var seqlz = require("./database");
var Sequelize = require("sequelize");

var Users = seqlz.define("users", {
		email: Sequelize.STRING
});

module.exports = Users;
