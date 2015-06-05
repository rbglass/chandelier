"use strict";

function isDateStr(entity) {
	const dateRegEx = /\d{4}-\d{2}-\d{2}/g;

	if (typeof entity === "string") {
		return dateRegEx.test(entity);
	} else {
		return false;
	}
}

// use tilt
export function contains(obj, term) {
	if(!term) return true;

	const k = Object.keys(obj);

	return k.some(cell => {
		switch (typeof obj[cell]) {
			case "string":
					return obj[cell].includes(term);
			case "number":
					return ("" + obj[cell]).includes("" + term);
			default:
					return false;
		}
	});
}

// Change to Array.prototype method?
// localeCompare w/ datestring correctly?
// use sort table
export function genericSort(arr, sortBy, asc) {

	arr = arr.slice(0);

	return arr.sort((a, b) => {
		let t1 = a[sortBy],
				t2 = b[sortBy],
				sortVal;

		if (isDateStr(t1)) {
			sortVal = Date.parse(t1) - Date.parse(t2);
		} else if (typeof t1 === "string") {
			sortVal = t1.localeCompare(t2, "en", {
				sensitivity: "base"
			});
		} else {
			sortVal = t1 - t2;
		}

		return asc ? sortVal : -sortVal;
	});
}

export function isWithinBounds(obj, lower, upper) {
	const k = Object.keys(obj);
	const lowerAsDate = Date.parse(lower || "1970-01-01");
	const upperAsDate = Date.parse(upper || "3070-01-01");

	return k.some(cell => {
		if(isDateStr(obj[cell])) {
			let d = Date.parse(obj[cell]);
			return lowerAsDate < d && d < upperAsDate;
		} else {
			return false;
		}
	});
}

// Turns an object into an array of objects
// Currently not being used
// todo: immut
export function tilt(obj) {
	return Object.keys(obj).map((e) => {
		return {
			key: e,
			val: obj[e]
		};
	});
}
