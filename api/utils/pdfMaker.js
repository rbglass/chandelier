"use strict";

var MARGIN = 28,
		RIGHT_EDGE = 595.28,
		BOTTOM_EDGE = 841.89,

		ADDRESS_WIDTH = 200,
		DETAILS_WIDTH = 200,
		IMAGE_WIDTH = 200,
		IMAGE_HEIGHT = 30,
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
		BETWEEN_IMAGE_AND_ADDRESS = 40,
		BETWEEN_QTY_AND_DESCRIPTION = 28,
		SAFETY_GAP = 72,

		TITLE_LINE = 50 + MARGIN,
		DETAILS_LINE = TITLE_LINE + BETWEEN_TITLE_AND_DETAILS,
		ADDRESS_LINE = IMAGE_HEIGHT + BETWEEN_IMAGE_AND_ADDRESS,
		ITEM_HEADER_LINE = DETAILS_LINE + BETWEEN_DETAILS_AND_ITEMS,
		FOOTER_LINE = BOTTOM_EDGE - MARGIN - (LINES_IN_FOOTER * FOOTER_FONT_SIZE);

var PDFDocument = require("pdfkit");

var fieldsWeCareAbout = {
	product: true,
	description: true,
	glass: true,
	metal: true,
	flex: true,
	bulb: true
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

function lineCounter(el, wordsPerLine) {

	if (typeof el !== "string") {
		return 1;
	}

	var lineReg = /\n/g;

	var matches = el.match(lineReg);

	var len = Math.ceil((el.length / wordsPerLine) || 1);

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

function writeAddress(doc) {
	var FROM_EDGE = RIGHT_EDGE - MARGIN - ADDRESS_WIDTH;

	doc.fontSize(ADDRESS_FONT_SIZE)
		.text("Unit 7 Great Nothern Works", FROM_EDGE, ADDRESS_LINE)
		.text("Hartham Lane")
		.text("Hertford, Herts")
		.text("SG14 1QN");
}

function writeDeliveryDetails(doc, address) {
	var HORIZ_CENTER = Math.floor(RIGHT_EDGE / 2) - 50;
	console.log(JSON.stringify(address));
	doc.fontSize(DETAIL_HEADER_FONT_SIZE)
			.font("Bold")
			.text("Delivery Details:", HORIZ_CENTER, DETAILS_LINE, labelConfig)
			.fontSize(ADDRESS_FONT_SIZE)
			.font("Helvetica")
			.text(address);

	return lineCounter(address, 60);
}

function drawImage(doc) {
	var FROM_EDGE = RIGHT_EDGE - MARGIN - IMAGE_WIDTH;

	doc.image("public/img/logo.jpg", FROM_EDGE, MARGIN, {width: IMAGE_WIDTH});
}

function writeDetails(doc, job) {
	var dateStr = formatDate(new Date());
	var formattedShippingDate;

	try {
		formattedShippingDate = formatDate(job.details.shipping_date);
	} catch(e) {
		formattedShippingDate = "TBC";
	}

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
			.text(dateStr, MARGIN + 102, DETAILS_LINE)
			.moveDown()
			.text("RB" + job.job_id)
			.text(job.details.client || " ")
			.text(job.details.project || " ")
			.text(job.details.client_ref || " ")
			.text(job.details.job_status)
			.text(formattedShippingDate);
}

function writeDoc(job, cb) {
	var doc = new PDFDocument({
		size: "A4",
		margin: MARGIN
	});

	doc.registerFont("Bold", "public/fonts/Helvetica-Bold.ttf");
	doc.font("Helvetica");

	drawImage(doc);

	doc.fontSize(TITLE_FONT_SIZE)
			.text("Specification", MARGIN, TITLE_LINE);

	writeDetails(doc, job);
	writeAddress(doc);

	var detailsLineCount = writeDeliveryDetails(doc, job.details.shipping_notes);
	var detailsHeight = detailsLineCount * ADDRESS_FONT_SIZE + DETAIL_HEADER_FONT_SIZE;
	var beginItemHeaders = Math.max(detailsHeight, ITEM_HEADER_LINE);
	var beginItemBody = beginItemHeaders + (ITEM_HEADER_FONT_SIZE * 2.5);
	console.log(beginItemHeaders, detailsHeight, beginItemBody);

	doc.fontSize(ITEM_HEADER_FONT_SIZE)
			.font("Bold")
			.text("Qty", MARGIN + 14, beginItemHeaders)
			.text("Description", MARGIN + 14 + BETWEEN_QTY_AND_DESCRIPTION, beginItemHeaders)
			.text(" ", MARGIN)
			// .fontSize(13)
			.moveDown(0.5);

	var yPos = beginItemBody;
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
				.text(item.qty_req, MARGIN + 14, yPos)
				.text(item.product, MARGIN + 14 + BETWEEN_QTY_AND_DESCRIPTION, yPos)
				.text(item.description && "- Description: " + item.description || "")
				.text(item.glass && "- Glass: " + item.glass || "")
				.text(item.metal && "- Metal: " + item.metal || "")
				.text(item.flex && "- Flex: " + item.flex || "")
				.text(item.bulb && "- Bulb: " + item.bulb || "");

		doc.moveTo(MARGIN, yPos - INPUT_FONT_SIZE)
				.lineTo(RIGHT_EDGE - MARGIN, yPos - INPUT_FONT_SIZE)
				.stroke("grey");

		yPos += INPUT_FONT_SIZE + 2;

		for(var prop in item) {
			if (item.hasOwnProperty(prop) && item[prop] && fieldsWeCareAbout[prop]) {
				lineCount = lineCounter(item[prop], WORDS_PER_LINE);
				yPos += (lineCount * (INPUT_FONT_SIZE + 2));
			}
		}
	});
	doc.end();
	cb(doc);
}

module.exports = writeDoc;

