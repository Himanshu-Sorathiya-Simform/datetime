import {
	MS_PER_HOUR,
	MS_PER_MINUTE,
	MS_PER_SECOND,
} from "../constants/constants.js";
import { toDate } from "../core/create.js";
import { isValid } from "../core/validation.js";
import type { DateInput } from "../types/types.js";

function clampDate(date: DateInput, min: DateInput, max: DateInput): Date {
	const d = toDate(date);
	const minD = toDate(min);
	const maxD = toDate(max);

	if (!isValid(d) || !isValid(minD) || !isValid(maxD)) return new Date(NaN);

	if (d.getTime() < minD.getTime()) return minD;

	if (d.getTime() > maxD.getTime()) return maxD;

	return d;
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

export { clampDate, roundToNearestHours, roundToNearestMinutes };
