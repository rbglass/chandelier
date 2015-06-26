"use strict";
var connect = require("../db");

module.exports = {

	getSingle: function(email, cb) {
		var queryString = "SELECT * FROM users WHERE email=($1)";

		connect(function(err, client, done) {
			if (err) return cb(err);

			client.query(queryString, [email], function(errGet, info) {
				if (errGet) {
					cb(errGet);
				} else if (info.rows.length < 1) {
					cb("Authentication needed");
				} else {
					cb(null, info.rows[0]);
				}
			});
		});
	}
};
