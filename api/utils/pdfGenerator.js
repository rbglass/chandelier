"use strict";

var PDFDocument = require("pdfkit");

module.exports = function(request, reply) {

		var doc = new PDFDocument();
		var stream = doc.pipe(reply);

		var date = new Date();
		var dateStr = date.getDate() + " " + date.getMonth() + " " + date.getFullYear();
		var stroke = {stroke: true};
		var job = {
				job_id: "RB9999",
				details: {
						client: "Acme Incorporated Ltd",
						project: "Showroom",
						client_ref: "PO-123456-ABC",
						job_status: "Confirmed"
				},
				items: [
						{
								product: "Pick-n-Mix Ball",
								description: "",
								qty_req: 5,
								glass: "Denim ~ Diamond",
								metal: "Brass",
								flex: "Havana Gold ~ Twist",
								bulb: "25W Incandescent Golfball E14 SES",
								notes: ""
						},
						{
								product: "Flora Light",
								description: "no flowers on the cap",
								qty_req: 3,
								glass: "Ruby ~ Optic",
								metal: "Brass",
								flex: "Havana Gold ~ Twist",
								bulb: "25W Incandescent Candle E14 SES",
								notes: ""
						},
						{
								product: "Extra Flex",
								description: "",
								qty_req: 120,
								glass: "",
								metal: "",
								flex: "",
								bulb: "",
								notes: "Split equally across Pick-n-Mix Balls & Flora Lights"
						},
						{
								product: "'Rocky Blobs'",
								description: "",
								qty_req: 35,
								glass: "Clear ~ Plain",
								metal: "",
								flex: "",
								bulb: "",
								notes: ""
						}
				]

		};

		// draw some text
		doc.fontSize(25)
				.text("Specification", 50, 80);

		doc.fontSize(10)
				.text("Unit 7 Great Nothern Works", 400, 80)
				.text("Hartham Lane")
				.text("Hertford, Herts")
				.text("SG14 1QN")
				.moveDown(2)
				.fontSize(11)
				.text("Delivery Address:", stroke)
				.fontSize(10)
				.text("123 High Street")
				.text("Hackney, London")
				.text("E5 1AB")
				.text("UK");

		doc.fontSize(10)
				.text("Date: ", 50, 140, stroke)
				.moveDown()
				.text("Job #:", stroke)
				.text("Client:", stroke)
				.text("Project:", stroke)
				.text("Client ref:", stroke)
				.text("Job Status:", stroke);

		doc.fontSize(10)
				.text(dateStr, 120, 140)
				.moveDown()
				.text(job.job_id)
				.text(job.details.client)
				.text(job.details.project)
				.text(job.details.client_ref)
				.text(job.details.job_status);

		doc.fontSize(12)
				.text("Qty", 50, 250, stroke)
				.text("Description", 100, 250, stroke)
				.text(" ", 50)
				.font("Times-Roman", 13)
				.moveDown();

		var yPos = 280;

		job.items.forEach(function(item, i) {

				doc.fontSize(12)
						.text(item.qty_req, 50, yPos)
						.text(item.product, 100, yPos)
						.text(item.description && "- Description: " + item.description)
						.text(item.glass && "- Glass: " + item.glass)
						.text(item.metal && "- Metal: " + item.metal)
						.text(item.flex && "- Flex: " + item.flex)
						.text(item.bulb && "- Bulb: " + item.bulb)
						.text(item.notes && "- " + item.notes);

				doc.moveTo(50, yPos - 10)
						.lineTo(550, yPos - 10)
						.stroke("grey");

				for(var prop in item) {
						if(item.hasOwnProperty(prop) && item[prop]) {
								console.log(yPos);
								yPos += 14;
						}
				}
		});

		// end and display the document in the iframe to the right
		doc.end();
		stream.on("finish", function() {
			iframe.src = stream.toBlobURL("application/pdf");
		});
}
