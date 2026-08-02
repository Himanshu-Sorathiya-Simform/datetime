import {
	DURATION_LABELS,
	DURATION_UNIT_KEYS,
	MS_PER_DAY,
	MS_PER_HOUR,
	MS_PER_MINUTE,
	MS_PER_SECOND,
} from "../constants/constants.js";
import { toDate } from "../core/create.js";
import { addDays, addHours, addMinutes, addMonths, addYears } from "../math/add.js";
import {
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	differenceInMonths,
	differenceInSeconds,
	differenceInYears,
} from "../math/difference.js";
import type { DateInterval, Duration } from "../types/types.js";

function intervalToDuration(interval: DateInterval): Duration {
	const start = toDate(interval.start);
	const end = toDate(interval.end);

	const [from, to] =
		start.getTime() <= end.getTime() ? [start, end] : [end, start];
	const years = differenceInYears(to, from);
	const anchor1 = addYears(from, years);
	const months = differenceInMonths(to, anchor1);
	const anchor2 = addMonths(anchor1, months);
	const days = differenceInDays(to, anchor2);
	const anchor3 = addDays(anchor2, days);
	const hours = differenceInHours(to, anchor3);
	const anchor4 = addHours(anchor3, hours);
	const minutes = differenceInMinutes(to, anchor4);
	const anchor5 = addMinutes(anchor4, minutes);
	const seconds = differenceInSeconds(to, anchor5);

	return { years, months, days, hours, minutes, seconds };
}

function durationToMilliseconds(duration: Duration): number {
	const MS_PER_YEAR = 365.25 * MS_PER_DAY;
	const MS_PER_MONTH = 30.4375 * MS_PER_DAY;

	return (
		(duration.years ?? 0) * MS_PER_YEAR
		+ (duration.months ?? 0) * MS_PER_MONTH
		+ (duration.weeks ?? 0) * 7 * MS_PER_DAY
		+ (duration.days ?? 0) * MS_PER_DAY
		+ (duration.hours ?? 0) * MS_PER_HOUR
		+ (duration.minutes ?? 0) * MS_PER_MINUTE
		+ (duration.seconds ?? 0) * MS_PER_SECOND
	);
}

function formatDuration(
	duration: Duration,
	options?: {
		format?: ReadonlyArray<keyof Duration>;
		zero?: boolean;
		delimiter?: string;
		locale?: string;
	},
): string {
	const includeZero = options?.zero ?? false;
	const delimiter = options?.delimiter ?? ", ";
	const locale = options?.locale ?? "default";
	const keys = options?.format ?? DURATION_UNIT_KEYS;

	const pr = new Intl.PluralRules(locale);
	const nf = new Intl.NumberFormat(locale);
	const parts: string[] = [];

	for (const key of keys) {
		const value = duration[key] ?? 0;

		if (value === 0 && !includeZero) continue;

		const [singular, plural] = DURATION_LABELS[key];

		const label = pr.select(value) === "one" ? singular : plural;

		parts.push(`${nf.format(value)} ${label}`);
	}

	return parts.join(delimiter);
}

export { durationToMilliseconds, formatDuration, intervalToDuration };
