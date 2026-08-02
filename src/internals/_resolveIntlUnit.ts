import {
	MS_PER_HOUR,
	MS_PER_MINUTE,
	MS_PER_SECOND,
} from "../constants/constants.js";
import {
	differenceInDays,
	differenceInMonths,
	differenceInWeeks,
	differenceInYears,
} from "../math/difference.js";
import type { RelativeTimeUnit } from "../types/types.js";
import { getTimestamp } from "../units/get.js";

function _countForUnit(target: Date, base: Date, unit: RelativeTimeUnit): number {
	switch (unit) {
		case "year":
			return differenceInYears(target, base);

		case "quarter":
			return Math.trunc(differenceInMonths(target, base) / 3);

		case "month":
			return differenceInMonths(target, base);

		case "week":
			return differenceInWeeks(target, base);

		case "day":
			return differenceInDays(target, base);

		case "hour":
			return Math.round(
				(getTimestamp(target) - getTimestamp(base)) / MS_PER_HOUR,
			);

		case "minute":
			return Math.round(
				(getTimestamp(target) - getTimestamp(base)) / MS_PER_MINUTE,
			);

		case "second":
			return Math.round(
				(getTimestamp(target) - getTimestamp(base)) / MS_PER_SECOND,
			);
	}
}

function _resolveIntlUnit(
	target: Date,
	base: Date,
	forcedUnit?: RelativeTimeUnit,
): { unit: RelativeTimeUnit; count: number } {
	if (forcedUnit) {
		return { unit: forcedUnit, count: _countForUnit(target, base, forcedUnit) };
	}

	const years = differenceInYears(target, base);
	if (Math.abs(years) >= 1) return { unit: "year", count: years };

	const months = differenceInMonths(target, base);
	if (Math.abs(months) >= 1) return { unit: "month", count: months };

	const weeks = differenceInWeeks(target, base);
	if (Math.abs(weeks) >= 1) return { unit: "week", count: weeks };

	const days = differenceInDays(target, base);
	if (Math.abs(days) >= 1) return { unit: "day", count: days };

	const diffMs = getTimestamp(target) - getTimestamp(base);
	if (Math.abs(diffMs) >= MS_PER_HOUR)
		return { unit: "hour", count: Math.round(diffMs / MS_PER_HOUR) };
	if (Math.abs(diffMs) >= MS_PER_MINUTE)
		return { unit: "minute", count: Math.round(diffMs / MS_PER_MINUTE) };

	return { unit: "second", count: Math.round(diffMs / MS_PER_SECOND) };
}

export { _countForUnit, _resolveIntlUnit };
