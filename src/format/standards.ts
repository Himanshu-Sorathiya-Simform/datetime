import {
	ISO_8601_REGEX,
	RFC2822_DAYS,
	RFC2822_MONTHS,
} from "../constants/constants.js";
import { toDate } from "../core/create.js";
import { isValid } from "../core/validation.js";
import { _tzParts } from "../internals/_tzParts.js";
import type { DateInput } from "../types/types.js";

function formatISO(
	date: DateInput,
	options?: {
		format?: "extended" | "basic";
		representation?: "complete" | "date" | "time";
	},
): string {
	const d = toDate(date);

	if (!isValid(d)) return "Invalid Date";

	const fmt = options?.format ?? "extended";
	const rep = options?.representation ?? "complete";
	const sep = fmt === "extended" ? "-" : "";
	const timeSep = fmt === "extended" ? ":" : "";

	const year = String(d.getFullYear()).padStart(4, "0");
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	const hours = String(d.getHours()).padStart(2, "0");
	const minutes = String(d.getMinutes()).padStart(2, "0");
	const seconds = String(d.getSeconds()).padStart(2, "0");
	const tz = _tzParts(d);
	const tzStr = `${tz.sign}${tz.hours}${timeSep}${tz.minutes}`;

	const datePart = `${year}${sep}${month}${sep}${day}`;
	const timePart = `${hours}${timeSep}${minutes}${timeSep}${seconds}`;

	if (rep === "date") return datePart;
	if (rep === "time") return `${timePart}${tzStr}`;

	return `${datePart}T${timePart}${tzStr}`;
}

function formatRFC3339(
	date: DateInput,
	options?: { fractionDigits?: 0 | 1 | 2 | 3 },
): string {
	const d = toDate(date);

	if (!isValid(d)) return "Invalid Date";

	const fractionDigits = options?.fractionDigits ?? 0;
	const year = String(d.getFullYear()).padStart(4, "0");
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	const hours = String(d.getHours()).padStart(2, "0");
	const minutes = String(d.getMinutes()).padStart(2, "0");
	const seconds = String(d.getSeconds()).padStart(2, "0");

	const fraction =
		fractionDigits > 0 ?
			"."
			+ String(d.getMilliseconds()).padStart(3, "0").slice(0, fractionDigits)
		:	"";

	const rawOffset = d.getTimezoneOffset();
	const tz =
		rawOffset === 0 ? "Z" : (
			(() => {
				const t = _tzParts(d);
				return `${t.sign}${t.hours}:${t.minutes}`;
			})()
		);

	return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${fraction}${tz}`;
}

function formatISO9075(
	date: DateInput,
	options?: { representation?: "complete" | "date" | "time" },
): string {
	const d = toDate(date);

	if (!isValid(d)) return "Invalid Date";

	const rep = options?.representation ?? "complete";
	const year = String(d.getFullYear()).padStart(4, "0");
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	const hours = String(d.getHours()).padStart(2, "0");
	const minutes = String(d.getMinutes()).padStart(2, "0");
	const seconds = String(d.getSeconds()).padStart(2, "0");

	if (rep === "date") return `${year}-${month}-${day}`;
	if (rep === "time") return `${hours}:${minutes}:${seconds}`;

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function formatRFC2822(date: DateInput): string {
	const d = toDate(date);

	if (!isValid(d)) return "Invalid Date";

	const dayName = RFC2822_DAYS[d.getDay()];
	const dayOfMonth = String(d.getDate()).padStart(2, "0");
	const monthName = RFC2822_MONTHS[d.getMonth()];
	const year = d.getFullYear();
	const hours = String(d.getHours()).padStart(2, "0");
	const minutes = String(d.getMinutes()).padStart(2, "0");
	const seconds = String(d.getSeconds()).padStart(2, "0");
	const tz = _tzParts(d);

	return `${dayName}, ${dayOfMonth} ${monthName} ${year} ${hours}:${minutes}:${seconds} ${tz.sign}${tz.hours}${tz.minutes}`;
}

function toISOString(date: DateInput): string {
	const d = toDate(date);

	if (!isValid(d)) return "Invalid Date";

	return d.toISOString();
}

function parseISO(isoString: string): Date {
	if (!ISO_8601_REGEX.test(isoString.trim())) {
		return new Date(NaN);
	}

	return new Date(isoString);
}

export {
	formatISO,
	formatISO9075,
	formatRFC2822,
	formatRFC3339,
	parseISO,
	toISOString,
};
