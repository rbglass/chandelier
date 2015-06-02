"use strict";

var assert  = require("assert");
var server  = require("../../api/server");
var handler = require("../../api/handler");

describe("/", function() {
  describe("not authenticated GET", function() {
    it("should reply with a redirect to /login", function(done) {

      var options = {
        method  : "GET",
        url     : "/",
        handler : handler.home
      };

      server.inject(options, function(res) {
        assert.equal(302, res.statusCode);
        assert.equal(false, res.request.auth.isAuthenticated);
        assert.equal("/login", res.headers.location);
        done();
      });
    });
  });
});

describe("/", function() {
  describe("authenticated GET", function() {
    it("should reply with the index.html file", function(done) {

      var options = {
        method  : "GET",
        url     : "/",
        handler : handler.home,
        credentials : {
          isAuthenticated : true
        }
      };

      server.inject(options, function(res) {
        assert.equal(true, res.request.auth.isAuthenticated);
        assert.equal(200, res.statusCode);
        assert.notEqual(-1, res.payload.indexOf('src="/js/main.js"></script>'));
        done();
      });
    });
  });
});


describe("/api/jobs", function() {
  describe("not authenticated GET", function() {
    it("should reply with a 403 forbidden status code", function(done) {

      var options = {
        method  : "GET",
        url     : "/api/jobs",
        handler : handler.jobs
      };

      server.inject(options, function(res) {
        assert.equal(403, res.statusCode);
        assert.equal(false, res.request.auth.isAuthenticated);
        done();
      });
    });
  });
});


describe("/api/jobs/{id}", function() {
  describe("not authenticated GET", function() {
    it("should reply with a 403 forbidden status code", function(done) {

      var options = {
        method  : "GET",
        url     : "/api/jobs/rb12",
        handler : handler.jobs
      };

      server.inject(options, function(res) {
        assert.equal(403, res.statusCode);
        assert.equal(false, res.request.auth.isAuthenticated);
        done();
      });
    });
  });
});

describe("/api/jobs/{id}/{item}", function() {
  describe("not authenticated GET", function() {
    it("should reply with a 403 forbidden status code redirect to the home page", function(done) {

      var options = {
        method  : "GET",
        url     : "/api/jobs/rb12/itemA",
        handler : handler.jobs
      };

      server.inject(options, function(res) {
        assert.equal(403, res.statusCode);
        assert.equal(false, res.request.auth.isAuthenticated);
        done();
      });
    });
  });
});


