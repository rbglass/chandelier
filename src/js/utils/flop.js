"use strict";

export default function flop(arrOfObjects, termToSurvive) {
	return arrOfObjects.map(obj => {
		return obj[termToSurvive]
	});
}
