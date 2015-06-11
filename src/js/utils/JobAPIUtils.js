"use strict";

export function turnErrorIntoAlert(err) {
	console.log(err);
	return {
		type: "error",
		message: err.status,
		details: err.message
	};
}
