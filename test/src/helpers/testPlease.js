"use strict";
import { dispyDouble } from "../helpers/doubles";

// Basically an automated way to test my badly written action files
// The testing is more efficient than the actual code...

export default function(testDefinitions, file) {
	testDefinitions.forEach(def => {
		it(`.${def.fn} dispatches ${def.desc} with type ${def.type}`, () => {
			const st = dispyDouble(def.type, def.want);
			file[def.fn](...def.give);
			st.restore();
		});
	});
}
