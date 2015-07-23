"use strict";

var profile = {
	get: function(req, reply) {
		var creds = req.auth.credentials;

		reply({
			user: creds.user,
			avatar: creds.avatar
		});
	}
};

module.exports = profile;
