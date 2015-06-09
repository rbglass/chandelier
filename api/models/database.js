"use strict";

var config    = require("../config.js");
// var Sequelize = require("sequelize");
var pg = require("pg");
var conString = "";

// var seqlz = new Sequelize(config.localdb.localdburl, {
// 	dialect:"postgres",
// 	define: {
// 			timestamps: true,
// 			updatedAt: "updatedat",
// 			createdAt: "createdat"
// 	}
// });

//var sequelize = new Sequelize(config.database.dbname, config.database.dbuser, config.database.dbpassword, {
////	"host": "127.0.0.1",
//	"dialect": "postgres",
//	"port": 5432
//});

var client = function() {
	pg.connect(conString, function(err, cli, done) {
		if(err) {
			return console.error("error fetching client from pool", err);
		}
		console.log("pg client connected");
	});
};

module.exports = client;
