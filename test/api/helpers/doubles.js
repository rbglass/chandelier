"use strict";
import sinon from "sinon";
import pg from "pg";

export default {
	replyDouble(ref) {
		function reply(data) {
			ref.data = data;
			return {
				code(num) {
					ref.code = num;
					return this;
				},
				redirect(location) {
					ref.redirect = location;
					return this;
				},
				type(mime) {
					ref.type = mime;
					return this;
				},
				header(...h) {
					ref.header = h;
					return this;
				}
			};
		}

		reply.file = function(file) {
			ref.file = file;
		};

		reply.redirect = function(loc) {
			ref.redirect = loc;
		};

		return reply;
	},

	connectDouble(errLevel, onClientCallNum) {
		return function(cb) {
			if(errLevel === "connect") return cb("ERROR");
			let count = 0;
			onClientCallNum = onClientCallNum || 1;

			const client = {
				query(str, idOrCb2, cb2) {
					const fn = typeof idOrCb2 === "function" ? idOrCb2 : cb2;
					count += 1;
					if (errLevel === "query" &&
							count === onClientCallNum) return fn("ERROR");
					else fn(null, str);
				}
			};

			cb(null, client, () => {});

		};
	},

	pgStub() {
		return sinon.stub(pg, "Client", str => {
			return {
				connect() {
					return str;
				}
			};
		});
	},

	docDouble(ref, pages) {

		function pushToProp(prop) {
			return (...args) => {
				if (Array.isArray(ref[prop])) {
					ref[prop].push(args);
				} else {
					ref[prop] = [args];
				}
				return this;
			};
		}

		let doc = {};
		const p = pushToProp.bind(doc);

		doc.text         = p("text");
		doc.image        = p("image");
		doc.font         = p("font");
		doc.fontSize     = p("fontSize");
		doc.moveDown     = p("moveDown");
		doc.moveTo       = p("moveTo");
		doc.lineTo       = p("lineTo");
		doc.addPage      = p("addPage");
		doc.switchToPage = p("switchToPage");
		doc.registerFont = p("registerFont");
		doc.end          = p("end");

		doc.x = 0;
		doc.y = 0;

		doc.bufferedPageRange = function() {
			return {start: 0, count: pages || 3};
		};

		return doc;
	}
};
