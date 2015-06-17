"use strict";
// In need of a hefty refactor

var PDFDocument = require("pdfkit");
var gap = {lineGap: 1.2};

var fieldsWeCareAbout = {
	qty_req: true,
	product: true,
	description: true,
	glass: true,
	metal: true,
	flex: true,
	bulb: true,
	notes: true
};

function writeFooter(doc, num) {
	doc.fontSize(8)
			.font("Helvetica")
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
		.font("Bold")
		.text("Delivery Address:")
		.fontSize(10)
		.font("Helvetica")
		.text(address);
}

function formatDate(date) {
	var dates = [
		"Jan", "Feb", "Mar", "Apr", "May", "June",
		"July", "Aug", "Sep", "Oct", "Nov", "Dec"
	];
	var formattedDate = date.getDate() + " " + dates[date.getMonth()] + " " + date.getFullYear();
	return formattedDate;
}

function writeDoc(job, cb) {
	var doc = new PDFDocument({margin: 50});
	var dateStr = formatDate(new Date());
	var formattedShippingDate = formatDate(job.details.shipping_date);

	doc.registerFont("Bold", "public/fonts/Helvetica-Bold.ttf");
	doc.font("Helvetica");

	doc.image("public/img/logo.jpg", 350, 20, {width: 200});

	doc.fontSize(25)
			.text("Specification", 50, 80);

	doc.fontSize(11)
			.font("Bold")
			.text("Date: ", 50, 140)
			.moveDown()
			.text("Job #:", gap)
			.text("Client:", gap)
			.text("Project:", gap)
			.text("Client Ref:", gap)
			.text("Job Status:", gap)
			.text("Shipping Date:", gap);

	doc.fontSize(10)
			.font("Helvetica")
			.text(dateStr, 140, 140)
			.moveDown()
			.text("RB" + job.job_id)
			.text(job.details.client)
			.text(job.details.project || " ")
			.text(job.details.client_ref || " ")
			.text(job.details.job_status)
			.text(formattedShippingDate);

	writeAddress(doc, job.details.shipping_notes);

	doc.fontSize(12)
			.font("Bold")
			.text("Qty", 50, 250)
			.text("Description", 100, 250)
			.text(" ", 50)
			.fontSize(13)
			.moveDown();

	var yPos = 280;
	var p = 1;

	writeFooter(doc, p);

	job.items.forEach(function(item, i) {
			if(yPos > 600) {
					p++;
					yPos = 50;
					doc.addPage();
					writeFooter(doc, p);
			}

			doc.fontSize(12)
					.font("Helvetica")
					.text(item.qty_req, 50, yPos)
					.text(item.product, 100, yPos)
					.text(item.description && "- Description: " + item.description || "")
					.text(item.glass && "- Glass: " + item.glass || "")
					.text(item.metal && "- Metal: " + item.metal || "")
					.text(item.flex && "- Flex: " + item.flex || "")
					.text(item.bulb && "- Bulb: " + item.bulb || "")
					.text(item.notes && "- " + item.notes || "");

			doc.moveTo(50, yPos - 8)
					.lineTo(550, yPos - 8)
					.stroke("grey");

			for(var prop in item) {
					if(item.hasOwnProperty(prop) && item[prop] && fieldsWeCareAbout[prop]) {
						yPos += (Math.ceil((item[prop].length / 82) || 1) * 14);
					}
			}
	});
	doc.end();
	cb(doc);
}

module.exports = writeDoc;

