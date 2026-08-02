import { endOfMonth } from "../boundaries/endOf.js";
import {
	startOfDay,
	startOfISOWeekYear,
	startOfMonth,
	startOfWeek,
} from "../boundaries/startOf.js";
import { MS_PER_DAY } from "../constants/constants.js";
import { toDate } from "../core/create.js";
import { isValid } from "../core/validation.js";
import type { DateInput, WeekStartsOn } from "../types/types.js";

function getYear(date: DateInput): number {
	return toDate(date).getFullYear();
}

function getMonth(date: DateInput): number {
	return toDate(date).getMonth() + 1;
}

function getDate(date: DateInput): number {
	return toDate(date).getDate();
}

function getHours(date: DateInput): number {
	return toDate(date).getHours();
}

function getMinutes(date: DateInput): number {
	return toDate(date).getMinutes();
}

function getSeconds(date: DateInput): number {
	return toDate(date).getSeconds();
}

function getMilliseconds(date: DateInput): number {
	return toDate(date).getMilliseconds();
}

function getTimestamp(date: DateInput): number {
	return toDate(date).getTime();
}

function getDayOfWeek(date: DateInput): number {
	return toDate(date).getDay();
}

function getDaysInMonth(date: DateInput): number {
	const d = toDate(date);

	return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function getQuarter(date: DateInput): number {
	return Math.ceil((toDate(date).getMonth() + 1) / 3);
}

function getDayOfYear(date: DateInput): number {
	const d = toDate(date);

	const yearStart = new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
	const dayStart = new Date(
		d.getFullYear(),
		d.getMonth(),
		d.getDate(),
		0,
		0,
		0,
		0,
	);

	return Math.round((dayStart.getTime() - yearStart.getTime()) / 86_400_000) + 1;
}

function getDaysInYear(date: DateInput): number {
	const d = toDate(date);

	if (!isValid(d)) return NaN;

	const year = d.getFullYear();

	return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0) ? 366 : 365;
}

function getWeekOfMonth(date: DateInput, weekStartsOn: WeekStartsOn = 0): number {
	const d = toDate(date);

	if (!isValid(d)) return NaN;

	const startMonth = startOfMonth(d);
	const firstWeekStart = startOfWeek(startMonth, weekStartsOn);

	const diffDays = Math.round(
		(startOfDay(d).getTime() - firstWeekStart.getTime()) / MS_PER_DAY,
	);

	return Math.trunc(diffDays / 7) + 1;
}

function getWeeksInMonth(date: DateInput, weekStartsOn: WeekStartsOn = 0): number {
	const d = toDate(date);

	if (!isValid(d)) return NaN;

	const start = startOfMonth(d);
	const end = endOfMonth(d);

	const firstWeekStart = startOfWeek(start, weekStartsOn);
	const lastWeekStart = startOfWeek(end, weekStartsOn);

	const diffDays = Math.round(
		(lastWeekStart.getTime() - firstWeekStart.getTime()) / MS_PER_DAY,
	);

	return Math.trunc(diffDays / 7) + 1;
}

function getISOWeek(date: DateInput): number {
	const d = toDate(date);
	const dayOfWeek = d.getDay() || 7;

	d.setDate(d.getDate() + 4 - dayOfWeek);

	const yearStart = new Date(d.getFullYear(), 0, 1);

	return Math.ceil(((d.getTime() - yearStart.getTime()) / MS_PER_DAY + 1) / 7);
}

function getISOWeekYear(date: DateInput): number {
	const d = toDate(date);

	if (!isValid(d)) return NaN;

	const year = d.getFullYear();
	const fourthOfJanuary = new Date(year, 0, 4);
	const startOfFirstWeek = startOfWeek(fourthOfJanuary, 1);

	if (d.getTime() < startOfFirstWeek.getTime()) {
		return year - 1;
	}

	const nextFourthOfJanuary = new Date(year + 1, 0, 4);
	const startOfNextYearFirstWeek = startOfWeek(nextFourthOfJanuary, 1);

	if (d.getTime() >= startOfNextYearFirstWeek.getTime()) {
		return year + 1;
	}

	return year;
}

function getISOWeeksInYear(date: DateInput): number {
	const year = getISOWeekYear(date);

	if (Number.isNaN(year)) return NaN;

	const start = startOfISOWeekYear(date);
	const fourthOfJanuaryNextYear = new Date(year + 1, 0, 4);
	const startNext = startOfWeek(fourthOfJanuaryNextYear, 1);

	const diffDays = Math.round(
		(startNext.getTime() - start.getTime()) / MS_PER_DAY,
	);

	return Math.trunc(diffDays / 7);
}

export {
	getDate,
	getDayOfWeek,
	getDayOfYear,
	getDaysInMonth,
	getDaysInYear,
	getHours,
	getISOWeek,
	getISOWeeksInYear,
	getISOWeekYear,
	getMilliseconds,
	getMinutes,
	getMonth,
	getQuarter,
	getSeconds,
	getTimestamp,
	getWeekOfMonth,
	getWeeksInMonth,
	getYear,
};
