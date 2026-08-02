import { addYears } from "../math/add.js";
import { differenceInMonths } from "../math/difference.js";

function _yearHedge(target: Date, base: Date, completedYears: number): string {
	const remainderStart = addYears(base, completedYears);
	const remainderMonths = Math.abs(differenceInMonths(target, remainderStart));
	const remainderRatio = remainderMonths / 12;

	if (remainderRatio <= 0.1) {
		return completedYears === 1 ? "about a year" : (
				`about ${completedYears} years`
			);
	}

	if (remainderRatio >= 0.85) {
		const n = completedYears + 1;

		return n === 1 ? "almost a year" : `almost ${n} years`;
	}

	return completedYears === 1 ? "over a year" : `over ${completedYears} years`;
}

export { _yearHedge };
