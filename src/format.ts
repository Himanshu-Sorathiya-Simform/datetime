import {
	type FormatToken,
	DURATION_LABELS,
	DURATION_UNIT_KEYS,
	FORMAT_REGEX,
	RFC2822_DAYS,
	RFC2822_MONTHS,
	TOKEN_FORMATTERS,
} from './constants.js';
import { isValid, toDate } from './core';
import { _tzParts } from './internals.js';
import {
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	differenceInSeconds,
} from './manipulation';
import type { DateInput, Duration } from './types';

function format(
	date: DateInput,
	formatString: string,
	options?: { locale?: string },
): string {
	const d = toDate(date);

	if (!isValid(d)) return 'Invalid Date';

	const locale = options?.locale ?? 'default';

	return formatString.replace(FORMAT_REGEX, (match) => {
		if (match.startsWith("'")) {
			const inner = match.slice(1, -1);
			return inner === '' ? "'" : inner;
		}

		const handler = TOKEN_FORMATTERS[match as FormatToken];

		return handler(d, locale);
	});
}

function formatDate(
	date: DateInput,
	locale: string = 'default',
	options: Intl.DateTimeFormatOptions = {},
): string {
	const d = toDate(date);

	if (!isValid(d)) return 'Invalid Date';

	return new Intl.DateTimeFormat(locale, options).format(d);
}

function formatRelativeTime(
	date: DateInput,
	baseDate: DateInput = new Date(),
	locale: string = 'default',
): string {
	const d = toDate(date);
	const base = toDate(baseDate);

	if (!isValid(d) || !isValid(base)) return 'Invalid Date';

	const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
	const abs = Math.abs.bind(Math);

	const seconds = differenceInSeconds(d, base);
	const minutes = differenceInMinutes(d, base);
	const hours = differenceInHours(d, base);
	const days = differenceInDays(d, base);
	const weeks = Math.trunc(days / 7);
	const months = Math.round(days / 30.4375);
	const years = Math.round(days / 365.25);

	if (abs(seconds) < 60) return rtf.format(seconds, 'second');
	if (abs(minutes) < 60) return rtf.format(minutes, 'minute');
	if (abs(hours) < 24) return rtf.format(hours, 'hour');
	if (abs(days) < 7) return rtf.format(days, 'day');
	if (abs(weeks) < 4) return rtf.format(weeks, 'week');
	if (abs(months) < 12) return rtf.format(months, 'month');

	return rtf.format(years, 'year');
}

function formatISO(
	date: DateInput,
	options?: {
		format?: 'extended' | 'basic';
		representation?: 'complete' | 'date' | 'time';
	},
): string {
	const d = toDate(date);
	if (!isValid(d)) return 'Invalid Date';

	const fmt = options?.format ?? 'extended';
	const rep = options?.representation ?? 'complete';
	const sep = fmt === 'extended' ? '-' : '';
	const timeSep = fmt === 'extended' ? ':' : '';

	const year = String(d.getFullYear()).padStart(4, '0');
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	const hours = String(d.getHours()).padStart(2, '0');
	const minutes = String(d.getMinutes()).padStart(2, '0');
	const seconds = String(d.getSeconds()).padStart(2, '0');
	const tz = _tzParts(d);
	const tzStr = `${tz.sign}${tz.hours}${timeSep}${tz.minutes}`;

	const datePart = `${year}${sep}${month}${sep}${day}`;
	const timePart = `${hours}${timeSep}${minutes}${timeSep}${seconds}`;

	if (rep === 'date') return datePart;
	if (rep === 'time') return `${timePart}${tzStr}`;

	return `${datePart}T${timePart}${tzStr}`;
}

function formatRFC3339(
	date: DateInput,
	options?: { fractionDigits?: 0 | 1 | 2 | 3 },
): string {
	const d = toDate(date);
	if (!isValid(d)) return 'Invalid Date';

	const fractionDigits = options?.fractionDigits ?? 0;
	const year = String(d.getFullYear()).padStart(4, '0');
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	const hours = String(d.getHours()).padStart(2, '0');
	const minutes = String(d.getMinutes()).padStart(2, '0');
	const seconds = String(d.getSeconds()).padStart(2, '0');

	const fraction =
		fractionDigits > 0 ?
			'.' +
			String(d.getMilliseconds()).padStart(3, '0').slice(0, fractionDigits)
		:	'';

	const rawOffset = d.getTimezoneOffset();
	const tz =
		rawOffset === 0 ? 'Z' : (
			(() => {
				const t = _tzParts(d);
				return `${t.sign}${t.hours}:${t.minutes}`;
			})()
		);

	return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${fraction}${tz}`;
}

function formatISO9075(
	date: DateInput,
	options?: { representation?: 'complete' | 'date' | 'time' },
): string {
	const d = toDate(date);
	if (!isValid(d)) return 'Invalid Date';

	const rep = options?.representation ?? 'complete';
	const year = String(d.getFullYear()).padStart(4, '0');
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	const hours = String(d.getHours()).padStart(2, '0');
	const minutes = String(d.getMinutes()).padStart(2, '0');
	const seconds = String(d.getSeconds()).padStart(2, '0');

	if (rep === 'date') return `${year}-${month}-${day}`;
	if (rep === 'time') return `${hours}:${minutes}:${seconds}`;

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function formatRFC2822(date: DateInput): string {
	const d = toDate(date);
	if (!isValid(d)) return 'Invalid Date';

	const dayName = RFC2822_DAYS[d.getDay()];
	const dayOfMonth = String(d.getDate()).padStart(2, '0');
	const monthName = RFC2822_MONTHS[d.getMonth()];
	const year = d.getFullYear();
	const hours = String(d.getHours()).padStart(2, '0');
	const minutes = String(d.getMinutes()).padStart(2, '0');
	const seconds = String(d.getSeconds()).padStart(2, '0');
	const tz = _tzParts(d);

	return `${dayName}, ${dayOfMonth} ${monthName} ${year} ${hours}:${minutes}:${seconds} ${tz.sign}${tz.hours}${tz.minutes}`;
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
	const delimiter = options?.delimiter ?? ', ';
	const locale = options?.locale ?? 'default';
	const keys = options?.format ?? DURATION_UNIT_KEYS;

	const pr = new Intl.PluralRules(locale);
	const nf = new Intl.NumberFormat(locale);
	const parts: string[] = [];

	for (const key of keys) {
		const value = duration[key] ?? 0;
		if (value === 0 && !includeZero) continue;

		const [singular, plural] = DURATION_LABELS[key];

		const label = pr.select(value) === 'one' ? singular : plural;

		parts.push(`${nf.format(value)} ${label}`);
	}

	return parts.join(delimiter);
}

function toISOString(date: DateInput): string {
	const d = toDate(date);

	if (!isValid(d)) return 'Invalid Date';

	return d.toISOString();
}

const ISO_8601_REGEX =
	/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

function parseISO(isoString: string): Date {
	if (!ISO_8601_REGEX.test(isoString.trim())) {
		return new Date(NaN);
	}

	return new Date(isoString);
}

export {
	format,
	formatDate,
	formatDuration,
	formatISO,
	formatISO9075,
	formatRelativeTime,
	formatRFC2822,
	formatRFC3339,
	parseISO,
	toISOString,
};
