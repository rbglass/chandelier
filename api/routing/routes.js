"use strict";

var noRedirect = {
	auth : {
		strategy : "session",
		mode     : "try"
	},
	plugins : {
		"hapi-auth-cookie" :{
			redirectTo : false
		}
	}
};

var google = {
	auth: "google"
};

var session = {
	auth: "session"
};

var home       = require("../handlers/home");
var log        = require("../handlers/log");
var jobs       = require("../handlers/jobs");
var items      = require("../handlers/items");
var products   = require("../handlers/products");
var selections = require("../handlers/selections");

module.exports = ([
	{ path: "/",                  method: "GET",           handler: home.sweethome,   config: noRedirect },
	{	path: "/login",             method: ["GET", "POST"], handler: log.in,           config: google     },
	{	path: "/logout",            method: "GET",           handler: log.out,          config: session    },
	{	path: "/{param*}",          method: "GET",           handler: home.statics      },

	{	path: "/api/jobs",          method: "GET",           handler: jobs.getAll       },
	{	path: "/api/jobs",          method: "POST",          handler: jobs.create       },
	{	path: "/api/jobs/{id}",     method: "GET",           handler: jobs.getSingle    },
	{	path: "/api/jobs/{id}",     method: "PUT",           handler: jobs.update       },

	{	path: "/api/items",         method: "GET",           handler: items.getAll      },
	{	path: "/api/items",         method: "POST",          handler: items.create      },
	{	path: "/api/items/{item}",  method: "PUT",           handler: items.update      },
	{	path: "/api/items/{item}",  method: "DELETE",        handler: items.delete      },

	{	path: "/api/selections",    method: "GET",           handler: selections.getAll },

	{	path: "/api/products",      method: "GET",           handler: products.getAll   },
	{	path: "/api/products",      method: "POST",          handler: products.create   },
	{ path: "/api/products/{id}", method: "PUT",           handler: products.update   },
	{	path: "/api/products/{id}", method: "DELETE",        handler: products.delete   }
]);
