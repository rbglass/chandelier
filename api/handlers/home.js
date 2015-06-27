"use strict";
var path = require("path");
var index = path.join(__dirname, "/../../public/index.html");

module.exports = {

	sweethome: function(req, reply) {
		// I think this can be ditched and all we need is statics?
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
