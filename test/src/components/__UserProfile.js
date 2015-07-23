"use strict";
import assert from "assert";
import React from "react/addons";
let { TestUtils }  = React.addons;

import UserProfile from "../../../src/js/components/common/UserProfile";

describe("UserProfile", () => {

	const profile = {
		user: "hello",
		avatar: "12345"
	};

	it("#renders the user's name and avatar", () => {
		const ShallowRenderer = TestUtils.createRenderer();
		ShallowRenderer.render(
			<UserProfile user={profile.user} avatar={profile.avatar}/>
		);
		const renderedOutput = ShallowRenderer.getRenderOutput();
		const kids = renderedOutput.props.children;

		assert(kids[1].props.children.includes(profile.user));
		assert.equal(kids[0].type, "img");
		assert(kids[0].props.src.includes(profile.avatar));
	});
});
