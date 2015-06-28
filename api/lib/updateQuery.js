"use strict";
var DELIMITER = ", ";

module.exports = function(table, id, idField, data) {
	if (!table || !id || !idField || !data) {
		throw new Error("Missing arg");
	}

	var fieldsToUpdate, stuff, updateString;

	fieldsToUpdate = Object.keys(data);
	updateString = "UPDATE " + table + " SET ";

	stuff = fieldsToUpdate.map(function(cell, i) {

		updateString += cell + "=($" + (i + 2) + ")";

		if (i < fieldsToUpdate.length - 1) {
			updateString += DELIMITER;
		} else {
			updateString += " WHERE " + idField + "=($1) RETURNING *";
		}
		return data[cell];
	});

	return {
		command: updateString,
		data: [id].concat(stuff)
	};
};
