"use strict";
var config = require("../config.js");
var Sequelize = require("sequelize");

var sequelize = new Sequelize(config.localdb.localdburl, {
	dialect:'postgres',
	define: {
			timestamps: true,
			updatedAt: 'updatedat',
			createdAt: 'createdat'
	}
});

//var sequelize = new Sequelize(config.database.dbname, config.database.dbuser, config.database.dbpassword, {
////	"host": "127.0.0.1",
//	"dialect": "postgres",
//	"port": 5432
//});

var Users = sequelize.define("users", {
		email: Sequelize.STRING
});


var Jobs = sequelize.define('jobs', {
	job_id: 						Sequelize.STRING,
	client: 						Sequelize.STRING,
	project: 						Sequelize.STRING,
	job_status: 				Sequelize.STRING,
	order_type: 				Sequelize.STRING,
	shipping_date: 			Sequelize.DATE,
	num_of_job_items: 	Sequelize.INT,
	parts_status: 			Sequelize.STRING,
	last_update: 				Sequelize.DATE
});


var Job_items = sequelize.define('job_items', {
	item_id: 			Sequelize.STRING,
	product: 			Sequelize.STRING,
	description: 	Sequelize.STRING,
	glass: 				Sequelize.STRING,
	metal: 				Sequelize.STRING,
	flex: 				Sequelize.STRING,
	bulb: 				Sequelize.STRING,
	qty_req: 			Sequelize.INT,
	qty_hot: 			Sequelize.INT,
	qty_cold: 		Sequelize.INT,
	qty_assem: 		Sequelize.INT,
	qty_packed: 	Sequelize.INT,
	notes: 				Sequelize.STRING
});


module.exports = {
	Users: 			Users,
	Jobs: 			Jobs,
	Job_items: 	Job_items
};
