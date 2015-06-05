"use strict";

var router = null;

export function set(newRouter) {
	router = newRouter;
}

export function get() {
	return router;
}
