"use strict";
var commands = require("./setup_commands");
var connect = require("../../../api/db");

var jobs = commands.jobs;
var job_items = commands.job_items;
var products = commands.products;
var selections = commands.selections;

module.exports = {

	jobs: function(next) {
		connect(function(err, client, done) {
			if(err) throw (err);

			client.query(jobs.create, function(errC, info) {
				if(errC) throw (errC);
				client.query(jobs.copy, function(errP) {
					if(errP) throw (errP);
					client.query(jobs.seq + jobs.pkeyseq + jobs.clean, function(errS) {
						if(errS) throw (errS);
						done();
						next();
					});
				});
			});
		});
	},

	job_items: function(next) {
		connect(function(err, client, done) {
			if(err) throw (err);

			client.query(job_items.create, function(errC, info) {
				if(errC) throw (errC);
				client.query(job_items.fkey + job_items.copy, function(errP) {
					if(errP) throw (errP);
					client.query(job_items.seq + job_items.pkeyseq + job_items.pkey + job_items.clean, function(errS) {
						if(errS) throw (errS);
						done();
						next();
					});
				});
			});
		});
	},

	products: function(next) {
		connect(function(err, client, done) {
			if(err) throw (err);
			client.query(products.create, function(errC, info) {
				if(errC) throw (errC);
				client.query(products.copy, function(errP) {
					if(errP) throw (errP);
					client.query(products.seq + products.pkeyseq + products.pkey + products.clean, function(errS) {
						if(errS) throw (errS);
						done();
						next();
					});
				});
			});
		});
	},

	selections: function(next) {
		connect(function(err, client, done) {
			if(err) throw (err);
			client.query(selections.create, function(errC, info) {
				if(errC) throw (errC);
				client.query(selections.copy, function(errP) {
					if(errP) throw (errP);
					client.query(selections.seq + selections.pkeyseq + selections.pkey + selections.clean, function(errS) {
						if(errS) throw (errS);
						done();
						next();
					});
				});
			});
		});
	},

	drop: function(next) {
		connect(function(err, client, done) {
			if(err) throw (err);
			client.query(commands.drop.all, function(errJ) {
				if(err) throw (err);
				done();
				next();
			});
		});
	},

	start: function(tableName, done) {
		this.drop(this[tableName].bind(null, done));
	}
};
