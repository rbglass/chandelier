"use strict";
var Joi = require("joi");

module.exports = {

	jobs: Joi.object().keys({
		client        : Joi.string().default("").allow(""),
		project       : Joi.string().default("").allow(""),
		client_ref    : Joi.string().default("").allow(""),
		job_status    : Joi.string().default("").allow(""),
		order_type    : Joi.string().default("").allow(""),
		shipping_date : Joi.alternatives().try([
			Joi.string().only("").strip(),
			Joi.date().allow(null)
		]),
		shipping_notes: Joi.string().default("").allow(""),
		parts_status  : Joi.string().default("").allow(""),
		parts_notes   : Joi.string().default("").allow(""),
		invoice_notes : Joi.string().default("").allow(""),
		payment       : Joi.string().default("").allow(""),
		notes         : Joi.string().default("").allow("")
	}),

	job_items: Joi.object().keys({
		job_id     : Joi.number().required(),
		product    : Joi.string().default("").allow(""),
		description: Joi.string().default("").allow(""),
		glass      : Joi.string().default("").allow(""),
		metal      : Joi.string().default("").allow(""),
		flex       : Joi.string().default("").allow(""),
		bulb       : Joi.string().default("").allow(""),
		qty_req    : Joi.number().default(0),
		qty_hot    : Joi.number().default(0),
		qty_cold   : Joi.number().default(0),
		qty_assem  : Joi.number().default(0),
		qty_packed : Joi.number().default(0),
		notes      : Joi.string().default("").allow(""),
		pdf_rank   : Joi.number().default(0)
	}),

	products: Joi.object().keys({
		sku        : Joi.string().default("").allow(""),
		type       : Joi.string().default("").allow(""),
		name       : Joi.string().default("").allow(""),
		description: Joi.string().default("").allow(""),
		active     : Joi.boolean().default(true),
		saleable   : Joi.boolean().default(true)
	})
};
