import { toDate } from "../core/create.js";
import { isValid } from "../core/validation.js";
import { _startOfWeekForDate } from "../internals/_startOfWeekForDate.js";
import type { DateInput, WeekStartsOn } from "../types/types.js";
import { getISOWeekYear } from "../units/get.js";

function isSameDay(dateA: DateInput, dateB: DateInput): boolean {
	const a = toDate(dateA);
	const b = toDate(dateB);

	if (!isValid(a) || !isValid(b)) return false;

	return (
		a.getFullYear() === b.getFullYear()
		&& a.getMonth() === b.getMonth()
		&& a.getDate() === b.getDate()
	);
}

function isSameMonth(dateA: DateInput, dateB: DateInput): boolean {
	const a = toDate(dateA);
	const b = toDate(dateB);

	if (!isValid(a) || !isValid(b)) return false;

	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function isSameYear(dateA: DateInput, dateB: DateInput): boolean {
	const a = toDate(dateA);
	const b = toDate(dateB);

	if (!isValid(a) || !isValid(b)) return false;

	return a.getFullYear() === b.getFullYear();
}

function isSameQuarter(dateA: DateInput, dateB: DateInput): boolean {
	const a = toDate(dateA);
	const b = toDate(dateB);

	if (!isValid(a) || !isValid(b)) return false;

	const qA = Math.ceil((a.getMonth() + 1) / 3);
	const qB = Math.ceil((b.getMonth() + 1) / 3);

	return a.getFullYear() === b.getFullYear() && qA === qB;
}

function isSameWeek(
	dateA: DateInput,
	dateB: DateInput,
	weekStartsOn: WeekStartsOn = 0,
): boolean {
	const a = toDate(dateA);
	const b = toDate(dateB);

	if (!isValid(a) || !isValid(b)) return false;

	return (
		_startOfWeekForDate(a, weekStartsOn).getTime()
		=== _startOfWeekForDate(b, weekStartsOn).getTime()
	);
}

function isSameHour(dateA: DateInput, dateB: DateInput): boolean {
	const a = toDate(dateA);
	const b = toDate(dateB);

	if (!isValid(a) || !isValid(b)) return false;

	return (
		a.getFullYear() === b.getFullYear()
		&& a.getMonth() === b.getMonth()
		&& a.getDate() === b.getDate()
		&& a.getHours() === b.getHours()
	);
}

function isSameMinute(dateA: DateInput, dateB: DateInput): boolean {
	const a = toDate(dateA);
	const b = toDate(dateB);

	if (!isValid(a) || !isValid(b)) return false;

	return (
		a.getFullYear() === b.getFullYear()
		&& a.getMonth() === b.getMonth()
		&& a.getDate() === b.getDate()
		&& a.getHours() === b.getHours()
		&& a.getMinutes() === b.getMinutes()
	);
}

function isSameSecond(dateA: DateInput, dateB: DateInput): boolean {
	const a = toDate(dateA);
	const b = toDate(dateB);

	if (!isValid(a) || !isValid(b)) return false;

	return (
		a.getFullYear() === b.getFullYear()
		&& a.getMonth() === b.getMonth()
		&& a.getDate() === b.getDate()
		&& a.getHours() === b.getHours()
		&& a.getMinutes() === b.getMinutes()
		&& a.getSeconds() === b.getSeconds()
	);
}

function isSameTime(dateA: DateInput, dateB: DateInput): boolean {
	const a = toDate(dateA);
	const b = toDate(dateB);

	if (!isValid(a) || !isValid(b)) return false;

	return (
		a.getHours() === b.getHours()
		&& a.getMinutes() === b.getMinutes()
		&& a.getSeconds() === b.getSeconds()
	);
}

function isSameISOWeekYear(dateA: DateInput, dateB: DateInput): boolean {
	const a = toDate(dateA);
	const b = toDate(dateB);

	if (!isValid(a) || !isValid(b)) return false;

	return getISOWeekYear(a) === getISOWeekYear(b);
}

export {
	isSameDay,
	isSameHour,
	isSameISOWeekYear,
	isSameMinute,
	isSameMonth,
	isSameQuarter,
	isSameSecond,
	isSameTime,
	isSameWeek,
	isSameYear,
};
