import { toDate } from "../core/create.js";
import type { DateInput, WeekStartsOn } from "../types/types.js";
import { getISOWeekYear } from "../units/get.js";
import { startOfWeek } from "./startOf.js";

function endOfDay(date: DateInput): Date {
	const d = toDate(date);

	d.setHours(23, 59, 59, 999);

	return d;
}

function endOfHour(date: DateInput): Date {
	const d = toDate(date);

	d.setMinutes(59, 59, 999);

	return d;
}

function endOfMinute(date: DateInput): Date {
	const d = toDate(date);

	d.setSeconds(59, 999);

	return d;
}

function endOfWeek(date: DateInput, weekStartsOn: WeekStartsOn = 0): Date {
	const d = startOfWeek(date, weekStartsOn);

	d.setDate(d.getDate() + 6);
	d.setHours(23, 59, 59, 999);

	return d;
}

function endOfMonth(date: DateInput): Date {
	const d = toDate(date);

	return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

function endOfQuarter(date: DateInput): Date {
	const d = toDate(date);

	const quarterEndMonth = d.getMonth() - (d.getMonth() % 3) + 2;

	return new Date(d.getFullYear(), quarterEndMonth + 1, 0, 23, 59, 59, 999);
}

function endOfYear(date: DateInput): Date {
	const d = toDate(date);

	return new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999);
}

function endOfISOWeekYear(date: DateInput): Date {
	const year = getISOWeekYear(date);

	if (Number.isNaN(year)) return new Date(NaN);

	const fourthOfJanuaryNextYear = new Date(year + 1, 0, 4);
	const startOfNextYear = startOfWeek(fourthOfJanuaryNextYear, 1);

	return new Date(startOfNextYear.getTime() - 1);
}

export {
	endOfDay,
	endOfHour,
	endOfISOWeekYear,
	endOfMinute,
	endOfMonth,
	endOfQuarter,
	endOfWeek,
	endOfYear,
};
