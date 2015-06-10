"use strict";

var pg = require("pg");
var config = require("../config.js");

var conString = process.env.DATABASE_URL || config.database.dburl;
var client = new pg.Client(conString);
client.connect();

// var localConString = config.database.localdburl;
// var client = new pg.Client(localConString);
// client.connect();

// };
