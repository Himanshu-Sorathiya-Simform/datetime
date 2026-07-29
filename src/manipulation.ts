import { MS_PER_DAY, MS_PER_HOUR, MS_PER_MINUTE, MS_PER_SECOND } from "./constants";
import { getDaysInMonth, isValid, toDate } from "./core";
import type {
	DateInput,
	DateInterval,
	DateValues,
	DayOfWeek,
	Duration,
	WeekStartsOn,
} from "./types";

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

function nextDay(date: DateInput, dayOfWeek: DayOfWeek): Date {
	const d = toDate(date);

	if (!isValid(d)) return new Date(NaN);

	const currentDay = d.getDay();
	const diff = (dayOfWeek < currentDay ? 7 : 0) + dayOfWeek - currentDay;
	const increment = diff === 0 ? 7 : diff;

	return addDays(d, increment);
}

function previousDay(date: DateInput, dayOfWeek: DayOfWeek): Date {
	const d = toDate(date);

	if (!isValid(d)) return new Date(NaN);

	const currentDay = d.getDay();
	const diff = currentDay - dayOfWeek + (currentDay <= dayOfWeek ? 7 : 0);

	return subDays(d, diff);
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

function addBusinessHours(date: DateInput, amount: number): Date {
	let d = toDate(date);
	if (!isValid(d)) return new Date(NaN);

	const sign = amount < 0 ? -1 : 1;
	let remaining = Math.abs(amount);

	while (remaining > 0) {
		d.setTime(d.getTime() + sign * MS_PER_HOUR);

		const day = d.getDay();
		const hours = d.getHours();

		// Typical 9-5 business hours check
		if (day !== 0 && day !== 6 && hours >= 9 && hours < 17) {
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

function differenceInBusinessHours(
	dateLeft: DateInput,
	dateRight: DateInput,
): number {
	const left = toDate(dateLeft);
	const right = toDate(dateRight);

	if (!isValid(left) || !isValid(right)) return NaN;

	const sign = left.getTime() > right.getTime() ? 1 : -1;
	const start = sign > 0 ? right : left;
	const end = sign > 0 ? left : right;

	let current = new Date(start.getTime());
	let businessHours = 0;

	while (current.getTime() < end.getTime()) {
		const day = current.getDay();
		const hours = current.getHours();

		if (day !== 0 && day !== 6 && hours >= 9 && hours < 17) {
			businessHours++;
		}

		current.setTime(current.getTime() + MS_PER_HOUR);
	}

	return businessHours * sign;
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

function min(dates: DateInput[]): Date | null {
	if (dates.length === 0) return null;

	return new Date(
		Math.min(
			...dates.map((d) => {
				const parsed = toDate(d);
				return isValid(parsed) ? parsed.getTime() : NaN;
			}),
		),
	);
}

function max(dates: DateInput[]): Date | null {
	if (dates.length === 0) return null;

	return new Date(
		Math.max(
			...dates.map((d) => {
				const parsed = toDate(d);
				return isValid(parsed) ? parsed.getTime() : NaN;
			}),
		),
	);
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

function roundToNearestHours(date: DateInput, step: number = 1): Date {
	const d = toDate(date);

	if (!isValid(d)) return new Date(NaN);

	const hours = d.getHours();
	const minutes = d.getMinutes();
	const ms =
		d.getMilliseconds()
		+ d.getSeconds() * MS_PER_SECOND
		+ minutes * MS_PER_MINUTE;

	const halfStepMs = (MS_PER_HOUR * step) / 2;

	const currentStep = Math.trunc(hours / step) * step;
	const remainderMs = (hours % step) * MS_PER_HOUR + ms;

	const roundedHours =
		remainderMs >= halfStepMs ? currentStep + step : currentStep;

	const result = new Date(d.getTime());
	result.setHours(roundedHours, 0, 0, 0);

	return result;
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

function startOfISOWeekYear(date: DateInput): Date {
	const year = getISOWeekYear(date);

	if (Number.isNaN(year)) return new Date(NaN);

	const fourthOfJanuary = new Date(year, 0, 4);

	return startOfWeek(fourthOfJanuary, 1);
}

function endOfISOWeekYear(date: DateInput): Date {
	const year = getISOWeekYear(date);

	if (Number.isNaN(year)) return new Date(NaN);

	const fourthOfJanuaryNextYear = new Date(year + 1, 0, 4);
	const startOfNextYear = startOfWeek(fourthOfJanuaryNextYear, 1);

	return new Date(startOfNextYear.getTime() - 1);
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
		(duration.years ?? 0) * MS_PER_YEAR
		+ (duration.months ?? 0) * MS_PER_MONTH
		+ (duration.weeks ?? 0) * 7 * MS_PER_DAY
		+ (duration.days ?? 0) * MS_PER_DAY
		+ (duration.hours ?? 0) * MS_PER_HOUR
		+ (duration.minutes ?? 0) * MS_PER_MINUTE
		+ (duration.seconds ?? 0) * MS_PER_SECOND
	);
}

function getOverlappingDaysInInterval(
	intervalLeft: DateInterval,
	intervalRight: DateInterval,
): number {
	const leftStart = toDate(intervalLeft.start);
	const leftEnd = toDate(intervalLeft.end);
	const rightStart = toDate(intervalRight.start);
	const rightEnd = toDate(intervalRight.end);

	if (
		!isValid(leftStart)
		|| !isValid(leftEnd)
		|| !isValid(rightStart)
		|| !isValid(rightEnd)
	) {
		return NaN;
	}

	const leftStartTime = leftStart.getTime();
	const leftEndTime = leftEnd.getTime();
	const rightStartTime = rightStart.getTime();
	const rightEndTime = rightEnd.getTime();

	const [lStart, lEnd] =
		leftStartTime <= leftEndTime ?
			[leftStartTime, leftEndTime]
		:	[leftEndTime, leftStartTime];
	const [rStart, rEnd] =
		rightStartTime <= rightEndTime ?
			[rightStartTime, rightEndTime]
		:	[rightEndTime, rightStartTime];

	const isOverlapping = lStart < rEnd && lEnd > rStart;

	if (!isOverlapping) {
		return 0;
	}

	const overlapStart = lStart < rStart ? rStart : lStart;
	const overlapEnd = lEnd > rEnd ? rEnd : lEnd;

	return Math.ceil((overlapEnd - overlapStart) / MS_PER_DAY);
}

export {
	add,
	addBusinessDays,
	addBusinessHours,
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
	differenceInBusinessHours,
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
	eachHourOfInterval,
	eachMinuteOfInterval,
	eachMonthOfInterval,
	eachWeekOfInterval,
	eachYearOfInterval,
	endOfDay,
	endOfHour,
	endOfISOWeekYear,
	endOfMinute,
	endOfMonth,
	endOfQuarter,
	endOfWeek,
	endOfYear,
	fromUnixTime,
	getISOWeek,
	getISOWeeksInYear,
	getISOWeekYear,
	getOverlappingDaysInInterval,
	getWeekOfMonth,
	getWeeksInMonth,
	intervalToDuration,
	max,
	min,
	nextDay,
	previousDay,
	roundToNearestHours,
	roundToNearestMinutes,
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
	startOfDay,
	startOfHour,
	startOfISOWeekYear,
	startOfMinute,
	startOfMonth,
	startOfQuarter,
	startOfWeek,
	startOfYear,
	sub,
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
