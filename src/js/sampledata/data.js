export const job = {
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
	"items": [
		{
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
		}
	]
};


export const jobs = [
	{	job_id: "RB2234",
		"details": {
			job_id: "RB2234",
			client: "JIM",
			project: "peng",
			job_status: "TBC",
			order_type: "Bespoke",
			last_update: "2015-10-01",
			parts_status: "waiting",
			shipping_date: "2015-11-12"
		}
	},
	{
		job_id: "RB1234",
		details: {
			job_id: "RB1234",
			client: "TIM",
			project: "peng",
			job_status: "Non-Starter",
			order_type: "Outsourced",
			last_update: "2015-10-01",
			parts_status: "waiting",
			shipping_date: "2015-12-12"
		}
	}
];

export const selections = {
	job_status: ["TBC", "Non-Starter", "Confirmed", "Packaged", "Dispatched", "Done"],
	order_type: ["Standard", "Bespoke", "RB Parts", "Outsourced", "Loan or Press"],
	parts_status: ["", "Started", "Done"],
	payment: ["", "Awaiting Payment", "Deposit", "Paid Card", "Paid BACS", "Paid Other", "Non-Starter"]
};
