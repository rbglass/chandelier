"use strict";

var assert  = require("assert");
var server  = require("../../api/server");
var handler = require("../../api/handler");


describe("/api/jobs", function() {
	describe("authenticated GET", function() {
		it("should reply with a 200 status code", function(done) {

			var options = {
				method  : "GET",
				url     : "/api/jobs",
				handler : handler.getJobsTable,
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

describe("/api/jobs", function() {
	describe("not authenticated GET", function() {
		it("should reply with a 302 status code and redirect to '/'", function(done) {

			var options = {
				method  : "GET",
				url     : "/api/jobs",
				handler : handler.jobs
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


describe("/api/jobs/{id}", function() {
	describe("authenticated GET", function() {
		it("should reply with a 200 status code", function(done) {

			var options = {
				method  : "GET",
				url     : "/api/jobs/rb12",
				handler : handler.jobs,
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

describe("/api/jobs/{id}", function() {
	describe("not authenticated GET", function() {
		it("should reply with a 302 status code and redirect to '/'", function(done) {

			var options = {
				method  : "GET",
				url     : "/api/jobs/rb12",
				handler : handler.jobs
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

describe("/api/jobs/{id}", function() {
	describe("not authenticated POST", function() {
		it("should reply with a 302 redirect status code", function(done) {

			var options = {
				method  : "POST",
				url     : "/api/jobs/rb12",
				handler : handler.jobs
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

describe("/api/jobs/{id}", function() {
	describe("not authenticated PUT", function() {
		it("should reply with a 302 redirect status code", function(done) {

			var options = {
				method  : "PUT",
				url     : "/api/jobs/rb12",
				handler : handler.jobs
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

describe("/api/jobs/{id}", function() {
	describe("not authenticated DELETE", function() {
		it("should reply with a 302 redirect status code", function(done) {

			var options = {
				method  : "DELETE",
				url     : "/api/jobs/rb12",
				handler : handler.jobs
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

