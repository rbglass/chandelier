"use strict";
var Joi = require("joi");


module.exports = {

	jobs: Joi.object().keys({
		client: 				Joi.string(),
		project: 				Joi.string(),
		job_status: 		Joi.string(),
		order_type: 		Joi.string(),
		shipping_date: 	Joi.date(),
		parts_status: 	Joi.string(),
		updatedat: 			Joi.date(),
		createdat: 			Joi.date(),
		job_id: 				Joi.number(),
		payment: 				Joi.string(),
		shipping_notes: Joi.string(),
		parts_notes:	 	Joi.string(),
		invoice_notes: 	Joi.string(),
		notes:					Joi.string()
	}),

	users: Joi.object().keys({
		email: Joi.string().email()
	}),

	job_items: Joi.object().keys({
		item_id: 			Joi.number(),
		job_id: 			Joi.number(),
		product: 			Joi.string(),
		description: 	Joi.string(),
		glass: 				Joi.string(),
		metal: 				Joi.string(),
		flex: 				Joi.string(),
		bulb: 				Joi.string(),
		qty_req: 			Joi.number(),
		qty_hot: 			Joi.number(),
		qty_cold: 		Joi.number(),
		qty_assem: 		Joi.number(),
		qty_packed: 	Joi.number(),
		notes: 				Joi.string(),
		updatedat: 		Joi.date(),
		createdat: 		Joi.date()
		})

};
