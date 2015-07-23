"use strict";

function render(toRender, html) {
	var rendered;

	Object.keys(toRender).forEach(function(field) {
		var toFind = "#{" + field + "}";
		var toFindRegEx = new RegExp(toFind, "g");

		rendered = html.replace(toFindRegEx, toRender[field]);
	});

	return rendered;
}

module.exports = render;
