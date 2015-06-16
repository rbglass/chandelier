"use strict";

export default (id, key, action, isNum) => {
	return (e) => {
		action({
			id: id,
			key: key,
			value: isNum ? +e.target.value : e.target.value
		});
	};
};
