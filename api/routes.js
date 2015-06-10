"use strict";

var path = require("path");

var handler = require("./handler");
var server  = require("./server");


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
    handler : handler.createJob
  },

  {
    path    : "/api/jobs/{id}",
    method  : "PUT",
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

 // --------------------------------- \\

  {
    path    : "/api/jobs/{id}/{item}",
    method  : "GET",
    handler : handler.getJobItems
  },

  {
		path    : "/api/jobs/{id}",
		method  : "POST",
		handler : handler.createJobItem
  },

  {
    path    : "/api/jobs/{id}/{item}",
    method  : "PUT",
    handler : handler.updateJobItems
  },

  {
    path    : "/api/jobs/{id}/{item}",
    method  : "DELETE",
    handler : handler.deleteJobItems
  },

// ---------------------------------- \\

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
      handler : handler.logout,
      auth    : "session"
    }
  }

]);
