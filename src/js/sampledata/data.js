"use strict";

export const jobitems = [
	{
		job_id: "RB1234",
		item_id: "1234",
		product: "Pick-n-Mix Ball",
		description: "hello",
		glass: "Denim ~ Diamond",
		metal: "Brass",
		flex: "Havana Gold ~ Twist",
		bulb: "25W Incandescent Golfball E14 SES",
		qty_req: 5,
		qty_hot: 3,
		qty_cold: 3,
		qty_assem: 3,
		qty_packed: 3,
		notes: "hello"
	},
	{
		job_id: "RB1234",
		item_id: "hi",
		product: "hello",
		description: "hello",
		glass: "hello",
		metal: "hello",
		flex: "hello",
		bulb: "hello",
		qty_req: 2,
		qty_hot: 2,
		qty_cold: 2,
		qty_assem: 2,
		qty_packed: 2,
		notes: "hello"
	},
	{
		job_id: "RB2845",
		item_id: "1234",
		product: "Pick-n-Mix Ball",
		description: "hello",
		glass: "Denim ~ Diamond",
		metal: "Brass",
		flex: "Havana Gold ~ Twist",
		bulb: "25W Incandescent Golfball E14 SES",
		qty_req: 5,
		qty_hot: 3,
		qty_cold: 3,
		qty_assem: 3,
		qty_packed: 3,
		notes: "hello"
	},
	{
		job_id: "RB2845",
		item_id: "4444",
		product: "hello",
		description: "hello",
		glass: "hello",
		metal: "hello",
		flex: "hello",
		bulb: "hello",
		qty_req: 2,
		qty_hot: 2,
		qty_cold: 2,
		qty_assem: 2,
		qty_packed: 2,
		notes: "hello"
	},
	{
		job_id: "RB2325",
		item_id: "3333",
		product: "Pick-n-Mix Ball",
		description: "hello",
		glass: "Denim ~ Diamond",
		metal: "Brass",
		flex: "Havana Gold ~ Twist",
		bulb: "25W Incandescent Golfball E14 SES",
		qty_req: 5,
		qty_hot: 3,
		qty_cold: 3,
		qty_assem: 3,
		qty_packed: 3,
		notes: "hello"
	},
	{
		job_id: "RB2325",
		item_id: "2222",
		product: "hello",
		description: "hello",
		glass: "hello",
		metal: "hello",
		flex: "hello",
		bulb: "hello",
		qty_req: 2,
		qty_hot: 2,
		qty_cold: 2,
		qty_assem: 2,
		qty_packed: 2,
		notes: "hello"
	}
];

export const jobs = [
	{
		"job_id": "RB1234",
		"details" : {
			job_id: "RB1234",
			client: "Acme Incorporated Ltd",
			project: "Showroom",
			client_ref: "PO-123456-ABC",
			notes: "happy go lucky",
			job_status: "Confirmed",
			order_type: "Bespoke",
			last_update: "2015-01-12",
			parts_status: "waiting",
			parts_notes: "when they coming???",
			shipping_date: "2015-12-30",
			delivery_details: "53 sussex rd"
		},
		"items": jobitems.filter(item => item.job_id === "RB1234")
	},
	{
		"job_id": "RB2325",
		"details" : {
			job_id: "RB2325",
			client: "Acme Incorporated Ltd",
			project: "Showroom",
			client_ref: "PO-123456-ABC",
			notes: "happy go lucky",
			job_status: "Confirmed",
			order_type: "Bespoke",
			last_update: "2015-01-12",
			parts_status: "waiting",
			parts_notes: "when they coming???",
			shipping_date: "2015-12-30",
			delivery_details: "53 sussex rd"
		},
		"items": jobitems.filter(item => item.job_id === "RB2325")
	},
	{
		"job_id": "RB2845",
		"details" : {
			job_id: "RB2845",
			client: "Acme Incorporated Ltd",
			project: "Showroom",
			client_ref: "PO-123456-ABC",
			notes: "happy go lucky",
			job_status: "Confirmed",
			order_type: "Bespoke",
			last_update: "2015-01-12",
			parts_status: "waiting",
			parts_notes: "when they coming???",
			shipping_date: "2015-12-30",
			delivery_details: "53 sussex rd"
		},
		"items": jobitems.filter(item => item.job_id === "RB2845")
	}
];

export const selections = {
	job_status: ["TBC", "Non-Starter", "Confirmed", "Packaged", "Dispatched", "Done"],
	order_type: ["Standard", "Bespoke", "RB Parts", "Outsourced", "Loan or Press"],
	parts_status: ["", "Started", "Done"],
	payment: ["", "Awaiting Payment", "Deposit", "Paid Card", "Paid BACS", "Paid Other", "Non-Starter"]
};
