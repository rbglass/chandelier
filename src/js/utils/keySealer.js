"use strict";

// AM I MISSING SOMETHING???
export default (id, key, action) => {
	return (e) => {
		action({
			id: id,
			key: key,
			value: e.target.value
		});
	};
};
