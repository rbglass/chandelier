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
		DESCRIPTION_LINE_WRAP = 82,
		LINES_IN_FOOTER = 6,

		BETWEEN_TITLE_AND_DETAILS = TITLE_FONT_SIZE * 2,
		BETWEEN_DETAILS_AND_ITEMS = 108,
		BETWEEN_IMAGE_AND_ADDRESS = 40,
		BETWEEN_QTY_AND_DESCRIPTION = 28,
		SAFETY_GAP = 36,

		TITLE_LINE = 50 + MARGIN,
		DETAILS_LINE = TITLE_LINE + BETWEEN_TITLE_AND_DETAILS,
		ADDRESS_LINE = IMAGE_HEIGHT + BETWEEN_IMAGE_AND_ADDRESS,
		ITEM_HEADER_LINE = DETAILS_LINE + BETWEEN_DETAILS_AND_ITEMS,
		FOOTER_LINE = BOTTOM_EDGE - MARGIN - (LINES_IN_FOOTER * FOOTER_FONT_SIZE);

var PDFDocument = require("pdfkit");
var LineBreaker = require("linebreak");

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
// TODO: revisit this (along with the whole module...)
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

function isSufficientSpace(obj, position) {
	var heightOfArticle, articleEndPosition, dangerZoneStartsAt;
	var lineCount = 0;

	for(var prop in obj) {
		if (obj.hasOwnProperty(prop) && obj[prop] && fieldsWeCareAbout[prop]) {
			lineCount += lineCounter(obj[prop], WORDS_PER_LINE);
		}
	}
	heightOfArticle = lineCount * (INPUT_FONT_SIZE + 2);
	articleEndPosition = position + heightOfArticle;
	dangerZoneStartsAt = FOOTER_LINE - SAFETY_GAP;

	return articleEndPosition < dangerZoneStartsAt;
}

function indentLineBreaker(description, lineLimit) {

	var breaker = new LineBreaker(description);
	var last = 0;
	var lastSlice = 0;
	var bk = breaker.nextBreak();
	var lines = "";
	var prep = "\n   ";

	if (description.length < lineLimit) {
		return prep.concat(description);
	}
	while (bk) {
		if ((bk.position - last) > lineLimit) {
			lines += prep.concat(description.slice(last, bk.position - 1));
			last = bk.position;
			prep = "\n        ";
		}

		bk = breaker.nextBreak();
	}

	if(last < description.length) {
		lines += prep.concat(description.slice(last));
	}
	return lines;
}

function formatDescription(description, lineLimit) {
		var initialIndented = description.split("\n");

		var properlyWrapped = initialIndented.map(function(oneLine) {
				return indentLineBreaker(oneLine, lineLimit);
		});
    return properlyWrapped.join("");
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

function writeAllFooters(doc) {
	var range = doc.bufferedPageRange();
	var currentPage = range.start;

	for (currentPage; currentPage < range.count; currentPage += 1) {
		doc.switchToPage(currentPage);
		writeFooter(doc, currentPage + 1);
	}
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
		margin: MARGIN,
		bufferPages: true
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
	var beginItemHeaders = Math.max(doc.y, ITEM_HEADER_LINE);

	doc.fontSize(ITEM_HEADER_FONT_SIZE)
			.font("Bold")
			.text("Qty", MARGIN + 4, beginItemHeaders, {continued: true})
			.text("Description", MARGIN + BETWEEN_QTY_AND_DESCRIPTION - 6)
			.text(" ", MARGIN)
			.moveDown(0.5);

	var yPos = doc.y;

	job.items.forEach(function(item, i) {
		var lineCount, currentY;
		var itWont = !isSufficientSpace(item, doc.y);

		if (itWont) {
			doc.addPage();
			doc.moveDown();
		}

		doc.moveTo(MARGIN, doc.y - INPUT_FONT_SIZE)
				.lineTo(RIGHT_EDGE - MARGIN, doc.y - INPUT_FONT_SIZE)
				.stroke("grey");

		currentY = doc.y;

		doc.fontSize(INPUT_FONT_SIZE)
				.font("Helvetica")
				.text(item.qty_req, MARGIN + 14, currentY)
				.text(item.product, MARGIN + 14 + BETWEEN_QTY_AND_DESCRIPTION, currentY)
				.text(item.description && "- Description: " +
					formatDescription(item.description, DESCRIPTION_LINE_WRAP) || "")
				.text(item.glass && "- Glass: " + item.glass || "")
				.text(item.metal && "- Metal: " + item.metal || "")
				.text(item.flex && "- Flex: " + item.flex || "")
				.text(item.bulb && "- Bulb: " + item.bulb || "")
				.moveDown(1.5);


	});
	writeAllFooters(doc);
	doc.end();
	cb(doc);
}

module.exports = writeDoc;

