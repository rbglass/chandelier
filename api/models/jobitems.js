"use strict";
var schema      = require("./schema");
var crud        = require("../lib/crud");

var jobItemsModel = crud({
	tableName   : "job_items",
	primaryKey  : "item_id",
	defaultSort : "shipping_date",
	schema      : schema.job_items,
	customSelect: "SELECT job_items.*, jobs.shipping_date, jobs.job_status, " +
										"jobs.payment, jobs.client " +
										"FROM job_items INNER JOIN jobs " +
										"ON job_items.job_id = jobs.job_id "
});

module.exports = jobItemsModel;
