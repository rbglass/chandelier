"use strict";
var DELIMITER = ", ";

module.exports = function(table, data) {
	if (!table) throw new Error("Missing table");


	var fieldsToInsert, stuff, insertString, valueString;

	if (!data || Object.keys(data).length === 0) {
		return {
			command: "INSERT INTO " + table + " DEFAULT VALUES RETURNING *",
			data: []
		};
	}

	fieldsToInsert = Object.keys(data);
	insertString = "INSERT INTO " + table + " (";
	valueString = "values (";

	stuff = fieldsToInsert.map(function(cell, i) {
		insertString += cell;
		valueString += "$" + (i + 1);

		if (i < fieldsToInsert.length - 1) {
			insertString += DELIMITER;
			valueString += DELIMITER;
		} else {
			insertString += ") ";
			valueString += ") RETURNING *";
		}
		return data[cell];
	});

	return {
		command: insertString + valueString,
		data: stuff
	};
};
