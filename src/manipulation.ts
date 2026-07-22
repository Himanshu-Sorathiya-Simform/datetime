import { getDaysInMonth, isValid, toDate } from './core';
import type { DateInput, DateInterval, Duration, WeekStartsOn } from './types';

const MS_PER_SECOND = 1_000;
const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 3_600_000;
const MS_PER_DAY = 86_400_000;

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

function startOfDay(date: DateInput): Date {
	const d = toDate(date);

	d.setHours(0, 0, 0, 0);

	return d;
}

function endOfDay(date: DateInput): Date {
	const d = toDate(date);

	d.setHours(23, 59, 59, 999);

	return d;
}

function startOfHour(date: DateInput): Date {
	const d = toDate(date);

	d.setMinutes(0, 0, 0);

	return d;
}

function endOfHour(date: DateInput): Date {
	const d = toDate(date);

	d.setMinutes(59, 59, 999);

	return d;
}

function startOfMinute(date: DateInput): Date {
	const d = toDate(date);

	d.setSeconds(0, 0);

	return d;
}

function endOfMinute(date: DateInput): Date {
	const d = toDate(date);

	d.setSeconds(59, 999);

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

function endOfWeek(date: DateInput, weekStartsOn: WeekStartsOn = 0): Date {
	const d = startOfWeek(date, weekStartsOn);

	d.setDate(d.getDate() + 6);
	d.setHours(23, 59, 59, 999);

	return d;
}

function startOfMonth(date: DateInput): Date {
	const d = toDate(date);

	d.setDate(1);
	d.setHours(0, 0, 0, 0);

	return d;
}

function endOfMonth(date: DateInput): Date {
	const d = toDate(date);

	return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

function startOfQuarter(date: DateInput): Date {
	const d = toDate(date);

	const quarterStartMonth = d.getMonth() - (d.getMonth() % 3);

	return new Date(d.getFullYear(), quarterStartMonth, 1, 0, 0, 0, 0);
}

function endOfQuarter(date: DateInput): Date {
	const d = toDate(date);

	const quarterEndMonth = d.getMonth() - (d.getMonth() % 3) + 2;

	return new Date(d.getFullYear(), quarterEndMonth + 1, 0, 23, 59, 59, 999);
}

function startOfYear(date: DateInput): Date {
	const d = toDate(date);

	return new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
}

function endOfYear(date: DateInput): Date {
	const d = toDate(date);

	return new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999);
}

function differenceInMilliseconds(
	dateLeft: DateInput,
	dateRight: DateInput,
): number {
	return toDate(dateLeft).getTime() - toDate(dateRight).getTime();
}

function differenceInSeconds(dateLeft: DateInput, dateRight: DateInput): number {
	return Math.trunc(differenceInMilliseconds(dateLeft, dateRight) / MS_PER_SECOND);
}

function differenceInMinutes(dateLeft: DateInput, dateRight: DateInput): number {
	return Math.trunc(differenceInMilliseconds(dateLeft, dateRight) / MS_PER_MINUTE);
}

function differenceInHours(dateLeft: DateInput, dateRight: DateInput): number {
	return Math.trunc(differenceInMilliseconds(dateLeft, dateRight) / MS_PER_HOUR);
}

function differenceInDays(dateLeft: DateInput, dateRight: DateInput): number {
	const left = startOfDay(toDate(dateLeft));
	const right = startOfDay(toDate(dateRight));

	return Math.round((left.getTime() - right.getTime()) / MS_PER_DAY);
}

function differenceInWeeks(dateLeft: DateInput, dateRight: DateInput): number {
	return Math.trunc(differenceInDays(dateLeft, dateRight) / 7);
}

function differenceInMonths(dateLeft: DateInput, dateRight: DateInput): number {
	const left = toDate(dateLeft);
	const right = toDate(dateRight);
	const yearDiff = left.getFullYear() - right.getFullYear();
	const monthDiff = left.getMonth() - right.getMonth();
	const total = yearDiff * 12 + monthDiff;
	const anchor = addMonths(right, total);

	if (total > 0 && anchor.getTime() > left.getTime()) return total - 1;

	if (total < 0 && anchor.getTime() < left.getTime()) return total + 1;

	return total;
}

function differenceInYears(dateLeft: DateInput, dateRight: DateInput): number {
	const left = toDate(dateLeft);
	const right = toDate(dateRight);
	const yearDiff = left.getFullYear() - right.getFullYear();
	const anchor = addYears(right, yearDiff);

	if (yearDiff > 0 && anchor.getTime() > left.getTime()) return yearDiff - 1;

	if (yearDiff < 0 && anchor.getTime() < left.getTime()) return yearDiff + 1;

	return yearDiff;
}

function addBusinessDays(date: DateInput, amount: number): Date {
	const d = toDate(date);
	const sign = amount < 0 ? -1 : 1;

	let remaining = Math.abs(amount);

	while (remaining > 0) {
		d.setDate(d.getDate() + sign);

		const day = d.getDay();

		if (day !== 0 && day !== 6) {
			remaining--;
		}
	}

	return d;
}

function differenceInBusinessDays(
	dateLeft: DateInput,
	dateRight: DateInput,
): number {
	const left = startOfDay(toDate(dateLeft));
	const right = startOfDay(toDate(dateRight));
	const total = differenceInDays(left, right);

	if (total === 0) return 0;

	const sign = total > 0 ? 1 : -1;
	const absDays = Math.abs(total);

	let businessDays = Math.floor(absDays / 7) * 5;

	const current = new Date(right);

	for (let i = 0; i < absDays % 7; i++) {
		current.setDate(current.getDate() + sign);

		const day = current.getDay();

		if (day !== 0 && day !== 6) {
			businessDays++;
		}
	}

	return businessDays * sign;
}

function clampDate(date: DateInput, min: DateInput, max: DateInput): Date {
	const d = toDate(date);
	const minD = toDate(min);
	const maxD = toDate(max);

	if (!isValid(d) || !isValid(minD) || !isValid(maxD)) return new Date(NaN);

	if (d.getTime() < minD.getTime()) return minD;

	if (d.getTime() > maxD.getTime()) return maxD;

	return d;
}

function min(dates: Date[]): Date | null {
	if (dates.length === 0) return null;

	return new Date(Math.min(...dates.map((d) => d.getTime())));
}

function max(dates: Date[]): Date | null {
	if (dates.length === 0) return null;

	return new Date(Math.max(...dates.map((d) => d.getTime())));
}

function closestTo(date: DateInput, datesArray: Date[]): Date | null {
	if (datesArray.length === 0) return null;

	const tsDate = toDate(date);
	if (!isValid(tsDate)) return new Date(NaN);

	const ts = tsDate.getTime();

	return datesArray.reduce((closest, current) => {
		if (!isValid(current)) return closest;

		return Math.abs(current.getTime() - ts) < Math.abs(closest.getTime() - ts) ?
				current
			:	closest;
	});
}

function eachDayOfInterval(interval: DateInterval): Date[] {
	const result: Date[] = [];
	const start = startOfDay(toDate(interval.start));
	const end = startOfDay(toDate(interval.end));
	const current = new Date(start);

	while (current.getTime() <= end.getTime()) {
		result.push(new Date(current));

		current.setDate(current.getDate() + 1);
	}

	return result;
}

function eachWeekOfInterval(
	interval: DateInterval,
	weekStartsOn: WeekStartsOn = 0,
): Date[] {
	const result: Date[] = [];
	const start = startOfWeek(toDate(interval.start), weekStartsOn);
	const end = startOfWeek(toDate(interval.end), weekStartsOn);
	const current = new Date(start);

	while (current.getTime() <= end.getTime()) {
		result.push(new Date(current));

		current.setDate(current.getDate() + 7);
	}

	return result;
}

function eachMonthOfInterval(interval: DateInterval): Date[] {
	const result: Date[] = [];
	const start = startOfMonth(toDate(interval.start));
	const end = startOfMonth(toDate(interval.end));
	const current = new Date(start);

	while (current.getTime() <= end.getTime()) {
		result.push(new Date(current));

		current.setMonth(current.getMonth() + 1);
	}

	return result;
}

function eachYearOfInterval(interval: DateInterval): Date[] {
	const result: Date[] = [];
	const start = startOfYear(toDate(interval.start));
	const end = startOfYear(toDate(interval.end));
	const current = new Date(start);

	while (current.getTime() <= end.getTime()) {
		result.push(new Date(current));

		current.setFullYear(current.getFullYear() + 1);
	}

	return result;
}

function fromUnixTime(seconds: number): Date {
	return new Date(seconds * 1_000);
}

function toUnixTime(date: DateInput): number {
	return Math.floor(toDate(date).getTime() / 1_000);
}

function roundToNearestMinutes(date: DateInput, step: number): Date {
	const stepMs = step * MS_PER_MINUTE;

	return new Date(Math.round(toDate(date).getTime() / stepMs) * stepMs);
}

function getISOWeek(date: DateInput): number {
	const d = toDate(date);
	const dayOfWeek = d.getDay() || 7;

	d.setDate(d.getDate() + 4 - dayOfWeek);

	const yearStart = new Date(d.getFullYear(), 0, 1);

	return Math.ceil(((d.getTime() - yearStart.getTime()) / MS_PER_DAY + 1) / 7);
}

function setISOWeek(date: DateInput, week: number): Date {
	const d = toDate(date);
	const currentWeek = getISOWeek(d);

	d.setDate(d.getDate() + (week - currentWeek) * 7);

	return d;
}

function intervalToDuration(interval: DateInterval): Duration {
	const start = toDate(interval.start);
	const end = toDate(interval.end);

	const [from, to] =
		start.getTime() <= end.getTime() ? [start, end] : [end, start];
	const years = differenceInYears(to, from);
	const anchor1 = addYears(from, years);
	const months = differenceInMonths(to, anchor1);
	const anchor2 = addMonths(anchor1, months);
	const days = differenceInDays(to, anchor2);
	const anchor3 = addDays(anchor2, days);
	const hours = differenceInHours(to, anchor3);
	const anchor4 = addHours(anchor3, hours);
	const minutes = differenceInMinutes(to, anchor4);
	const anchor5 = addMinutes(anchor4, minutes);
	const seconds = differenceInSeconds(to, anchor5);

	return { years, months, days, hours, minutes, seconds };
}

function durationToMilliseconds(duration: Duration): number {
	const MS_PER_YEAR = 365.25 * MS_PER_DAY;
	const MS_PER_MONTH = 30.4375 * MS_PER_DAY;

	return (
		(duration.years ?? 0) * MS_PER_YEAR +
		(duration.months ?? 0) * MS_PER_MONTH +
		(duration.weeks ?? 0) * 7 * MS_PER_DAY +
		(duration.days ?? 0) * MS_PER_DAY +
		(duration.hours ?? 0) * MS_PER_HOUR +
		(duration.minutes ?? 0) * MS_PER_MINUTE +
		(duration.seconds ?? 0) * MS_PER_SECOND
	);
}

export {
	addBusinessDays,
	addDays,
	addHours,
	addMilliseconds,
	addMinutes,
	addMonths,
	addSeconds,
	addWeeks,
	addYears,
	clampDate,
	closestTo,
	differenceInBusinessDays,
	differenceInDays,
	differenceInHours,
	differenceInMilliseconds,
	differenceInMinutes,
	differenceInMonths,
	differenceInSeconds,
	differenceInWeeks,
	differenceInYears,
	durationToMilliseconds,
	eachDayOfInterval,
	eachMonthOfInterval,
	eachWeekOfInterval,
	eachYearOfInterval,
	endOfDay,
	endOfHour,
	endOfMinute,
	endOfMonth,
	endOfQuarter,
	endOfWeek,
	endOfYear,
	fromUnixTime,
	getISOWeek,
	intervalToDuration,
	max,
	min,
	roundToNearestMinutes,
	setDate,
	setHours,
	setISOWeek,
	setMilliseconds,
	setMinutes,
	setMonth,
	setSeconds,
	setYear,
	startOfDay,
	startOfHour,
	startOfMinute,
	startOfMonth,
	startOfQuarter,
	startOfWeek,
	startOfYear,
	subDays,
	subHours,
	subMilliseconds,
	subMinutes,
	subMonths,
	subSeconds,
	subWeeks,
	subYears,
	toUnixTime,
};
