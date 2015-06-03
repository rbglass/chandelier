"use strict";

export function getNode(column, val) {
	const numeric = /qty/i;
	const textArea = /description|notes|product/i;
	const dropDown = /glass|metal|flex|bulb/i;

	if(numeric.test(column)) {
		return <input type="number" min={0} value={val} />;
	} else if(textArea.test(column)) {
		return <textarea value={val} />;
	} else if(dropDown.test(column)) {
		return (
			<select>
				<option>blue</option>
			</select>
		);
	} else {
		return val;
	}

}
