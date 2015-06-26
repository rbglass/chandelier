"use strict";
var Joi = require("joi");

module.exports = {

	jobs: Joi.object().keys({
		job_id        : Joi.number().strip(),
		client        : Joi.string(),
		project       : Joi.string(),
		client_ref    : Joi.string(),
		job_status    : Joi.string(),
		order_type    : Joi.string(),
		shipping_date : Joi.date(),
		shipping_notes: Joi.string(),
		parts_status  : Joi.string(),
		parts_notes   : Joi.string(),
		invoice_notes : Joi.string(),
		payment       : Joi.string(),
		notes         : Joi.string(),
		createdat     : Joi.date().strip(),
		updatedat     : Joi.any().strip(),
		// from our left join
		qty_items     : Joi.number().strip()
	}),

	job_items: Joi.object().keys({
		job_id     : Joi.number(),
		item_id    : Joi.number().strip(),
		product    : Joi.string(),
		description: Joi.string(),
		glass      : Joi.string(),
		metal      : Joi.string(),
		flex       : Joi.string(),
		bulb       : Joi.string(),
		qty_req    : Joi.number(),
		qty_hot    : Joi.number(),
		qty_cold   : Joi.number(),
		qty_assem  : Joi.number(),
		notes      : Joi.string(),
		pdf_rank   : Joi.number(),
		createdat  : Joi.date().strip(),
		updatedat  : Joi.date().strip(),
		// from our inner join
		shipping_date: Joi.date().strip(),
		job_status   : Joi.string().strip(),
		payment      : Joi.string().strip(),
		client       : Joi.string().strip()
	}),

	products: Joi.object().keys({
		id         : Joi.string().strip(),
		sku        : Joi.string(),
		type       : Joi.string(),
		name       : Joi.string(),
		description: Joi.string(),
		active     : Joi.boolean(),
		saleable   : Joi.boolean()
	})
};
