"use strict";
var pg = require("pg");
var config = require("../model/config.js");
var	conString = config.database.dburl;


function connect(query, table) {
	pg.connect(conString, function(err, client, done){
		if(err) {
			return console.error('error fetching client from pool', err);
		}
		query(table, client, done);
	});
}
