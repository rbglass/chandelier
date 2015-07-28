"use strict";

module.exports = function(field, asc, fieldForGrouping) {
	if (!field) throw new Error("Missing arg");

	var sortDir    = asc === "false" ? "DESC" : "ASC";
	var sortString = "ORDER BY " + field + " " + sortDir + " NULLS LAST";

	if (fieldForGrouping && fieldForGrouping !== field) {
		sortString += ", " + fieldForGrouping + " ASC NULLS LAST";
	}

	return sortString;
};
