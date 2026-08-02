import {
	FORMAT_REGEX,
	TOKEN_FORMATTERS,
	type FormatToken,
} from "../constants/constants.js";
import { toDate } from "../core/create.js";
import { isValid } from "../core/validation.js";
import type { DateInput } from "../types/types.js";

function format(
	date: DateInput,
	formatString: string,
	options?: { locale?: string },
): string {
	const d = toDate(date);

	if (!isValid(d)) return "Invalid Date";

	const locale = options?.locale ?? "default";

	return formatString.replace(FORMAT_REGEX, (match) => {
		if (match.startsWith("'")) {
			const inner = match.slice(1, -1);

			return inner === "" ? "'" : inner;
		}

		const handler = TOKEN_FORMATTERS[match as FormatToken];

		return handler(d, locale);
	});
}

function formatDate(
	date: DateInput,
	locale: string | string[] = "default",
	options: Intl.DateTimeFormatOptions = {},
): string {
	const d = toDate(date);

	if (!isValid(d)) return "Invalid Date";

	return new Intl.DateTimeFormat(locale, options).format(d);
}

function formatInTimeZone(
	date: DateInput,
	formatString: string,
	timeZone: string,
	options?: { locale?: string },
): string {
	const d = toDate(date);

	if (!isValid(d)) return "Invalid Date";

	let shiftedDate = d;
	try {
		const parts = new Intl.DateTimeFormat("en-US", {
			timeZone,
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
			hour12: false,
		}).formatToParts(d);

		let y, m, day, h, min, s;
		for (const part of parts) {
			if (part.type === "year") y = parseInt(part.value, 10);
			if (part.type === "month") m = parseInt(part.value, 10) - 1;
			if (part.type === "day") day = parseInt(part.value, 10);
			if (part.type === "hour") {
				h = parseInt(part.value, 10);
				if (h === 24) h = 0;
			}
			if (part.type === "minute") min = parseInt(part.value, 10);
			if (part.type === "second") s = parseInt(part.value, 10);
		}

		shiftedDate = new Date(y!, m!, day!, h!, min!, s!, d.getMilliseconds());
	} catch {
		shiftedDate = d;
	}

	return format(shiftedDate, formatString, options);
}

export { format, formatDate, formatInTimeZone };
