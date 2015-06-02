"use strict";
var config = require("../config.js");
var Sequelize = require("sequelize");
var sequelize = new Sequelize(config.database.dbname, config.database.dbuser, config.database.dbpassword, {
	host: "localhost",
	dialect: 'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

	native: true,
	ssl: true
});

var Users = sequelize.define('users', {});
var Jobs = sequelize.define('jobs', {});
var Job_items = sequelize.define('job_items', {});


module.exports = {
	Users: Users,
	Jobs: Jobs,
	Job_items: Job_items
};
