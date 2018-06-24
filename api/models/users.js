"use strict";
var connect = require("../db");

module.exports = {

	getSingle: function(email, cb) {
		var queryString = "SELECT * FROM users WHERE email=($1)";

		connect(function(err, client, done) {
			if (err) return cb(err);

			client.query(queryString, [email], function(errGet, info) {
				console.log(errGet);
				console.log(info);
				if (errGet) {
					cb(errGet);
				} else {
					cb(null, info.rows[0]);
				}
			});
		});
	}
};
