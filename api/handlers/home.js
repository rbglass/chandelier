"use strict";
var path = require("path");
var index = path.join(__dirname, "/../../public/index.html");

module.exports = {

	sweethome: function(req, reply) {
		var loggedIn = req.auth.isAuthenticated;

		if (loggedIn) reply.file(index);
		else          reply.redirect("/login");
	},

	statics: {
		directory : {
			path  : path.join(__dirname, "/../../public"),
			index : false
		}
	}

};
