"use strict";
var fs = require("fs");

// create a document and pipe to a blob
var PDFDocument = require("pdfkit");
var stroke = {stroke: true};

function pdfMaker(job, cb) {

	var doc = new PDFDocument();

	var ws = fs.createWriteStream("./hellom8")
	var stream = doc.pipe(ws);
	var body = "";
	var date = new Date();
	var dateStr = date.getDate() + " " + date.getMonth() + " " + date.getFullYear();

	function writeFooter() {
		doc.fontSize(8)
				.text("RothsChild & Bickers Ltd.", 50, 690)
				.text("Registered Office & Studio: Unit 7, Great Northern Works, Hartham Lane, Hertford SG14 1QN UK")
				.text("+44 (0) 1992 677 292 - info@rothschildbickers.com - www.rothschildbickers.com - UK Company No.8413128");
	}

	function writeDoc() {

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

		// and some justified text wrapped into columns
		doc.fontSize(12)
				.text("Qty", 50, 250, stroke)
				.text("Description", 100, 250, stroke)
				.text(" ", 50)
				.font("Times-Roman", 13)
				.moveDown();

		var yPos = 280;

		writeFooter();

		job.items.forEach(function(item, i) {
				if(yPos > 600) {
						yPos = 50;
						doc.addPage();
						writeFooter();
				}
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
		doc.end();
	}
	stream.on("data", function(chunk) {
			body += chunk;
		});
		stream.on("finish", function() {
			console.log(body)
			cb(body);
		})

	writeDoc();

//	stream.on("data", function(chunk) {
//		body += chunk;
//	});
//	stream.on("finish", function() {
//		return body;
//	});
}

module.exports = pdfMaker;
