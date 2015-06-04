"use strict";

export default function(instance, ...methods) {
	methods.forEach(method => {
		instance[method] = instance[method].bind(instance);
	});
}
