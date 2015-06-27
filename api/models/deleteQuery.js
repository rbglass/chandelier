"use strict";

module.exports = function(table, idField) {
	if (!table || !idField) {
		throw new Error("Missing arg");
	}

	return "DELETE FROM " + table +  " WHERE " + idField + "=($1)";
};
