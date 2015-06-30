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

	pgStub() {
		return sinon.stub(pg, "Client", str => {
			return {
				connect() {
					return str;
				}
			};
		});
	}
};
