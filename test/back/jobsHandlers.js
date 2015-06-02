"use strict";

var assert  = require("assert");
var server  = require("../../api/server");
var handler = require("../../api/handler");


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

describe("/api/jobs", function() {
	describe("not authenticated POST", function() {
		it("should reply with a 403 forbidden status code", function(done) {

			var options = {
				method  : "POST",
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

