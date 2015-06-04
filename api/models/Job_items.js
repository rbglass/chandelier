"use strict";
var seqlz = require("./database");
var Sequelize = require("sequelize");

var Job_items = seqlz.define('job_items', {
	item_id: 			Sequelize.STRING,
	product: 			Sequelize.STRING,
	description: 	Sequelize.STRING,
	glass: 				Sequelize.STRING,
	metal: 				Sequelize.STRING,
	flex: 				Sequelize.STRING,
	bulb: 				Sequelize.STRING,
	qty_req: 			Sequelize.INTEGER,
	qty_hot: 			Sequelize.INTEGER,
	qty_cold: 		Sequelize.INTEGER,
	qty_assem: 		Sequelize.INTEGER,
	qty_packed: 	Sequelize.INTEGER,
	notes: 				Sequelize.STRING
});

module.exports = Job_items;
