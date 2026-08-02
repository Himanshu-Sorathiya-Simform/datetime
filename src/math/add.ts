import {
	MS_PER_HOUR,
	MS_PER_MINUTE,
	MS_PER_SECOND,
} from "../constants/constants.js";
import { toDate } from "../core/create.js";
import { isValid } from "../core/validation.js";
import type { DateInput, DayOfWeek, Duration } from "../types/types.js";
import { getDaysInMonth } from "../units/get.js";

function add(date: DateInput, duration: Duration): Date {
	let d = toDate(date);

	if (!isValid(d)) return new Date(NaN);

	if (duration.years) d = addYears(d, duration.years);
	if (duration.months) d = addMonths(d, duration.months);
	if (duration.weeks) d = addWeeks(d, duration.weeks);
	if (duration.days) d = addDays(d, duration.days);
	if (duration.hours) d = addHours(d, duration.hours);
	if (duration.minutes) d = addMinutes(d, duration.minutes);
	if (duration.seconds) d = addSeconds(d, duration.seconds);

	return d;
}

function addMilliseconds(date: DateInput, amount: number): Date {
	return new Date(toDate(date).getTime() + amount);
}

function addSeconds(date: DateInput, amount: number): Date {
	return new Date(toDate(date).getTime() + amount * MS_PER_SECOND);
}

function addMinutes(date: DateInput, amount: number): Date {
	return new Date(toDate(date).getTime() + amount * MS_PER_MINUTE);
}

function addHours(date: DateInput, amount: number): Date {
	return new Date(toDate(date).getTime() + amount * MS_PER_HOUR);
}

function addDays(date: DateInput, amount: number): Date {
	const d = toDate(date);

	d.setDate(d.getDate() + amount);

	return d;
}

function addWeeks(date: DateInput, amount: number): Date {
	return addDays(date, amount * 7);
}

function addMonths(date: DateInput, amount: number): Date {
	const d = toDate(date);
	const originalDay = d.getDate();

	d.setDate(1);
	d.setMonth(d.getMonth() + amount);
	d.setDate(Math.min(originalDay, getDaysInMonth(d)));

	return d;
}

function addYears(date: DateInput, amount: number): Date {
	const d = toDate(date);
	const originalMonth = d.getMonth();

	d.setFullYear(d.getFullYear() + amount);

	if (d.getMonth() !== originalMonth) {
		d.setDate(0);
	}

	return d;
}

function nextDay(date: DateInput, dayOfWeek: DayOfWeek): Date {
	const d = toDate(date);

	if (!isValid(d)) return new Date(NaN);

	const currentDay = d.getDay();
	const diff = (dayOfWeek < currentDay ? 7 : 0) + dayOfWeek - currentDay;
	const increment = diff === 0 ? 7 : diff;

	return addDays(d, increment);
}

export {
	add,
	addDays,
	addHours,
	addMilliseconds,
	addMinutes,
	addMonths,
	addSeconds,
	addWeeks,
	addYears,
	nextDay,
};
