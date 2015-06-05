"use strict";

export default function compose(...fns) {
	return (arr) => {
		return fns.reduce((a, b) => {
			return b.call(null, a);
		}, arr);
	};
}
