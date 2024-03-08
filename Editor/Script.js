"use strict";

import { Sheet } from "../Scripts/Structure.js";

try {
	window.addEventListener(`paste`, async ({ clipboardData }) => {
		try {
			if (clipboardData) {
				const text = clipboardData.getData(`text`);
				const notation = Sheet.parse(text.trim());
				const data = JSON.stringify(notation, undefined, `\t`)
					.replace(/(\{)\n\s*("text": .+)\n\s*("correctness": .+)\n\s*(\})/g, `$1 $2 $3 $4`);
				console.log(data);
			}
		} catch (error) {
			await window.stabilize(Error.generate(error));
		}
	});
} catch (error) {
	await window.stabilize(Error.generate(error));
}