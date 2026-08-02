import {
	startOfDay,
	startOfHour,
	startOfMinute,
	startOfMonth,
	startOfWeek,
	startOfYear,
} from "../boundaries/startOf.js";
import { toDate } from "../core/create.js";
import type { DateInterval, WeekStartsOn } from "../types/types.js";

function eachMinuteOfInterval(interval: DateInterval, step: number = 1): Date[] {
	const result: Date[] = [];
	const start = startOfMinute(toDate(interval.start));
	const end = startOfMinute(toDate(interval.end));
	const current = new Date(start);
	const safeStep = Math.trunc(step);

	if (safeStep < 1 || Number.isNaN(safeStep)) return result;

	while (current.getTime() <= end.getTime()) {
		result.push(new Date(current));

		current.setMinutes(current.getMinutes() + safeStep);
	}

	return result;
}

function eachHourOfInterval(interval: DateInterval, step: number = 1): Date[] {
	const result: Date[] = [];
	const start = startOfHour(toDate(interval.start));
	const end = startOfHour(toDate(interval.end));
	const current = new Date(start);
	const safeStep = Math.trunc(step);

	if (safeStep < 1 || Number.isNaN(safeStep)) return result;

	while (current.getTime() <= end.getTime()) {
		result.push(new Date(current));

		current.setHours(current.getHours() + safeStep);
	}

	return result;
}

function eachDayOfInterval(interval: DateInterval, step: number = 1): Date[] {
	const result: Date[] = [];
	const start = startOfDay(toDate(interval.start));
	const end = startOfDay(toDate(interval.end));
	const current = new Date(start);
	const safeStep = Math.trunc(step);

	if (safeStep < 1 || Number.isNaN(safeStep)) return result;

	while (current.getTime() <= end.getTime()) {
		result.push(new Date(current));

		current.setDate(current.getDate() + safeStep);
	}

	return result;
}

function eachWeekOfInterval(
	interval: DateInterval,
	options: { weekStartsOn?: WeekStartsOn; step?: number } = {},
): Date[] {
	const result: Date[] = [];
	const weekStartsOn = options.weekStartsOn ?? 0;
	const safeStep = Math.trunc(options.step ?? 1);

	if (safeStep < 1 || Number.isNaN(safeStep)) return result;

	const start = startOfWeek(toDate(interval.start), weekStartsOn);
	const end = startOfWeek(toDate(interval.end), weekStartsOn);
	const current = new Date(start);

	while (current.getTime() <= end.getTime()) {
		result.push(new Date(current));

		current.setDate(current.getDate() + 7 * safeStep);
	}

	return result;
}

function eachMonthOfInterval(interval: DateInterval, step: number = 1): Date[] {
	const result: Date[] = [];
	const start = startOfMonth(toDate(interval.start));
	const end = startOfMonth(toDate(interval.end));
	const current = new Date(start);
	const safeStep = Math.trunc(step);

	if (safeStep < 1 || Number.isNaN(safeStep)) return result;

	while (current.getTime() <= end.getTime()) {
		result.push(new Date(current));

		current.setMonth(current.getMonth() + safeStep);
	}

	return result;
}

function eachYearOfInterval(interval: DateInterval, step: number = 1): Date[] {
	const result: Date[] = [];
	const start = startOfYear(toDate(interval.start));
	const end = startOfYear(toDate(interval.end));
	const current = new Date(start);
	const safeStep = Math.trunc(step);

	if (safeStep < 1 || Number.isNaN(safeStep)) return result;

	while (current.getTime() <= end.getTime()) {
		result.push(new Date(current));

		current.setFullYear(current.getFullYear() + safeStep);
	}

	return result;
}

export {
	eachDayOfInterval,
	eachHourOfInterval,
	eachMinuteOfInterval,
	eachMonthOfInterval,
	eachWeekOfInterval,
	eachYearOfInterval,
};
