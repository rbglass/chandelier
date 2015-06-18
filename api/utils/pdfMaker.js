"use strict";

var MARGIN = 72,
		RIGHT_EDGE = 595.28,
		BOTTOM_EDGE = 841.89,

		ADDRESS_WIDTH = 144,
		IMAGE_WIDTH = 200,
		LABEL_WORD_SPACING = -2,

		TITLE_FONT_SIZE = 25,
		ADDRESS_FONT_SIZE = 10,
		DETAIL_HEADER_FONT_SIZE = 11,
		ITEM_HEADER_FONT_SIZE = 12,
		INPUT_FONT_SIZE = 10,
		FOOTER_FONT_SIZE = 8,

		LINE_GAP = 1.2,
		WORDS_PER_LINE = 82,
		LINES_IN_FOOTER = 6,

		BETWEEN_TITLE_AND_DETAILS = TITLE_FONT_SIZE * 2,
		BETWEEN_DETAILS_AND_ITEMS = 108,
		SAFETY_GAP = 72,

		TITLE_LINE = MARGIN * 2,
		DETAILS_LINE = TITLE_LINE + BETWEEN_TITLE_AND_DETAILS,
		ITEM_HEADER_LINE = DETAILS_LINE + BETWEEN_DETAILS_AND_ITEMS,
		ITEMS_LINE = ITEM_HEADER_LINE + (ITEM_HEADER_FONT_SIZE * 3),
		FOOTER_LINE = BOTTOM_EDGE - MARGIN - (LINES_IN_FOOTER * FOOTER_FONT_SIZE);

var PDFDocument = require("pdfkit");

var fieldsWeCareAbout = {
	product: true,
	description: true,
	glass: true,
	metal: true,
	flex: true,
	bulb: true,
	notes: true
};

var labelConfig = {
	lineGap: LINE_GAP,
	wordSpacing: LABEL_WORD_SPACING
};

function formatDate(date) {
	var dates = [
		"Jan", "Feb", "Mar", "Apr", "May", "June",
		"July", "Aug", "Sep", "Oct", "Nov", "Dec"
	];
	var formattedDate = date.getDate() + " " + dates[date.getMonth()] + " " + date.getFullYear();
	return formattedDate;
}

function lineCounter(el) {

	if (typeof el !== "string") {
		return 1;
	}

	var lineReg = /\n/g;

	var matches = el.match(lineReg);

	var len = Math.ceil((el.length / WORDS_PER_LINE) || 1);

	if(matches) {
    len += matches.length;
	}

	return len;
}

function writeFooter(doc, num) {
	doc.fontSize(FOOTER_FONT_SIZE)
			.font("Helvetica")
			.text("Rothschild & Bickers Ltd.", MARGIN, FOOTER_LINE)
			.text("Registered Office & Studio: Unit 7, Great Northern Works, Hartham Lane, Hertford SG14 1QN UK")
			.text("+44 (0) 1992 677 292 - info@rothschildbickers.com - www.rothschildbickers.com - UK Company No.8413128")
			.moveDown()
			.text("Page " + num, {align: "center"});

}

function writeAddress(doc, address) {
	var FROM_EDGE = RIGHT_EDGE - MARGIN - ADDRESS_WIDTH;

	doc.fontSize(ADDRESS_FONT_SIZE)
		.text("Unit 7 Great Nothern Works", FROM_EDGE, TITLE_LINE)
		.text("Hartham Lane")
		.text("Hertford, Herts")
		.text("SG14 1QN")
		.moveDown(2)
		.fontSize(DETAIL_HEADER_FONT_SIZE)
		.font("Bold")
		.text("Delivery Details:", labelConfig)
		.fontSize(ADDRESS_FONT_SIZE)
		.font("Helvetica")
		.text(address);
}

function drawImage(doc) {
	var FROM_EDGE = RIGHT_EDGE - MARGIN - IMAGE_WIDTH;

	doc.image("public/img/logo.jpg", FROM_EDGE, MARGIN, {width: IMAGE_WIDTH});
}

function writeDoc(job, cb) {
	var doc = new PDFDocument({size: "A4"});

	var dateStr = formatDate(new Date());
	var formattedShippingDate;

	try {
		formattedShippingDate = formatDate(job.details.shipping_date);
	} catch(e) {
		formattedShippingDate = "TBC";
	}

	doc.registerFont("Bold", "public/fonts/Helvetica-Bold.ttf");
	doc.font("Helvetica");

	drawImage(doc);

	doc.fontSize(TITLE_FONT_SIZE)
			.text("Specification", MARGIN, TITLE_LINE);

	doc.fontSize(DETAIL_HEADER_FONT_SIZE)
			.font("Bold")
			.text("Date: ", MARGIN, DETAILS_LINE)
			.moveDown()
			.text("Job #:", labelConfig)
			.text("Client:", labelConfig)
			.text("Project:", labelConfig)
			.text("Client Ref:", labelConfig)
			.text("Job Status:", labelConfig)
			.text("Shipping Date:", labelConfig);

	doc.fontSize(INPUT_FONT_SIZE)
			.font("Helvetica")
			.text(dateStr, MARGIN * 2.25, DETAILS_LINE)
			.moveDown()
			.text("RB" + job.job_id)
			.text(job.details.client)
			.text(job.details.project || " ")
			.text(job.details.client_ref || " ")
			.text(job.details.job_status)
			.text(formattedShippingDate);

	writeAddress(doc, job.details.shipping_notes);

	doc.fontSize(ITEM_HEADER_FONT_SIZE)
			.font("Bold")
			.text("Qty", MARGIN, ITEM_HEADER_LINE)
			.text("Description", MARGIN * 2, ITEM_HEADER_LINE)
			.text(" ", MARGIN)
			.fontSize(13)
			.moveDown();

	var yPos = ITEMS_LINE;
	var p = 1;

	writeFooter(doc, p);

	job.items.forEach(function(item, i) {
		var lineCount;

		if(yPos > (FOOTER_LINE - SAFETY_GAP)) {
				p++;
				yPos = MARGIN;
				doc.addPage();
				writeFooter(doc, p);
		}

		doc.fontSize(INPUT_FONT_SIZE)
				.font("Helvetica")
				.text(item.qty_req, MARGIN, yPos)
				.text(item.product, MARGIN * 2, yPos)
				.text(item.description && "- Description: " + item.description || "")
				.text(item.glass && "- Glass: " + item.glass || "")
				.text(item.metal && "- Metal: " + item.metal || "")
				.text(item.flex && "- Flex: " + item.flex || "")
				.text(item.bulb && "- Bulb: " + item.bulb || "")
				.text(item.notes && "- " + item.notes || "");

		doc.moveTo(MARGIN, yPos - INPUT_FONT_SIZE)
				.lineTo(RIGHT_EDGE - MARGIN, yPos - INPUT_FONT_SIZE)
				.stroke("grey");

		yPos += INPUT_FONT_SIZE + 2;

		for(var prop in item) {
			if (item.hasOwnProperty(prop) && item[prop] && fieldsWeCareAbout[prop]) {
				lineCount = lineCounter(item[prop]);
				yPos += (lineCount * (INPUT_FONT_SIZE + 2));
			}
		}
	});
	doc.end();
	cb(doc);
}

module.exports = writeDoc;

