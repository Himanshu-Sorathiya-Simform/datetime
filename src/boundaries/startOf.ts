import { toDate } from "../core/create.js";
import type { DateInput, WeekStartsOn } from "../types/types.js";
import { getISOWeekYear } from "../units/get.js";

function startOfDay(date: DateInput): Date {
	const d = toDate(date);

	d.setHours(0, 0, 0, 0);

	return d;
}

function startOfHour(date: DateInput): Date {
	const d = toDate(date);

	d.setMinutes(0, 0, 0);

	return d;
}

function startOfMinute(date: DateInput): Date {
	const d = toDate(date);

	d.setSeconds(0, 0);

	return d;
}

function startOfWeek(date: DateInput, weekStartsOn: WeekStartsOn = 0): Date {
	const d = toDate(date);
	const day = d.getDay();
	const diff = (day - weekStartsOn + 7) % 7;

	d.setDate(d.getDate() - diff);
	d.setHours(0, 0, 0, 0);

	return d;
}

function startOfMonth(date: DateInput): Date {
	const d = toDate(date);

	d.setDate(1);
	d.setHours(0, 0, 0, 0);

	return d;
}

function startOfQuarter(date: DateInput): Date {
	const d = toDate(date);

	const quarterStartMonth = d.getMonth() - (d.getMonth() % 3);

	return new Date(d.getFullYear(), quarterStartMonth, 1, 0, 0, 0, 0);
}

function startOfYear(date: DateInput): Date {
	const d = toDate(date);

	return new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
}

function startOfISOWeekYear(date: DateInput): Date {
	const year = getISOWeekYear(date);

	if (Number.isNaN(year)) return new Date(NaN);

	const fourthOfJanuary = new Date(year, 0, 4);

	return startOfWeek(fourthOfJanuary, 1);
}

export {
	startOfDay,
	startOfHour,
	startOfISOWeekYear,
	startOfMinute,
	startOfMonth,
	startOfQuarter,
	startOfWeek,
	startOfYear,
};
