"use strict";
import I from "immutable";
import { isyyyyMMdd } from "./yyyyMMdd";

// string.includes is playing up
function strIncludes(str, term) {
	return typeof term === "string" ?
		str.toLowerCase().indexOf(term.toLowerCase()) !== -1 :
		false;
}

export function contains(map, term) {
	if(term === "" || term === undefined) return true;

	const k = map.keySeq();

	return k.some(cell => {
		switch (typeof map.get(cell)) {
			case "string":
					return strIncludes(map.get(cell), term);
			case "number":
					return strIncludes("" + map.get(cell), "" + term);
			case "boolean":
					return map.get(cell) === term;
			default:
					return false;
		}
	});
}

export function genericSort(list, sortBy, asc, sortPath) {

	return list.sort((a, b) => {
		// ugly hack
		let t1 = sortPath ? a.getIn([sortPath, sortBy]) : a.get(sortBy),
				t2 = sortPath ? b.getIn([sortPath, sortBy]) : b.get(sortBy),
				sortVal;

		if (isyyyyMMdd(t1) || isyyyyMMdd(t2)) {
			let date1 = Date.parse(t1) || 0;
			let date2 = Date.parse(t2) || 0;
			sortVal = date1 - date2;
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

export function isWithinBounds(field, lower, upper) {
	if(lower === "" && upper === "") return true;

	const lowerAsDate = Date.parse(lower || "1970-01-01");
	const upperAsDate = Date.parse(upper || "3070-01-01");

	if(isyyyyMMdd(field)) {
		let d = Date.parse(field);
		return lowerAsDate <= d && d <= upperAsDate;
	} else {
		return false;
	}
}

export function restrictTo(obj, restrictionObj) {
	const restrictBy = restrictionObj.keySeq();
	return restrictBy.every(field => {
		const hasOptionsForField = restrictionObj.hasIn([field, "options"]);
		return (
			(!hasOptionsForField ||
			restrictionObj.getIn([field, "options"]).includes(obj.get(field)))
		);
	});
}
