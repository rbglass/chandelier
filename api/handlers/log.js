"use strict";
var pg         = require("pg");
var conStr     = require("../db");

module.exports = {

	in: function(req, reply) {
		var creds = req.auth.credentials;

		var profile = {
			auth_method : "google",
			email       : creds.profile.raw.email
		};

		pg.connect(conStr, function(err, client, done) {
			var results = [];

			if (err) {
				done();
				console.log("login error: ", err);
			}

			var query = client.query("SELECT * FROM users WHERE email=($1)", [profile.email]);

			query.on("row", function(row){
				results.push(row);
			});

			query.on("end", function() {
				done();
				if (results.length > 0) {
					req.auth.session.clear();
					req.auth.session.set(profile);
					return reply.redirect("/");
				} else if (results.length <= 0) {
					return reply("You must be an authenticated user to use this application.");
				}
			});
		});
	},

	out: function(req, reply) {
		req.auth.session.clear();
		reply("Succesfully logged out");
	}
};
