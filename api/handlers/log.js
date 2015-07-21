"use strict";
var users = require("../models/users");

var log = {

	in: function(req, reply) {
		var creds = req.auth.credentials;

		var profile = {
			auth_method : "google",
			email       : creds.profile.raw.email,
			user        : creds.profile.name.first,
			avatar      : creds.profile.raw.picture
		};

		users.getSingle(profile.email, function(err, user) {
			if (err) {
				reply(err);
			} else if (!user) {
				reply("User not found").code(404);
			} else {
				req.auth.session.clear();
				req.auth.session.set(profile);
				reply.redirect("/");
			}
		});
	},

	out: function(req, reply) {
		req.auth.session.clear();
		reply("Succesfully logged out");
	}
};

module.exports = log;
