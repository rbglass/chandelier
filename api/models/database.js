"use strict";
var config = require("../config.js");
var Sequelize = require("sequelize");

//var sequelize = new Sequelize(config.database.dburl, {
//	protocol: "ssl"
//});

var sequelize = new Sequelize(config.database.dbname, config.database.dbuser, config.database.dbpassword, {
	host: "localhost",
	port: 5432,
	dialect: 'postgres'
});

var Users = sequelize.define('users', {});
var Jobs = sequelize.define('jobs', {});
var Job_items = sequelize.define('job_items', {});


module.exports = {
	Users: Users,
	Jobs: Jobs,
	Job_items: Job_items
};
