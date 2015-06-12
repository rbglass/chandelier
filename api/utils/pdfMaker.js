"use strict";

var PDFDocument = require("pdfkit");
var stroke = {stroke: true};


function writeFooter(doc, num) {
	doc.fontSize(8)
			.text("Rothschild & Bickers Ltd.", 50, 692)
			.text("Registered Office & Studio: Unit 7, Great Northern Works, Hartham Lane, Hertford SG14 1QN UK")
			.text("+44 (0) 1992 677 292 - info@rothschildbickers.com - www.rothschildbickers.com - UK Company No.8413128")
			.moveDown()
			.text("Page " + num, {align: "center"});

}

function writeAddress(doc, address) {
	doc.fontSize(10)
		.text("Unit 7 Great Nothern Works", 400, 80)
		.text("Hartham Lane")
		.text("Hertford, Herts")
		.text("SG14 1QN")
		.moveDown(2)
		.fontSize(11)
		.text("Delivery Address:", stroke)
		.fontSize(10)
		.text(address);
}

function writeDoc(job, cb) {
	var doc = new PDFDocument({margin: 50});
	var date = new Date();
	var dates = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var dateStr = date.getDate() + " " + dates[date.getMonth()] + " " + date.getFullYear();

	doc.image("public/img/logo.jpg", 350, 20, {width: 200});

	doc.fontSize(25)
			.text("Specification", 50, 80);

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
			.text("RB" + job.job_id)
			.text(job.details.client)
			.text(job.details.project)
			.text(job.details.client_ref)
			.text(job.details.job_status);

	writeAddress(doc, job.details.shipping_notes);

	doc.fontSize(12)
			.text("Qty", 50, 250, stroke)
			.text("Description", 100, 250, stroke)
			.text(" ", 50)
			.font("Times-Roman", 13)
			.moveDown();

	var yPos = 280;
	var p = 1;

	// writePageNum(doc, p);
	writeFooter(doc, p);

	job.items.forEach(function(item, i) {
			if(yPos > 600) {
					p++;
					yPos = 50;
					doc.addPage();
					// writePageNum(doc, p);
					writeFooter(doc, p);
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
							yPos += 12;
					}
			}
	});
	doc.end();
	cb(doc);
}

module.exports = function pdfMaker(job, cb) {
	writeDoc(job, cb);

};
