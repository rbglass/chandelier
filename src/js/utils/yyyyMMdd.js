"use strict";

export function isyyyyMMdd(entity) {
	const dateRegEx = /\d{4}-\d{2}-\d{2}/g;

	if (typeof entity === "string") {
		return dateRegEx.test(entity);
	} else {
		return false;
	}
}
export default function yyyyMMdd(validDate) {
	if(!validDate) {
		return null;
	} else if (isyyyyMMdd(validDate)) {
		return validDate.slice(0, 10);
	} else {
		return validDate.toISOString().slice(0, 10);
	}
}
