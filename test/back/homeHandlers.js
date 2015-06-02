"use strict";

var assert  = require("assert");
var server  = require("../../api/server");
var handler = require("../../api/handler");


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
        assert.equal("text/html; charset=utf-8", res.headers["content-type"]);
        assert.notEqual(-1, res.payload.indexOf('src="/js/main.js"></script>'));
        done();
      });
    });
  });
});


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

