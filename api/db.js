"use strict";

var pg = require("pg");
var config = require("./config.js");

var conString, client;

if (process.env.NODE_ENV === "production") {
	conString = process.env.DATABASE_URL || config.database.dburl;
} else if (process.env.NODE_ENV === "test") {
	conString = process.env.TEST_URL;
} else {
	conString = process.env.DEV_URL || config.localdb.localdburl;
}

client = new pg.Client(conString);
client.connect();
console.log(conString);

module.exports = function(cb) {
	pg.connect(conString, function(err, cl, done) {
		if (err) {
			done();
			cb(err);
		} else {
			cb(null, cl, done);
		}
	});
};
