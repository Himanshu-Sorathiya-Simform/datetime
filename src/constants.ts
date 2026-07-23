import { getDayOfYear } from "./core.js";
import { _tzParts } from "./internals.js";
import { getISOWeek } from "./manipulation.js";
import type { Duration, RoundingMethod } from "./types.js";

const MS_PER_SECOND = 1_000;
const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 3_600_000;
const MS_PER_DAY = 86_400_000;

const AVG_DAYS_IN_MONTH = 30.44;
const ALMOST_A_DAY_HOURS = 42;
const ALMOST_A_MONTH_DAYS = 27;

const TOKEN_FORMATTERS = {
	yyyy: (d: Date) => String(d.getFullYear()).padStart(4, "0"),
	yy: (d: Date) => String(d.getFullYear()).slice(-2),

	MMMM: (d: Date, loc: string) =>
		new Intl.DateTimeFormat(loc, { month: "long" }).format(d),
	MMM: (d: Date, loc: string) =>
		new Intl.DateTimeFormat(loc, { month: "short" }).format(d),
	MM: (d: Date) => String(d.getMonth() + 1).padStart(2, "0"),
	M: (d: Date) => String(d.getMonth() + 1),

	dd: (d: Date) => String(d.getDate()).padStart(2, "0"),
	d: (d: Date) => String(d.getDate()),

	EEEE: (d: Date, loc: string) =>
		new Intl.DateTimeFormat(loc, { weekday: "long" }).format(d),
	EEE: (d: Date, loc: string) =>
		new Intl.DateTimeFormat(loc, { weekday: "short" }).format(d),
	E: (d: Date, loc: string) =>
		new Intl.DateTimeFormat(loc, { weekday: "short" }).format(d),

	HH: (d: Date) => String(d.getHours()).padStart(2, "0"),
	H: (d: Date) => String(d.getHours()),
	hh: (d: Date) => String(d.getHours() % 12 || 12).padStart(2, "0"),
	h: (d: Date) => String(d.getHours() % 12 || 12),

	mm: (d: Date) => String(d.getMinutes()).padStart(2, "0"),
	ss: (d: Date) => String(d.getSeconds()).padStart(2, "0"),
	SSS: (d: Date) => String(d.getMilliseconds()).padStart(3, "0"),

	a: (d: Date, loc: string) =>
		new Intl.DateTimeFormat(loc, { hour: "numeric", hour12: true })
			.formatToParts(d)
			.find((p) => p.type === "dayPeriod")?.value ?? "",

	Q: (d: Date) => String(Math.ceil((d.getMonth() + 1) / 3)),

	w: (d: Date) => String(getISOWeek(d)),

	D: (d: Date) => String(getDayOfYear(d)),

	xxx: (d: Date) => {
		const t = _tzParts(d);
		return `${t.sign}${t.hours}:${t.minutes}`;
	},
	xx: (d: Date) => {
		const t = _tzParts(d);
		return `${t.sign}${t.hours}${t.minutes}`;
	},
	x: (d: Date) => {
		const t = _tzParts(d);
		return `${t.sign}${t.hours}`;
	},
} satisfies Record<string, (date: Date, locale: string) => string>;

type FormatToken = keyof typeof TOKEN_FORMATTERS;

const FORMAT_REGEX = new RegExp(
	`'[^']*'|`
		+ (Object.keys(TOKEN_FORMATTERS) as FormatToken[])
			.sort((a, b) => b.length - a.length)
			.join("|"),
	"g",
);

const RFC2822_DAYS: readonly string[] = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
];
const RFC2822_MONTHS: readonly string[] = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

const DURATION_UNIT_KEYS: ReadonlyArray<keyof Duration> = [
	"years",
	"months",
	"weeks",
	"days",
	"hours",
	"minutes",
	"seconds",
];

const DURATION_LABELS: Readonly<Record<keyof Duration, [string, string]>> = {
	years: ["year", "years"],
	months: ["month", "months"],
	weeks: ["week", "weeks"],
	days: ["day", "days"],
	hours: ["hour", "hours"],
	minutes: ["minute", "minutes"],
	seconds: ["second", "seconds"],
};

const ISO_8601_REGEX =
	/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

const ROUNDERS: Record<RoundingMethod, (n: number) => number> = {
	round: Math.round,
	floor: Math.floor,
	ceil: Math.ceil,
};

export {
	ALMOST_A_DAY_HOURS,
	ALMOST_A_MONTH_DAYS,
	AVG_DAYS_IN_MONTH,
	DURATION_LABELS,
	DURATION_UNIT_KEYS,
	FORMAT_REGEX,
	ISO_8601_REGEX,
	MS_PER_DAY,
	MS_PER_HOUR,
	MS_PER_MINUTE,
	MS_PER_SECOND,
	RFC2822_DAYS,
	RFC2822_MONTHS,
	ROUNDERS,
	TOKEN_FORMATTERS,
	type FormatToken,
};
