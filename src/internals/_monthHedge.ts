import { AVG_DAYS_IN_MONTH } from "../constants/constants.js";
import { addMonths } from "../math/add.js";
import { differenceInDays } from "../math/difference.js";

function _monthHedge(target: Date, base: Date, completedMonths: number): string {
	const remainderStart = addMonths(base, completedMonths);
	const remainderDays = Math.abs(differenceInDays(target, remainderStart));
	const remainderRatio = remainderDays / AVG_DAYS_IN_MONTH;

	if (remainderRatio <= 0.1) {
		return completedMonths === 1 ? "about a month" : (
				`about ${completedMonths} months`
			);
	}

	if (remainderRatio >= 0.85) {
		const n = completedMonths + 1;
		return n === 1 ? "almost a month" : `almost ${n} months`;
	}

	return completedMonths === 1 ? "over a month" : `over ${completedMonths} months`;
}

export { _monthHedge };
