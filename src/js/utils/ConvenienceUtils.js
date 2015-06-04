"use strict";

export function contains(obj, term) {
	const k = Object.keys(obj);

	const hasTerm = k.some((prop) => {
		switch (typeof obj[prop]) {
			case "string":
					return obj[prop].includes(term);
			case "number":
					return ("" + obj[prop]).includes("" + term);
			default:
					return false;
		}
	});

	return hasTerm;
}

export function genericSort(arr, sortBy, asc) {

	arr = arr.slice(0);

	return arr.sort((a, b) => {
		let t1 = a[sortBy],
				t2 = b[sortBy];

		if(typeof t1 === "string") {
			t1 = t1.toLowerCase;
			t2 = t2.toLowerCase;
		}
		return asc ? t1 - t2 : t1 - t2;
	});
}

// Turns an object into an array of objects
// todo: immut
export function tilt(obj) {
	return Object.keys(obj).map((e) => {
		return {
			key: e,
			val: obj[e]
		};
	});
}
