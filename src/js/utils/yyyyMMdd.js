"use strict";

export default function yyyyMMdd(validDate) {
	return validDate.toISOString().slice(0, 10);
}
