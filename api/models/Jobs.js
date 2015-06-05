"use strict";
var seqlz = require("./database");
var Sequelize = require("sequelize");

var Jobs = seqlz.define('jobs', {
	job_id: 						Sequelize.INTEGER,
	client: 						Sequelize.STRING,
	project: 						Sequelize.STRING,
	job_status: 				Sequelize.STRING,
	order_type: 				Sequelize.STRING,
	shipping_date: 			Sequelize.DATE,
	num_of_job_items: 	Sequelize.INTEGER,
	parts_status: 			Sequelize.STRING,
	last_update: 				Sequelize.DATE
});

module.exports = Jobs;
