"use strict";

// probably not necessary after refactoring...
export default (id, key, action) => {
	return (e) => {
		action({
			item: id,
			key: key,
			value: e.target.value
		});
	};
};
