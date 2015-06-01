var pg = require("pg");
var	conString = require("../creds.json").database;


function connect(query, table) {
	pg.connect(conString, function(err, client, done){
		if(err) {
			return console.error('error fetching client from pool', err);
		}
		query(table, client, done);
	});
}
