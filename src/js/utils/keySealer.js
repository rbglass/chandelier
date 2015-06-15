"use strict";

// AM I MISSING SOMETHING???
export default (id, key, action) => {
	return (e) => {
		action({
			id: id,
			key: key,
			// We want numeric numbers, but not numeric dates
			// Hence we don't use valueAsNumber
			value: +e.target.value || e.target.value
		});
	};
};
