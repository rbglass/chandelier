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
	let date;

	if (!validDate) {
		return "";
	} else if (isyyyyMMdd(validDate)) {
		date = validDate;
	} else {
		date = validDate.toISOString();
	}

	return date.slice(0, 10);
}

export function ddMMyyyy(validDate) {
	let date;

	if (!validDate) {
		return "";
	} else if (isyyyyMMdd(validDate)) {
		date = validDate;
	} else {
		date = validDate.toISOString();
	}

	return `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)}`;
}

export function ddMMMyyyy(validDate) {
	const dates = [
		"Jan", "Feb", "Mar", "Apr", "May", "June",
		"July", "Aug", "Sep", "Oct", "Nov", "Dec"
	];
	let date;

	if (!validDate) {
		return "";
	} else if (isyyyyMMdd(validDate)) {
		date = validDate.slice(0, 10);
	} else {
		date = validDate;
	}

	date = new Date(date);
	const dOrdd = date.getDate();
	const dd = `${dOrdd}`.length < 2 ? "0" + dOrdd : dOrdd;

	return `${dd} ${dates[date.getMonth()]} ${date.getFullYear()}`;
}
