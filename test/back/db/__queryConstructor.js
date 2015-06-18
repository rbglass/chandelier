// "use strict";
// var assert = require("assert");
// var qC = require("../../../api/models/queryConstructor");

// describe("queryConstructor", function() {

// 	it("should take a set of filters and return a PG string - multiple restrictions", function() {
// 		var queryWeWant = "SELECT * FROM jobs ORDER BY shipping_date DESC " +
// 											"WHERE (job_status='Complete' OR job_status='Started') " +
// 											"AND (order_type='Bespoke' OR order_type='Outsourced') " +
// 											"AND shipping_date >= 2015-01-01";

// 		var queryObject = {
// 			job_status: ["Complete", "Started"],
// 			order_type: ["Bespoke", "Outsourced"],
// 			dateField: "shipping_date",
// 			startDate: "2015-01-01",
// 			sortBy: "shipping_date",
// 			isAsc: false
// 		};

// 		var opts = {
// 			action: "SELECT",
// 			table: "jobs"
// 		};

// 		assert.equal(qC(queryObject, opts), queryWeWant);
// 	});
// });
