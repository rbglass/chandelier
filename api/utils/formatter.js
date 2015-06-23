"use strict";

module.exports = {
	job: function(job) {
		return {
			job_id: job.job_id,
			details: job
		};
	},

	jobWithItems: function(job, items) {
		return {
			job_id: job.job_id,
			details: job,
			items: items || []
		};
	},

	products: function(products) {
		var formattedProducts = {};

		products.forEach(function(product) {
			var isAlreadySeen = formattedProducts[product.type];
			if (isAlreadySeen) {
				formattedProducts[product.type].push(product);
			} else {
				formattedProducts[product.type] = [product];
			}

		});
		return formattedProducts;
	}
};
