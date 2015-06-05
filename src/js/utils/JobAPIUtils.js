"use strict";

export function turnErrorIntoAlert(err) {
	return {
		code: err.headers["Status-Code"]
	};
}
