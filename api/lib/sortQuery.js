"use strict";

module.exports = function(field, asc) {
	if (!field) throw new Error("Missing arg");

	var sortDir    = asc === "false" ? "DESC" : "ASC";
	var sortString = "ORDER BY " + field + " " + sortDir + " NULLS LAST";

	return sortString;
};
