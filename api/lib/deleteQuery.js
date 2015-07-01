"use strict";

module.exports = function(table, id, idField) {
	if (!table || !id || !idField) {
		throw new Error("Missing arg");
	}

	return {
		command: "DELETE FROM " + table +  " WHERE " + idField + "=($1)",
		data: [id]
	};
};
