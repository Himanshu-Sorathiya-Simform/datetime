import { toDate } from "../core/create.js";
import { isValid } from "../core/validation.js";
import { addDays } from "../math/add.js";
import type {
	DateInput,
	DateValues,
	DayOfWeek,
	WeekStartsOn,
} from "../types/types.js";
import { getDaysInMonth, getISOWeek } from "./get.js";

function set(date: DateInput, values: DateValues): Date {
	let d = toDate(date);

	if (!isValid(d)) return new Date(NaN);

	if (values.year !== undefined) d = setYear(d, values.year);
	if (values.month !== undefined) d = setMonth(d, values.month);
	if (values.date !== undefined) d = setDate(d, values.date);
	if (values.hours !== undefined) d = setHours(d, values.hours);
	if (values.minutes !== undefined) d = setMinutes(d, values.minutes);
	if (values.seconds !== undefined) d = setSeconds(d, values.seconds);
	if (values.milliseconds !== undefined)
		d = setMilliseconds(d, values.milliseconds);

	return d;
}

function setDay(
	date: DateInput,
	dayOfWeek: DayOfWeek,
	options?: { weekStartsOn?: WeekStartsOn },
): Date {
	const d = toDate(date);

	if (!isValid(d)) return new Date(NaN);

	const weekStartsOn = options?.weekStartsOn ?? 0;
	const currentDay = d.getDay();

	const diff =
		(dayOfWeek < weekStartsOn ? 7 : 0)
		+ dayOfWeek
		- (currentDay < weekStartsOn ? 7 : 0)
		- currentDay;

	return addDays(d, diff);
}

function setYear(date: DateInput, year: number): Date {
	const d = toDate(date);
	const originalMonth = d.getMonth();

	d.setFullYear(year);

	if (d.getMonth() !== originalMonth) {
		d.setDate(0);
	}

	return d;
}

function setMonth(date: DateInput, month: number): Date {
	const d = toDate(date);
	const originalDay = d.getDate();

	d.setDate(1);
	d.setMonth(month - 1);
	d.setDate(Math.min(originalDay, getDaysInMonth(d)));

	return d;
}

function setDate(date: DateInput, day: number): Date {
	const d = toDate(date);
	const maxDay = getDaysInMonth(d);

	d.setDate(Math.min(Math.max(1, day), maxDay));

	return d;
}

function setHours(date: DateInput, hours: number): Date {
	const d = toDate(date);

	d.setHours(hours);

	return d;
}

function setMinutes(date: DateInput, minutes: number): Date {
	const d = toDate(date);

	d.setMinutes(minutes);

	return d;
}

function setSeconds(date: DateInput, seconds: number): Date {
	const d = toDate(date);

	d.setSeconds(seconds);

	return d;
}

function setMilliseconds(date: DateInput, ms: number): Date {
	const d = toDate(date);

	d.setMilliseconds(ms);

	return d;
}

function setISOWeek(date: DateInput, week: number): Date {
	const d = toDate(date);
	const currentWeek = getISOWeek(d);

	d.setDate(d.getDate() + (week - currentWeek) * 7);

	return d;
}

export {
	set,
	setDate,
	setDay,
	setHours,
	setISOWeek,
	setMilliseconds,
	setMinutes,
	setMonth,
	setSeconds,
	setYear,
};
