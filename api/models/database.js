"use strict";
var config    = require("../config.js");
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


var Jobs = sequelize.define('jobs', {});
var Job_items = sequelize.define('job_items', {});


module.exports = {
	Users: Users,
	Jobs: Jobs,
	Job_items: Job_items
};
