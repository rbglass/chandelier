"use strict";

var path = require("path");

var handler = require("./handler");
var server  = require("./server");


module.exports =([

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
        path  : path.resolve(__dirname + "/../src"),
        index : false
      }
    }
  },


  // API routes
  //--------------------------------

  {
    path    : "/api/jobs",
    method  : "GET",
    handler : handler.findJobs
  },

  {
    path    : "/api/jobs",
    method  : "POST",
    handler : handler.addJob
  },

// --------------------------------- \\

  {
    path    : "/api/jobs/{id}",
    method  : "GET",
    handler : handler.findSingleJob
  },

  {
    path    : "/api/jobs/{id}",
    method  : "POST",
    handler : handler.createSingleJob
  },

  {
    path    : "/api/jobs/{id}",
    method  : "PUT",
    handler : handler.updateSingleJob
  },

  {
    path    : "/api/jobs/{id}",
    method  : "DELETE",
    handler : handler.removeSingleJob
  },

 // --------------------------------- \\

  {
    path    : "/api/jobs/{id}/{item}",
    method  : "GET",
    handler : handler.findSingleItem
  },

  {
    path    : "/api/jobs/{id}/{item}",
    method  : "PUT",
    handler : handler.updateSingleItem
  },

  {
    path    : "/api/jobs/{id}/{item}",
    method  : "DELETE",
    handler : handler.removeSingleItem
  },

// ---------------------------------- \\

  // Authentication routes
  {
    path   : "/login",
    method : ["GET", "POST"],
    config : {
      auth    : "google",
      handler : handler.login,
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
