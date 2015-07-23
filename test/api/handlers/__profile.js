"use strict";
import assert from "assert";
import sinon from "sinon";
import { replyDouble } from "../helpers/doubles";

// shouldn't be necessary with better structuring
import profile from "../../../api/handlers/profile";

describe("profile", () => {
	let result = {};

	const req = {
		auth: {
			credentials: {
				user: "jim",
				avatar: "www.ting.com"
			}
		}
	};

	const reply = replyDouble(result);

	it(".get should reply with the user's name and avatar", () => {
		profile.get(req, reply);

		assert.equal(result.data.user, req.auth.credentials.user);
		assert.equal(result.data.avatar, req.auth.credentials.avatar);
	});
});
