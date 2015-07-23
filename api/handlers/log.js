"use strict";
var path  = require("path");
var fs    = require("fs");
var page  = path.join(__dirname, "/../../public/logout.html");
var users = require("../models/users");
var render = require("../utils/render");

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
		var user = req.auth.credentials.user;

		req.auth.session.clear();

		fs.readFile(page, "UTF-8", function(err, contents) {
			if (err) {
				reply(err);
			} else {
				reply(render({user: user}, contents));
			}
		});
	}
};

module.exports = log;
