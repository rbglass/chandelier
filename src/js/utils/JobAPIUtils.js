"use strict";

export function turnErrorIntoAlert(err) {
	return {
		type: "error",
		message: err.message,
		details: err.response.text
	};
}
