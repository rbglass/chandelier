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

		it("should reply with an array of results", function(done) {

			var options = {
				method  : "GET",
				url     : "/api/jobs",
				handler : handler.getJobsTable,
				credentials : {
					isAuthenticated : true
				}
			};

			server.inject(options, function(res) {
				assert.equal("[object Array]", Object.prototype.toString.call(res.result));
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
				url     : "/api/jobs/3012",
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

		it("should reply with an array of results", function(done) {

			var options = {
				method  : "GET",
				url     : "/api/jobs/3012",
				handler : handler.jobs,
				credentials : {
					isAuthenticated : true
				}
			};

			server.inject(options, function(res) {
				assert.equal("[object Array]", Object.prototype.toString.call(res.result));
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
				url     : "/api/jobs/3012",
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
				url     : "/api/jobs/3012",
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
	describe("authenticated PUT", function() {

		var options = {
			method  : "PUT",
			url     : "/api/jobs/3003",
			payload : {
				job_status : "pending"
			},
			handler : handler.jobs,
			credentials : {
				isAuthenticated : true
			}
		};

		it("should reply with a 200 status code", function(done) {

			server.inject(options, function(res) {
				assert.equal(200, res.statusCode);
				assert.equal(true, res.request.auth.isAuthenticated);
				done();
			});
		});

		it("should reply with the single updated object, in JSON form", function(done) {

			server.inject(options, function(res) {
				assert.equal("[object Array]", Object.prototype.toString.call(JSON.parse(res.payload)));
				assert.equal("[object String]", Object.prototype.toString.call(res.payload));
				assert.equal(1, res.result.length);
				assert.equal(options.payload.job_status, res.result[0].job_status);
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
				url     : "/api/jobs/3012",
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
				url     : "/api/jobs/3012",
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

