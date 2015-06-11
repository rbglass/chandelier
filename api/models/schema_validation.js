"use strict";
var Joi = require("joi");

var jobs = Joi.object().keys({
	client: 				Joi.string(),
	project: 				Joi.string(),
	job_status: 		Joi.string().default("TBC"),
	order_type: 		Joi.string().default("Standard"),
	shipping_date: 	Joi.date(),
	parts_status: 	Joi.string(),
	updatedat: 			Joi.date().default(Date.now, "time of last update"),
	createdat: 			Joi.date().default(Date.now, "time of creation"),
	payment: 				Joi.string().default("Awaiting Payment"),
	shipping_notes: Joi.string(),
	parts_notes:	 	Joi.string(),
	invoice_notes: 	Joi.string()
});



var users = Joi.object().keys({
   email: Joi.string().email()
});

var job_items = Joi.object().keys({
	job_id: 			Joi.number().min(1).required(), //should change to 4 once we start from 3000
	product: 			Joi.string(),
	description: 	Joi.string(),
	glass: 				Joi.string(),
	metal: 				Joi.string(),
	flex: 				Joi.string(),
	bulb: 				Joi.string(),
	qty_req: 			Joi.number().default(0),
	qty_hot: 			Joi.number().default(0),
	qty_cold: 		Joi.number().default(0),
	qty_assem: 		Joi.number().default(0),
	qty_packed: 	Joi.number().default(0),
	notes: 				Joi.string(),
	updatedat: 		Joi.date().default(Date.now, "time of last update"),
	createdat: 		Joi.date().default(Date.now, "time of creation")
});

module.exports = {
	jobs: jobs,
	users: users,
	job_items: job_items
};
