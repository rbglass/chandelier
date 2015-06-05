"use strict";

// AM I MISSING SOMETHING???
export default (id, key, action) => {
	return (e) => {
		action({
			id: id,
			key: key,
			// TERRIBLE HACK TO GET AROUND BLOODY STRNUMS
			value: +e.target.value || e.target.value
		});
	};
};
