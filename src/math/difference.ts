import { startOfDay } from "../boundaries/startOf.js";
import {
	MS_PER_DAY,
	MS_PER_HOUR,
	MS_PER_MINUTE,
	MS_PER_SECOND,
} from "../constants/constants.js";
import { toDate } from "../core/create.js";
import type { DateInput } from "../types/types.js";
import { addMonths, addYears } from "./add.js";

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

export {
	differenceInDays,
	differenceInHours,
	differenceInMilliseconds,
	differenceInMinutes,
	differenceInMonths,
	differenceInSeconds,
	differenceInWeeks,
	differenceInYears,
};
