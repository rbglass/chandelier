"use strict";

module.exports = function(obj) {
	var arr = [];

	for (var p in obj) {
		if (typeof +p === "number") {
			arr[+p] = obj[p];
		}
	}
	return arr;
};
