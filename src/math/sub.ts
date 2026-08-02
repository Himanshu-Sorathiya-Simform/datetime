import { toDate } from "../core/create.js";
import { isValid } from "../core/validation.js";
import type { DateInput, DayOfWeek, Duration } from "../types/types.js";
import {
	addDays,
	addHours,
	addMilliseconds,
	addMinutes,
	addMonths,
	addSeconds,
	addWeeks,
	addYears,
} from "./add.js";

function sub(date: DateInput, duration: Duration): Date {
	let d = toDate(date);

	if (!isValid(d)) return new Date(NaN);

	if (duration.years) d = subYears(d, duration.years);
	if (duration.months) d = subMonths(d, duration.months);
	if (duration.weeks) d = subWeeks(d, duration.weeks);
	if (duration.days) d = subDays(d, duration.days);
	if (duration.hours) d = subHours(d, duration.hours);
	if (duration.minutes) d = subMinutes(d, duration.minutes);
	if (duration.seconds) d = subSeconds(d, duration.seconds);

	return d;
}

function subMilliseconds(date: DateInput, amount: number): Date {
	return addMilliseconds(date, -amount);
}

function subSeconds(date: DateInput, amount: number): Date {
	return addSeconds(date, -amount);
}

function subMinutes(date: DateInput, amount: number): Date {
	return addMinutes(date, -amount);
}

function subHours(date: DateInput, amount: number): Date {
	return addHours(date, -amount);
}

function subDays(date: DateInput, amount: number): Date {
	return addDays(date, -amount);
}

function subWeeks(date: DateInput, amount: number): Date {
	return addWeeks(date, -amount);
}

function subMonths(date: DateInput, amount: number): Date {
	return addMonths(date, -amount);
}

function subYears(date: DateInput, amount: number): Date {
	return addYears(date, -amount);
}

function previousDay(date: DateInput, dayOfWeek: DayOfWeek): Date {
	const d = toDate(date);

	if (!isValid(d)) return new Date(NaN);

	const currentDay = d.getDay();
	const diff = currentDay - dayOfWeek + (currentDay <= dayOfWeek ? 7 : 0);

	return subDays(d, diff);
}

export {
	previousDay,
	sub,
	subDays,
	subHours,
	subMilliseconds,
	subMinutes,
	subMonths,
	subSeconds,
	subWeeks,
	subYears,
};
