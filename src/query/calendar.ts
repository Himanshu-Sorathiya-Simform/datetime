import { toDate } from "../core/create.js";
import { isValid } from "../core/validation.js";
import type { DateInput, WeekStartsOn } from "../types/types.js";
import { isSameDay, isSameMonth, isSameWeek, isSameYear } from "./equality.js";

function isToday(date: DateInput): boolean {
	return isSameDay(date, new Date());
}

function isYesterday(date: DateInput): boolean {
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);

	return isSameDay(date, yesterday);
}

function isTomorrow(date: DateInput): boolean {
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);

	return isSameDay(date, tomorrow);
}

function isThisWeek(date: DateInput, weekStartsOn: WeekStartsOn = 0): boolean {
	return isSameWeek(date, new Date(), weekStartsOn);
}

function isThisMonth(date: DateInput): boolean {
	return isSameMonth(date, new Date());
}

function isThisYear(date: DateInput): boolean {
	return isSameYear(date, new Date());
}

function isFirstDayOfMonth(date: DateInput): boolean {
	const d = toDate(date);

	if (!isValid(d)) return false;

	return d.getDate() === 1;
}

function isLastDayOfMonth(date: DateInput): boolean {
	const d = toDate(date);

	if (!isValid(d)) return false;

	const next = new Date(d);
	next.setDate(next.getDate() + 1);

	return next.getMonth() !== d.getMonth();
}

function isWeekend(date: DateInput): boolean {
	const d = toDate(date);

	if (!isValid(d)) return false;
	const day = d.getDay();

	return day === 0 || day === 6;
}

function isWeekday(date: DateInput): boolean {
	const d = toDate(date);

	if (!isValid(d)) return false;

	const day = d.getDay();

	return day >= 1 && day <= 5;
}

function isAM(date: DateInput): boolean {
	const d = toDate(date);

	if (!isValid(d)) return false;

	return d.getHours() < 12;
}

function isPM(date: DateInput): boolean {
	const d = toDate(date);

	if (!isValid(d)) return false;

	return d.getHours() >= 12;
}

function isLeapYear(yearOrDate: number | Date): boolean {
	let year: number;

	if (yearOrDate instanceof Date) {
		if (!isValid(yearOrDate)) return false;

		year = yearOrDate.getFullYear();
	} else {
		year = yearOrDate;
	}

	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function isInLeapYear(date: DateInput): boolean {
	const d = toDate(date);

	if (!isValid(d)) return false;

	return isLeapYear(d.getFullYear());
}

export {
	isAM,
	isFirstDayOfMonth,
	isInLeapYear,
	isLastDayOfMonth,
	isLeapYear,
	isPM,
	isThisMonth,
	isThisWeek,
	isThisYear,
	isToday,
	isTomorrow,
	isWeekday,
	isWeekend,
	isYesterday,
};
