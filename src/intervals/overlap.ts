import { MS_PER_DAY } from "../constants/constants.js";
import { toDate } from "../core/create.js";
import { isValid } from "../core/validation.js";
import type {
	DateInput,
	DateInterval,
	DateRange,
	IsBetweenOptions,
} from "../types/types.js";

function isWithinRange(date: DateInput, start: DateInput, end: DateInput): boolean {
	const d = toDate(date);
	let s = toDate(start);
	let e = toDate(end);

	if (!isValid(d) || !isValid(s) || !isValid(e)) return false;

	if (s.getTime() > e.getTime()) {
		[s, e] = [e, s];
	}

	return d.getTime() >= s.getTime() && d.getTime() <= e.getTime();
}

function isBetween(
	date: DateInput,
	start: DateInput,
	end: DateInput,
	options: IsBetweenOptions = {},
): boolean {
	const d = toDate(date);
	let s = toDate(start);
	let e = toDate(end);

	if (!isValid(d) || !isValid(s) || !isValid(e)) return false;

	if (s.getTime() > e.getTime()) {
		[s, e] = [e, s];
	}

	const inclusivity = options.inclusivity ?? "[]";

	switch (inclusivity) {
		case "()":
			return d.getTime() > s.getTime() && d.getTime() < e.getTime();

		case "[)":
			return d.getTime() >= s.getTime() && d.getTime() < e.getTime();

		case "(]":
			return d.getTime() > s.getTime() && d.getTime() <= e.getTime();

		case "[]":
		default:
			return d.getTime() >= s.getTime() && d.getTime() <= e.getTime();
	}
}

function isOverlapping(rangeA: DateRange, rangeB: DateRange): boolean {
	const aStart = toDate(rangeA.start);
	const aEnd = toDate(rangeA.end);
	const bStart = toDate(rangeB.start);
	const bEnd = toDate(rangeB.end);

	if (!isValid(aStart) || !isValid(aEnd) || !isValid(bStart) || !isValid(bEnd)) {
		return false;
	}

	return aStart.getTime() < bEnd.getTime() && aEnd.getTime() > bStart.getTime();
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

export { getOverlappingDaysInInterval, isBetween, isOverlapping, isWithinRange };
