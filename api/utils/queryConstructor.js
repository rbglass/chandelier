"use strict";

/**
* @param filters object
* @param string querystring
* @param opts object
*
* @returns string
*/

function queryConstructor(filters, opts) {
	var count = 1;
	var string = "";
	var filterTerms;

	string += opts.action + " * FROM " + opts.table;

	filterTerms = Object.keys(filters);

	if(filterTerms.length === 0) {
		return string;
	} else {
		string += " WHERE ";
		filterTerms.forEach(function(label) {
			if(filters[label] instanceof Array) {
				filters[label].forEach(function(restr, i) {
					string += (label + "='" + restr + "' ");

					if(i < filters[label].length - 1) {
						string += "OR ";
					}
				});
			} else {
				string += "AND " + label + "=" + filters[label];
			}
		});
	}


	return string;
}

var e = "SELECT * FROM jobs ORDER BY shipping_date DESC " +
					"LIMIT 50 OFFSET 100 " +
					"WHERE (job_status='Complete' OR job_status='Started') " +
					"AND (order_type='Bespoke' OR order_type='Outsourced') " +
					"AND shipping_date >= 2015-01-01";

module.exports = queryConstructor;
