"use strict";

var MARGIN = 28,
		RIGHT_EDGE = 595.28,
		BOTTOM_EDGE = 841.89,

		ADDRESS_WIDTH = 200,
		IMAGE_WIDTH = 200,
		IMAGE_HEIGHT = 30,
		LABEL_WORD_SPACING = -2,

		TITLE_FONT_SIZE = 24,
		ADDRESS_FONT_SIZE = 9,
		DETAIL_HEADER_FONT_SIZE = 10,
		ITEM_HEADER_FONT_SIZE = 10,
		INPUT_FONT_SIZE = 9,
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

var FONT = "Helvetica";

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

function indentLineBreaker(description, lineLimit, startingIndent, nextIndent) {

	var breaker = new LineBreaker(description);
	var last = 0;
	var bk = breaker.nextBreak();
	var lines = "";
	var prep = startingIndent || "";
	var nextLen = nextIndent && nextIndent.length || 0;

	if (description.length < lineLimit) {
		return prep.concat(description);
	}
	while (bk) {
		if ((bk.position - last) > lineLimit) {
			if (last === 0) lineLimit -= nextLen;

			lines += prep.concat(description.slice(last, bk.position));
			last = bk.position;
			prep = "\n" + (nextIndent || "");
		}

		bk = breaker.nextBreak();
	}

	if(last < description.length) {
		lines += prep.concat(description.slice(last));
	}
	return lines;
}

function formatDescription(description, lineLimit, startingIndent, nextIndent) {
		var initialIndented = description.split("\n");

		var properlyWrapped = initialIndented.map(function(oneLine) {
				return indentLineBreaker(oneLine, lineLimit, startingIndent, nextIndent);
		});
    return properlyWrapped.join("");
}

function propChecker(prefix, prop) {
	return (prop && prefix + ": " + prop) || "";
}

function writeFooter(doc, num, total) {
	doc.fontSize(FOOTER_FONT_SIZE)
			.font(FONT)
			.text("Rothschild & Bickers Ltd.", MARGIN, FOOTER_LINE)
			.text("Registered Office & Studio: Unit 7, Great Northern Works, Hartham Lane, Hertford SG14 1QN UK")
			.text("+44 (0) 1992 677 292 - info@rothschildbickers.com - www.rothschildbickers.com - UK Company No.8413128")
			.moveDown()
			.text("Specification — Page " + num + " of " + total);
}

function writeAllFooters(doc) {
	var range = doc.bufferedPageRange();
	var currentPage = range.start;

	for (currentPage; currentPage < range.count; currentPage += 1) {
		doc.switchToPage(currentPage);
		writeFooter(doc, currentPage + 1, range.count);
	}
}

function writeAddress(doc) {
	var FROM_EDGE = RIGHT_EDGE - MARGIN - ADDRESS_WIDTH;

	doc.fontSize(ADDRESS_FONT_SIZE)
			.text("Unit 7 Great Northern Works", FROM_EDGE, ADDRESS_LINE)
			.text("Hartham Lane")
			.text("Hertford, Herts")
			.text("SG14 1QN");
}

function writeDeliveryDetails(doc, _name, _address, _phone, _email, _notes) {
	var HORIZ_CENTER = Math.floor(RIGHT_EDGE / 2) - 50;
	doc.fontSize(DETAIL_HEADER_FONT_SIZE)
			.font("Bold")
			.text("Delivery Details:", HORIZ_CENTER, DETAILS_LINE, labelConfig)
			.fontSize(ADDRESS_FONT_SIZE)
			.font(FONT)
			.text(_name)
			.text(_address)
			.moveDown()
			.text(_phone)
			.text(_email);
			//.moveDown()
			//.text(_notes);
}

// function writeDeliveryDetails(doc, address) {
// 	var HORIZ_CENTER = Math.floor(RIGHT_EDGE / 2) - 50;
// 	doc.fontSize(DETAIL_HEADER_FONT_SIZE)
// 			.font("Bold")
// 			.text("Delivery Details:", HORIZ_CENTER, DETAILS_LINE, labelConfig)
// 			.fontSize(ADDRESS_FONT_SIZE)
// 			.font(FONT)
// 			.text(address);

// 	return lineCounter(address, 60);
// }

function drawImage(doc) {
	var FROM_EDGE = RIGHT_EDGE - MARGIN - IMAGE_WIDTH;

	doc.image("public/img/logo.jpg", FROM_EDGE, MARGIN, {width: IMAGE_WIDTH});
}

function wrapDetails(doc, pair) {
	var y = doc.y;

	doc.fontSize(DETAIL_HEADER_FONT_SIZE)
				.font("Bold")
				.text(pair[0], MARGIN, y, labelConfig);

	doc.fontSize(INPUT_FONT_SIZE)
				.font(FONT)
				.text(
					formatDescription(pair[1], 17, null, "   ") || " ",
					MARGIN + 90, y
				);
}

function writeDetails(doc, job, wantFullVersion) {
	var dateStr = formatDate(new Date());
	var d = job.details;
	var startDetailsAt = wantFullVersion ? DETAILS_LINE : doc.y;
	var tuples;

	doc.fontSize(DETAIL_HEADER_FONT_SIZE)
				.font("Bold")
				.text("Date: ", MARGIN, startDetailsAt)
			.fontSize(INPUT_FONT_SIZE)
				.font(FONT)
				.text(dateStr, MARGIN + 90, startDetailsAt);

	tuples = [
		["Job #:", "RB" + job.job_id],
		["Client:", d.client]
	];

	if (wantFullVersion) {
		tuples = tuples.concat([
			["Project:", d.project],
			["Client Ref:", d.client_ref],
			["Job Status:", d.job_status]
		]);
		doc.moveDown();
	}

	tuples.forEach(function(pair) {
		wrapDetails(doc, pair);
	});
	doc.moveDown();

	return doc.y;
}

function writeDoc(job, cb) {
	var doc = new PDFDocument({
		size: "A4",
		margin: MARGIN,
		bufferPages: true
	});

	doc.registerFont("Bold", "public/fonts/Helvetica-Bold.ttf");
	doc.font(FONT);

	drawImage(doc);

	doc.fontSize(TITLE_FONT_SIZE)
			.text("Specification", MARGIN, TITLE_LINE);

	var detailsEndedAt = writeDetails(doc, job, true);
	writeAddress(doc);

	//var deliveryLineCount = writeDeliveryDetails(doc, job.details.shipping_notes);
	writeDeliveryDetails(doc, job.details.contact_name, job.details.delivery_address, job.details.contact_number, job.details.contact_email, job.details.delivery_notes);

	var beginItemHeaders = Math.max(doc.y, detailsEndedAt, ITEM_HEADER_LINE);

	doc.fontSize(ITEM_HEADER_FONT_SIZE)
			.font("Bold")
			.text("Qty", MARGIN, beginItemHeaders, {continued: true})
			.text("Description", MARGIN + BETWEEN_QTY_AND_DESCRIPTION - 6)
			.text(" ", MARGIN)
			.moveDown(0.5);

	job.items.sort(function(a, b) {
		return +a.pdf_rank - +b.pdf_rank;
	});

	job.items.forEach(function(item, i) {
		var lineCount, currentY;
		var itWont = !isSufficientSpace(item, doc.y);
		var flexDesc = ''

		if (item.flex_length === '') {
			flexDesc = item.flex;
		} else if (item.flex_length === 'tbc' || item.flex_length === 'TBC') {
			flexDesc = item.flex_length + ' ' + item.flex
		} else {
			flexDesc = item.flex_length + 'm ' + item.flex
		}

		if (itWont) {
			doc.addPage();
			doc.moveDown();
			drawImage(doc);
			writeDetails(doc, job, false);
			doc.moveDown();
		}

		doc.moveTo(MARGIN, doc.y - INPUT_FONT_SIZE)
				.lineTo(RIGHT_EDGE - MARGIN, doc.y - INPUT_FONT_SIZE)
				.stroke("grey");

		currentY = doc.y;
		doc.fontSize(INPUT_FONT_SIZE)
				.font(FONT)
				.text(item.qty_req, MARGIN + 2, currentY)
				.text(item.product, MARGIN + 14 + BETWEEN_QTY_AND_DESCRIPTION, currentY)
				.text(item.description && "- Description: " +
					formatDescription(
						item.description, DESCRIPTION_LINE_WRAP, "\n   ", "        "
					) || "")
				.text(propChecker("- Glass", item.glass))
				.text(propChecker("- Metal", item.metal))
				// .text(propChecker("- Flex", item.flex_length + 'm ' + item.flex ))
				.text(propChecker("- Flex", flexDesc ))
				.text(propChecker("- Bulb", item.bulb ))
				.text(propChecker("- Ceiling Rose", item.ceilingrose ))
				.moveDown(1.5);


	});
	writeAllFooters(doc);
	doc.end();
	cb(doc);
}

module.exports = writeDoc;
