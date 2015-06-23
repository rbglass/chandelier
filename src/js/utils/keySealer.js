"use strict";

export default (id, key, action, isNum, isBool) => {
	return (e) => {
		let val = isNum ? +e.target.value :
							isBool ? e.target.checked :
							e.target.value;

		action({
			id: id,
			key: key,
			value: val
		});
	};
};
