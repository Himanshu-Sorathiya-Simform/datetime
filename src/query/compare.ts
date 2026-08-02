import { toDate } from "../core/create.js";
import { isValid } from "../core/validation.js";
import type { DateInput } from "../types/types.js";

function compareAsc(dateLeft: DateInput, dateRight: DateInput): number {
	const left = toDate(dateLeft);
	const right = toDate(dateRight);

	if (!isValid(left) || !isValid(right)) return NaN;

	const diff = left.getTime() - right.getTime();

	if (diff < 0) return -1;
	if (diff > 0) return 1;

	return 0;
}

function compareDesc(dateLeft: DateInput, dateRight: DateInput): number {
	const left = toDate(dateLeft);
	const right = toDate(dateRight);

	if (!isValid(left) || !isValid(right)) return NaN;

	const diff = left.getTime() - right.getTime();

	if (diff > 0) return -1;
	if (diff < 0) return 1;

	return 0;
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

export { closestTo, compareAsc, compareDesc, max, min };
