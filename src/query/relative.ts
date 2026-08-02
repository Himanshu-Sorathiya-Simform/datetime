import { toDate } from "../core/create.js";
import { isValid } from "../core/validation.js";
import type { DateInput } from "../types/types.js";

function isBefore(date: DateInput, compareDate: DateInput): boolean {
	const a = toDate(date);
	const b = toDate(compareDate);

	if (!isValid(a) || !isValid(b)) return false;

	return a.getTime() < b.getTime();
}

function isAfter(date: DateInput, compareDate: DateInput): boolean {
	const a = toDate(date);
	const b = toDate(compareDate);

	if (!isValid(a) || !isValid(b)) return false;

	return a.getTime() > b.getTime();
}

function isSameOrBefore(date: DateInput, compareDate: DateInput): boolean {
	const a = toDate(date);
	const b = toDate(compareDate);

	if (!isValid(a) || !isValid(b)) return false;

	return a.getTime() <= b.getTime();
}

function isSameOrAfter(date: DateInput, compareDate: DateInput): boolean {
	const a = toDate(date);
	const b = toDate(compareDate);

	if (!isValid(a) || !isValid(b)) return false;

	return a.getTime() >= b.getTime();
}

function isEqual(dateA: DateInput, dateB: DateInput): boolean {
	const a = toDate(dateA);
	const b = toDate(dateB);

	if (!isValid(a) || !isValid(b)) return false;

	return a.getTime() === b.getTime();
}

function isPast(date: DateInput): boolean {
	const d = toDate(date);

	if (!isValid(d)) return false;

	return d.getTime() < Date.now();
}

function isFuture(date: DateInput): boolean {
	const d = toDate(date);

	if (!isValid(d)) return false;

	return d.getTime() > Date.now();
}

export {
	isAfter,
	isBefore,
	isEqual,
	isFuture,
	isPast,
	isSameOrAfter,
	isSameOrBefore,
};
