"use strict";

export default function isUsefulTag(tag) {
	let isItUseful;

	switch (tag.toLowerCase()) {

		case "select":
			isItUseful = true;
			break;

		case "input":
			isItUseful = true;
			break;

		case "textarea":
			isItUseful = true;
			break;

		case "option":
			isItUseful = true;
			break;

		default:
			isItUseful = false;
			break;
	}

	return isItUseful;
}
