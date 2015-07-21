"use strict";
import fs from "fs";
import path from "path";
import assert from "assert";
import rewire from "rewire";
import pdfJob from "./pdf/pdfJob";
import { docDouble } from "../helpers/doubles";

describe("pdfMaker", () => {
	let pdfMaker;

	beforeEach(() => pdfMaker = rewire("../../../api/utils/pdfMaker"));

	function getFn(name) {
		return pdfMaker.__get__(name);
	}

	describe(".internals - formatting", () => {

		it("#formatDate takes a date and returns a formatted date", () => {
			const formatDate = getFn("formatDate");
			const dateWeExpect = "12 June 2015";

			const result = formatDate(new Date(2015, 5, 12));
			assert.equal(result, dateWeExpect);
		});

		it("#lineCounter counts the number of lines in a string wrt wordsPerLine, including \\n, minimum 1", () => {
			const lineCounter = getFn("lineCounter");
			const string = "\nHello Mate How Are You Im Jaden Smith \n\n";

			assert.equal(lineCounter(string, 20), 6);
			assert.equal(lineCounter("", 80000000), 1);
			assert.equal(lineCounter(3, 800000000), 1);
		});

		it("#isSufficientSpace returns whether all of an object's own properties we care about will fit above the danger line", () => {
			const isSufficientSpace = getFn("isSufficientSpace");

			function Liner(obj) {
				Object.keys(obj).forEach(e => this[e] = obj[e]);
			}
			Liner.prototype.ignored = "\n\n\n\n\n\n\n";

			const nineLines = new Liner({
				"product"    : "one line",
				"description": "two lines\n",
				"glass"      : "one line",
				"metal"      : "three lines\n\n",
				"flex"       : "one line",
				"bulb"       : "one line",
				"wedontcare" : "\n\n\n\n\n\n\n\n\n\n\n\n"
			});

			assert.equal(isSufficientSpace(nineLines, 650), false);
			assert.equal(isSufficientSpace(nineLines, 610), true);
		});

		it("#indentLineBreaker returns a linebroken & indented string, with starting and other-line indents", () => {
			const indentLineBreaker = getFn("indentLineBreaker");

			const oneTwoNineChars = "This sentence will end at index 35. This sentence will end at index 71. " +
													"This sentence should be hanging amirite and cut \n in half";
			const lim = 30;

			const results = {
				noIndent: "This sentence will end at index \n" +
									"35. This sentence will end at index \n" +
									"71. This sentence should be hanging \n" +
									"amirite and cut \n " +
									"in half",
				hangingIndent: "-  This sentence will end at index \n" +
													"*     35. This sentence will end \n" +
													"*     at index 71. This sentence \n" +
													"*     should be hanging amirite \n" +
													"*     and cut \n " +
													"in half"
			};
			assert.equal(indentLineBreaker(oneTwoNineChars, lim), results.noIndent);
			assert.equal(indentLineBreaker(oneTwoNineChars, lim, "-  ", "*     "), results.hangingIndent);
			assert.equal(indentLineBreaker("hi", 60000, "-  "), "-  hi");
		});

		it("#formatDescription splits a description by newlines and returns the indented, wrapped version", () => {
			const formatDescription = getFn("formatDescription");
			const whatWeWant = "***Hi***There***m8";

			assert.equal(formatDescription("Hi\nThere\nm8", 20, "***", "/1923"), whatWeWant);
		});

		it("#propChecker takes a prefix and a prop and returns the : seperated prefix:prop or empty string", () => {
			const propChecker = getFn("propChecker");
			const whatWeWant = "Glass: Hello";

			assert.equal(propChecker("Glass", "Hello"), whatWeWant);
			assert.equal(propChecker("Glass"), "");
		});
	});

	describe(".internals - pdf writing", () => {

		it("#writeAllFooters writes a footer on each document page", () => {
			const writeAllFooters = getFn("writeAllFooters");
			let result = {};

			writeAllFooters(docDouble(result, 3));
			const pageNumberElements = result.text.filter(e => e[0].indexOf("Page ") !== -1);

			assert.equal(pageNumberElements.length, 3);
			pageNumberElements.forEach((e, i) => {
				assert.notEqual(e[0].indexOf(`${i + 1}`), -1);
			});
		});

		it("#writeAddress writes the 4 address lines", () => {
			const writeAddress = getFn("writeAddress");
			let result = {};

			writeAddress(docDouble(result));

			assert.equal(result.text.length, 4);
		});

		it("#wrapDetails writes a field and its value at the current doc.y", () => {
			const wrapDetails = getFn("wrapDetails");
			const pair = ["Hi mate", "yup"];
			let result = {};

			wrapDetails(docDouble(result), pair);

			assert.equal(result.text[0][0], "Hi mate");
			assert.equal(result.text[1][0], "yup");

			result = {};

			wrapDetails(docDouble(result), ["hi Mate", ""]);

			assert.equal(result.text[1][0], " ");
		});
	});

	// describe("pdfMaker", () => {

	// 	it("#calls the cb with the created PDF, job items sorted by the pdf_order prop", done => {
	// 		pdfMaker(pdfJob, pdf => {
	// 			const bufs = [];
	// 			pdf.on("data", (chunk) => bufs.push(chunk));
	// 			pdf.on("end", () => {
	// 				const buf = Buffer.concat(bufs);
	// 				const pdfWeWant = fs.readFileSync(path.join(__dirname, "/pdf/1009PDF.pdf"));
	// 				assert.deepEqual(buf, pdfWeWant);
	// 				done();
	// 			});
	// 		});
	// 	});

	// });
});
