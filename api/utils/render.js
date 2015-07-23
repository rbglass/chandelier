"use strict";

function render(toRender, html) {
	var rendered = html;

	Object.keys(toRender).forEach(function(field) {
		var toFind = "#{" + field + "}";
		var toFindRegEx = new RegExp(toFind, "g");
		rendered = rendered.replace(toFindRegEx, toRender[field]);
	});

	return rendered;
}

module.exports = render;
