"use strict";

var pg = require("pg");
var config = require("../config.js");

var conString = process.env.DATABASE_URL || config.database.dburl;
var client = new pg.Client(conString);
client.connect();

// var query = client.query("CREATE TABLE users(id SERIAL PRIMARY KEY, email VARCHAR(40))");
// query.on("end", function() {
// 	console.log("table created");
// 	client.end();
// });


// var client = function() {
// 	pg.connect(conString, function(err, cli, done) {
// 		if(err) {
// 			return console.error("error fetching client from pool", err);
// 		}
// 		console.log("pg client connected");
// 	});
// };

// module.exports = {

// 	query: function(text, values, cb) {
// 		pg.connect(function(err, client, done) {
// 			client.query(text, values, function(err, result) {
// 				done();
// 				cb(err, result);
// 			});
// 		});
// 	}

// };
