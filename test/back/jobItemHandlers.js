"use strict";

var assert  = require("assert");
var server  = require("../../api/server");
var handler = require("../../api/handler");


describe("/api/jobs/{id}/{item}", function() {
	describe("authenticated GET", function() {
		it("should reply with a 200 status code", function(done) {

			var options = {
				method  : "GET",
				url     : "/api/jobs/3003",
				handler : handler.getJobItems,
				credentials : {
					isAuthenticated : true
				}
			};

			server.inject(options, function(res) {
				assert.equal(200, res.statusCode);
				assert.equal(true, res.request.auth.isAuthenticated);
				done();
			});
		});
	});
});

describe("/api/jobs/{id}/{item}", function() {
	describe("not authenticated GET", function() {
		it("should reply with a 302 status code and redirect to '/'", function(done) {

			var options = {
				method  : "GET",
				url     : "/api/jobs/3003/lamp",
				handler : handler.jogetJobItemsbs
			};

			server.inject(options, function(res) {
				assert.equal(302, res.statusCode);
				assert.equal(false, res.request.auth.isAuthenticated);
        assert.equal("/", res.headers.location);
				done();
			});
		});
	});
});

describe("/api/jobs/{id}/{item}", function() {
	describe("not authenticated PUT", function() {
		it("should reply with a 302 redirect status code", function(done) {

			var options = {
				method  : "PUT",
				url     : "/api/jobs/3012",
				handler : handler.getJobItems
			};

			server.inject(options, function(res) {
				assert.equal(302, res.statusCode);
				assert.equal(false, res.request.auth.isAuthenticated);
        assert.equal("/", res.headers.location);
				done();
			});
		});
	});
});

describe("/api/jobs/{id}/{item}", function() {
	describe("not authenticated DELETE", function() {
		it("should reply with a 302 redirect status code", function(done) {

			var options = {
				method  : "DELETE",
				url     : "/api/jobs/3012/lamp",
				handler : handler.getJobItems
			};

			server.inject(options, function(res) {
				assert.equal(302, res.statusCode);
				assert.equal(false, res.request.auth.isAuthenticated);
        assert.equal("/", res.headers.location);
				done();
			});
		});
	});
});
