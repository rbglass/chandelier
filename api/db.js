"use strict";

var pg = require("pg");
var config = require("./config.js");

var conString, client;

if (process.env.NODE_ENV === "production") {
	conString = process.env.DATABASE_URL || config.database.dburl;
} else {
	conString = config.localdb.localdburl;
}

client = new pg.Client(conString);
client.connect();

module.exports = conString;
