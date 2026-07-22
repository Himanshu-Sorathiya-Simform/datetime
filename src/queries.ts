import { isValid, toDate } from './core';
import type { DateInput, DateRange, WeekStartsOn } from './types';

function _startOfWeekForDate(d: Date, weekStartsOn: WeekStartsOn): Date {
	const result = new Date(d);

	const day = result.getDay();
	const diff = (day - weekStartsOn + 7) % 7;
	result.setDate(result.getDate() - diff);
	result.setHours(0, 0, 0, 0);

	return result;
}

function isSameDay(dateA: DateInput, dateB: DateInput): boolean {
	const a = toDate(dateA);
	const b = toDate(dateB);

	if (!isValid(a) || !isValid(b)) return false;

	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
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
		_startOfWeekForDate(a, weekStartsOn).getTime() ===
		_startOfWeekForDate(b, weekStartsOn).getTime()
	);
}

function isSameHour(dateA: DateInput, dateB: DateInput): boolean {
	const a = toDate(dateA);
	const b = toDate(dateB);

	if (!isValid(a) || !isValid(b)) return false;

	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate() &&
		a.getHours() === b.getHours()
	);
}

function isSameMinute(dateA: DateInput, dateB: DateInput): boolean {
	const a = toDate(dateA);
	const b = toDate(dateB);

	if (!isValid(a) || !isValid(b)) return false;

	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate() &&
		a.getHours() === b.getHours() &&
		a.getMinutes() === b.getMinutes()
	);
}

function isSameSecond(dateA: DateInput, dateB: DateInput): boolean {
	const a = toDate(dateA);
	const b = toDate(dateB);

	if (!isValid(a) || !isValid(b)) return false;

	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate() &&
		a.getHours() === b.getHours() &&
		a.getMinutes() === b.getMinutes() &&
		a.getSeconds() === b.getSeconds()
	);
}

function isSameTime(dateA: DateInput, dateB: DateInput): boolean {
	const a = toDate(dateA);
	const b = toDate(dateB);

	if (!isValid(a) || !isValid(b)) return false;

	return (
		a.getHours() === b.getHours() &&
		a.getMinutes() === b.getMinutes() &&
		a.getSeconds() === b.getSeconds()
	);
}

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

function isEqual(dateA: DateInput, dateB: DateInput): boolean {
	const a = toDate(dateA);
	const b = toDate(dateB);

	if (!isValid(a) || !isValid(b)) return false;

	return a.getTime() === b.getTime();
}

function isWithinRange(date: DateInput, start: DateInput, end: DateInput): boolean {
	const d = toDate(date);
	let s = toDate(start);
	let e = toDate(end);

	if (!isValid(d) || !isValid(s) || !isValid(e)) return false;

	if (s.getTime() > e.getTime()) {
		[s, e] = [e, s];
	}

	return d.getTime() >= s.getTime() && d.getTime() <= e.getTime();
}

function isOverlapping(rangeA: DateRange, rangeB: DateRange): boolean {
	if (
		!isValid(rangeA.start) ||
		!isValid(rangeA.end) ||
		!isValid(rangeB.start) ||
		!isValid(rangeB.end)
	) {
		return false;
	}

	return (
		rangeA.start.getTime() < rangeB.end.getTime() &&
		rangeA.end.getTime() > rangeB.start.getTime()
	);
}

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
	isAfter,
	isAM,
	isBefore,
	isEqual,
	isFirstDayOfMonth,
	isFuture,
	isInLeapYear,
	isLastDayOfMonth,
	isLeapYear,
	isOverlapping,
	isPast,
	isPM,
	isSameDay,
	isSameHour,
	isSameMinute,
	isSameMonth,
	isSameQuarter,
	isSameSecond,
	isSameTime,
	isSameWeek,
	isSameYear,
	isThisMonth,
	isThisWeek,
	isThisYear,
	isToday,
	isTomorrow,
	isWeekday,
	isWeekend,
	isWithinRange,
	isYesterday,
};
