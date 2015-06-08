"use strict";
var config    = require("../config.js");
var Sequelize = require("sequelize");

var seqlz = new Sequelize(config.database.dburl, {
	dialect:'postgres',
	ssl: true,
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


module.exports = seqlz;
