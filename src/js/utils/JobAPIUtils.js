"use strict";

export function turnErrorIntoAlert(err) {
	return {
		type: "error",
		message: err.headers["Status-Code"]
	};
}
