"use strict";

// probably not necessary after refactoring...
export default (id, key, action) => {
	return (e) => {
		action({
			id: id,
			key: key,
			value: e.target.value
		});
	};
};
