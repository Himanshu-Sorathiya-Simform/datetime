import { MS_PER_HOUR, MS_PER_MINUTE, MS_PER_SECOND } from "./constants";
import { getTimestamp } from "./core";
import {
	differenceInDays,
	differenceInMonths,
	differenceInWeeks,
	differenceInYears,
} from "./manipulation";
import type { RelativeTimeUnit, WeekStartsOn } from "./types";

function _tzParts(date: Date): {
	sign: string;
	hours: string;
	minutes: string;
} {
	const rawOffset = date.getTimezoneOffset();
	const sign = rawOffset <= 0 ? "+" : "-";
	const abs = Math.abs(rawOffset);

	return {
		sign,
		hours: String(Math.floor(abs / 60)).padStart(2, "0"),
		minutes: String(abs % 60).padStart(2, "0"),
	};
}

function _startOfWeekForDate(d: Date, weekStartsOn: WeekStartsOn): Date {
	const result = new Date(d);

	const day = result.getDay();
	const diff = (day - weekStartsOn + 7) % 7;
	result.setDate(result.getDate() - diff);
	result.setHours(0, 0, 0, 0);

	return result;
}

function formatUnderAMinute(seconds: number): string {
	if (seconds < 5) return "less than 5 seconds";
	if (seconds < 10) return "less than 10 seconds";
	if (seconds < 20) return "less than 20 seconds";
	if (seconds < 40) return "less than 40 seconds";

	return "less than a minute";
}

function applySuffix(text: string, isFuture: boolean, addSuffix: boolean): string {
	if (!addSuffix) return text;

	return isFuture ? `in ${text}` : `${text} ago`;
}

function pluralize(count: number, unit: string): string {
	return `${count} ${unit}${count === 1 ? "" : "s"}`;
}

function countForUnit(target: Date, base: Date, unit: RelativeTimeUnit): number {
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

function resolveIntlUnit(
	target: Date,
	base: Date,
	forcedUnit?: RelativeTimeUnit,
): { unit: RelativeTimeUnit; count: number } {
	if (forcedUnit) {
		return { unit: forcedUnit, count: countForUnit(target, base, forcedUnit) };
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

export {
	_startOfWeekForDate,
	_tzParts,
	applySuffix,
	formatUnderAMinute,
	pluralize,
	resolveIntlUnit,
};
