"use strict";

function capitaliseFirstOf(word) {
	return word[0].toUpperCase().concat(word.slice(1));
}

export default function tidy(str) {
	return str.replace("_", " ").split(" ").map(word => capitaliseFirstOf(word)).join(" ");
}
