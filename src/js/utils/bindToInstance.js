"use strict";

export default function(instance, ...methods) {
	methods.forEach(method => {
		if (typeof instance[method] === "function") {
			instance[method] = instance[method].bind(instance);
		}
	});
}
