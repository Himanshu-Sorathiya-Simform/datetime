import { startOfWeek } from "../boundaries/startOf.js";
import {
	ALMOST_A_DAY_HOURS,
	ALMOST_A_MONTH_DAYS,
	MS_PER_DAY,
	MS_PER_HOUR,
	MS_PER_MINUTE,
	MS_PER_SECOND,
	ROUNDERS,
} from "../constants/constants.js";
import { toDate } from "../core/create.js";
import { isValid } from "../core/validation.js";
import { _applySuffix } from "../internals/_applySuffix.js";
import { _formatUnderAMinute } from "../internals/_formatUnderAMinute.js";
import { _monthHedge } from "../internals/_monthHedge.js";
import { _pluralize } from "../internals/_pluralize.js";
import { _resolveIntlUnit } from "../internals/_resolveIntlUnit.js";
import { _yearHedge } from "../internals/_yearHedge.js";
import {
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	differenceInMonths,
	differenceInSeconds,
	differenceInYears,
} from "../math/difference.js";
import type {
	DateInput,
	FormatDistanceIntlOptions,
	FormatDistanceOptions,
	FormatDistanceStrictOptions,
	FormatDistanceStrictUnit,
	FormatDistanceToNowOptions,
	FormatRelativeOptions,
} from "../types/types.js";
import { getTimestamp } from "../units/get.js";
import { format, formatDate } from "./standard.js";

function formatRelativeTime(
	date: DateInput,
	baseDate: DateInput = new Date(),
	locale: string | string[] = "default",
): string {
	const d = toDate(date);
	const base = toDate(baseDate);

	if (!isValid(d) || !isValid(base)) return "Invalid Date";

	const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
	const abs = Math.abs.bind(Math);

	const seconds = differenceInSeconds(d, base);
	const minutes = differenceInMinutes(d, base);
	const hours = differenceInHours(d, base);
	const days = differenceInDays(d, base);
	const weeks = Math.trunc(days / 7);
	const months = Math.round(days / 30.4375);
	const years = Math.round(days / 365.25);

	if (abs(seconds) < 60) return rtf.format(seconds, "second");
	if (abs(minutes) < 60) return rtf.format(minutes, "minute");
	if (abs(hours) < 24) return rtf.format(hours, "hour");
	if (abs(days) < 7) return rtf.format(days, "day");
	if (abs(weeks) < 4) return rtf.format(weeks, "week");
	if (abs(months) < 12) return rtf.format(months, "month");

	return rtf.format(years, "year");
}

function formatDistance(
	date: DateInput,
	baseDate: DateInput,
	options: FormatDistanceOptions = {},
): string {
	const target = toDate(date);
	const base = toDate(baseDate);

	if (!isValid(target) || !isValid(base)) {
		return "Invalid Date";
	}

	const { addSuffix = false, includeSeconds = false } = options;

	const diffMs = getTimestamp(target) - getTimestamp(base);
	const isFuture = diffMs > 0;
	const absMs = Math.abs(diffMs);

	const seconds = absMs / MS_PER_SECOND;
	const minutes = absMs / MS_PER_MINUTE;
	const hours = absMs / MS_PER_HOUR;
	const days = absMs / MS_PER_DAY;

	let result: string;

	if (seconds < 45) {
		result =
			includeSeconds ? _formatUnderAMinute(seconds) : "less than a minute";
	} else if (seconds < 90) {
		result = "a minute";
	} else if (minutes < 45) {
		result = `${Math.round(minutes)} minutes`;
	} else if (minutes < 90) {
		result = "about an hour";
	} else if (hours < 22) {
		result = `about ${Math.round(hours)} hours`;
	} else if (hours < ALMOST_A_DAY_HOURS) {
		result = "a day";
	} else if (days < ALMOST_A_MONTH_DAYS) {
		result = `${Math.round(hours / 24)} days`;
	} else {
		const completedMonths = Math.abs(differenceInMonths(target, base));

		if (completedMonths < 1) {
			result = "almost a month";
		} else if (completedMonths < 12) {
			result = _monthHedge(target, base, completedMonths);
		} else {
			const completedYears = Math.abs(differenceInYears(target, base));
			result = _yearHedge(target, base, completedYears);
		}
	}

	return _applySuffix(result, isFuture, addSuffix);
}

function formatDistanceStrict(
	date: DateInput,
	baseDate: DateInput,
	options: FormatDistanceStrictOptions = {},
): string {
	const target = toDate(date);
	const base = toDate(baseDate);

	if (!isValid(target) || !isValid(base)) {
		return "Invalid Date";
	}

	const { addSuffix = false, unit, roundingMethod = "round" } = options;
	const round = ROUNDERS[roundingMethod];

	const diffMs = getTimestamp(target) - getTimestamp(base);
	const isFuture = diffMs > 0;
	const absMs = Math.abs(diffMs);

	let resolvedUnit: FormatDistanceStrictUnit;
	let count: number;

	if (
		unit === "year"
		|| (!unit && Math.abs(differenceInYears(target, base)) >= 1)
	) {
		resolvedUnit = "year";
		count = Math.abs(differenceInYears(target, base));
	} else if (
		unit === "month"
		|| (!unit && Math.abs(differenceInMonths(target, base)) >= 1)
	) {
		resolvedUnit = "month";
		count = Math.abs(differenceInMonths(target, base));
	} else if (
		unit === "day"
		|| (!unit && Math.abs(differenceInDays(target, base)) >= 1)
	) {
		resolvedUnit = "day";
		count = Math.abs(differenceInDays(target, base));
	} else if (unit === "hour" || (!unit && absMs >= MS_PER_HOUR)) {
		resolvedUnit = "hour";
		count = round(absMs / MS_PER_HOUR);
	} else if (unit === "minute" || (!unit && absMs >= MS_PER_MINUTE)) {
		resolvedUnit = "minute";
		count = round(absMs / MS_PER_MINUTE);
	} else {
		resolvedUnit = "second";
		count = round(absMs / MS_PER_SECOND);
	}

	const text = _pluralize(count, resolvedUnit);

	return _applySuffix(text, isFuture, addSuffix);
}

function formatDistanceToNow(
	date: DateInput,
	options: FormatDistanceToNowOptions = {},
): string {
	return formatDistance(date, new Date(), options);
}

function formatDistanceIntl(
	date: DateInput,
	baseDate: DateInput,
	options: FormatDistanceIntlOptions = {},
): string {
	const target = toDate(date);
	const base = toDate(baseDate);

	if (!isValid(target) || !isValid(base)) {
		return "Invalid Date";
	}

	const { locale, numeric = "auto", style = "long", unit } = options;
	const { unit: resolvedUnit, count } = _resolveIntlUnit(target, base, unit);

	if (
		typeof Intl === "undefined"
		|| typeof Intl.RelativeTimeFormat === "undefined"
	) {
		const text = _pluralize(Math.abs(count), resolvedUnit);

		return _applySuffix(text, count > 0, true);
	}

	let formatter: Intl.RelativeTimeFormat;
	try {
		formatter = new Intl.RelativeTimeFormat(locale, { numeric, style });
	} catch {
		formatter = new Intl.RelativeTimeFormat(undefined, { numeric, style });
	}

	return formatter.format(count, resolvedUnit as Intl.RelativeTimeFormatUnit);
}

function formatRelative(
	date: DateInput,
	baseDate: DateInput,
	options: FormatRelativeOptions = {},
): string {
	const target = toDate(date);
	const base = toDate(baseDate);

	if (!isValid(target) || !isValid(base)) {
		return "Invalid Date";
	}

	const {
		weekStartsOn = 0,
		timeFormat = "h:mm a",
		fallbackFormat,
		locale,
	} = options;

	const dayDiff = differenceInDays(target, base);
	const timeStr = format(target, timeFormat);

	if (dayDiff === 0) return `Today at ${timeStr}`;
	if (dayDiff === 1) return `Tomorrow at ${timeStr}`;
	if (dayDiff === -1) return `Yesterday at ${timeStr}`;

	const targetWeekStart = startOfWeek(target, weekStartsOn);
	const baseWeekStart = startOfWeek(base, weekStartsOn);
	const weekStartDiff = differenceInDays(targetWeekStart, baseWeekStart);

	const weekday = format(target, "EEEE");

	if (weekStartDiff === 0) return `${weekday} at ${timeStr}`;
	if (weekStartDiff === 7) return `Next ${weekday} at ${timeStr}`;
	if (weekStartDiff === -7) return `Last ${weekday} at ${timeStr}`;

	return fallbackFormat ?
			format(target, fallbackFormat)
		:	formatDate(target, locale);
}

export {
	formatDistance,
	formatDistanceIntl,
	formatDistanceStrict,
	formatDistanceToNow,
	formatRelative,
	formatRelativeTime,
};
