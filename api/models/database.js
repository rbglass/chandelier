"use strict";
var config    = require("../config.js");
var Sequelize = require("sequelize");
//var Jobs = require("./Jobs");
//var Job_items = require("./Job_items");

var seqlz = new Sequelize(config.localdb.localdburl, {
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

//Jobs.belongsToMany(Job_items, {through: 'Orders'});
//Job_items.belongsToMany(Jobs, {through: 'Orders'});


module.exports = seqlz;
