"use strict";

export default function compose(...fns) {
	return arr =>
		fns.reduce((a, b) =>
			b.call(this, a)
		, arr);
}

export function composel(...fns) {
	return arr =>
		fns.reverse().reduce((a, b) =>
			b.call(this, a)
		, arr);
}
