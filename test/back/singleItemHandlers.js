"use strict";

var assert  = require("assert");
var server  = require("../../api/server");
var handler = require("../../api/handler");


describe("/api/jobs/{id}/{item}", function() {
	describe("not authenticated GET", function() {
		it("should reply with a 403 forbidden status code", function(done) {

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

describe("/api/jobs/{id}/{item}", function() {
	describe("not authenticated PUT", function() {
		it("should reply with a 403 forbidden status code", function(done) {

			var options = {
				method  : "PUT",
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

describe("/api/jobs/{id}/{item}", function() {
	describe("not authenticated DELETE", function() {
		it("should reply with a 403 forbidden status code", function(done) {

			var options = {
				method  : "DELETE",
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
