"use strict";
import path from "path";
import assert from "assert";
import home from "../../../api/handlers/home";
import { replyDouble } from "../helpers/doubles";

describe("home", () => {

	describe(".sweethome", () => {
		let result, reply;

		beforeEach(() => {
			result = {};
			reply = replyDouble(result);
		});

		it("#redirects the user to /login if they're not authenticated", () => {
			const req = {
				auth: {
					isAuthenticated: false
				}
			};

			home.sweethome(req, reply);

			assert.equal(result.redirect, "/login");
		});

		it("#replies with index.html if they are logged in", () => {
			const req = {
				auth: {
					isAuthenticated: true
				}
			};

			home.sweethome(req, reply);
			assert.equal(path.basename(result.file), "index.html");
		});
	});
});
