"use strict";
var selections = require("../models/selections");
var formatter  = require("../utils/formatter");

module.exports = {

	getAll: function(req, reply) {
		selections.getAll(null, function(err, allSelections) {
			if (err) reply(err).code(400);
			else     reply(formatter.products(allSelections));
		});
	}

};
