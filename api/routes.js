"use strict";

var path = require("path");

var handler = require("./handler");
var server  = require("./server");
var users		= require("./models/schema_validation");
var jobs		= require("./models/schema_validation");
var job_items		= require("./models/schema_validation");

module.exports = ([

  {
    path    : "/",
    method  : "GET",
    config  : {
      auth : {
        strategy : "session",
        mode     : "try"
      },
      handler : handler.home,
      plugins : {
        "hapi-auth-cookie" :{
          redirectTo : false
        }
      }
    }
  },

  {
    path    : "/{param*}",
    method  : "GET",
    handler : {
      directory : {
        path  : path.join(__dirname, "/../public"),
        index : false
      }
    }
  },


  // API routes
  //--------------------------------

  {
    path    : "/api/jobs",
    method  : "GET",
    handler : handler.getJobsTable
  },

// --------------------------------- \\

  {
    path    : "/api/jobs",
    method  : "POST",
		config: {
			validate : {
				jobs: jobs
			}
		},
    handler : handler.createJob
  },

  {
    path    : "/api/jobs/{id}",
    method  : "PUT",
			config: {
			validate : {
				jobs: jobs
			}
		},
    handler : handler.updateJob
  },

  {
    path    : "/api/jobs/{id}",
    method  : "DELETE",
    handler : handler.deleteJob
  },

  {
    path    : "/api/jobs/{id}",
    method  : "GET",
    handler : handler.getSingleJob
  },

 // --------------------------------- \\

	{
		path    : "/api/items",
		method  : "GET",
		handler : handler.getJobItemsTable
	},

  {
		path    : "/api/items",
		method  : "POST",
			config: {
			validate : {
				job_items: job_items
			}
		},
		handler : handler.createJobItem
  },

  // {
  //   path    : "/api/jobs/{id}",
  //   method  : "GET",
  //   handler : handler.getJobItems
  // },

  {
    path    : "/api/items/{item}",
    method  : "PUT",
			config: {
			validate : {
				job_items: job_items
			}
		},
    handler : handler.updateJobItem
  },

  {
    path    : "/api/items/{item}",
    method  : "DELETE",
    handler : handler.deleteJobItem
  },

// ---------------------------------- \\

	{
		path 		: "/api/selections",
		method 	: "GET",
		handler : handler.getSelections
	},

	{
		path		: "/api/selections",
		method  : "POST",
		handler : handler.createSelection
	},

	// ---------------------------------- \\

	{
		path		: "/api/products",
		method  : "GET",
		handler : handler.getProductsTable
	},

	{
		path		: "/api/products",
		method  : "POST",
		handler : handler.createProduct
	},

		{
		path		: "/api/products/{id}",
		method  : "PUT",
		handler : handler.updateProduct
	},

	{
		path		: "/api/products/{id}",
		method  : "DELETE",
		handler : handler.deleteProduct
	},

		// ---------------------------------- \\

	{
		path 		: "/api/contacts",
		method  : "GET",
		handler : handler.getContactsTable
	},

	{
		path 		: "/api/contacts",
		method  : "POST",
		handler : handler.createContact
	},

	{
		path 		: "/api/contacts",
		method  : "UPDATE",
		handler : handler.updateContact
	},

	{
		path 		: "/api/contacts",
		method  : "DELETE",
		handler : handler.deleteContact
	},

  // Authentication routes

  {
    path   : "/login",
    method : ["GET", "POST"],
    config : {
      auth    : "google",

      handler : handler.login
    }
  },

  {
    path    : "/logout",
    method  : "GET",
    config  : {
			validate: {
				users: users
			},
      handler : handler.logout,
      auth    : "session"
    }
  }

]);
