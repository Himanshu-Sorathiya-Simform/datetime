import { MS_PER_HOUR } from "../constants/constants.js";
import { toDate } from "../core/create.js";
import { isValid } from "../core/validation.js";
import type { DateInput } from "../types/types.js";

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

		if (day !== 0 && day !== 6 && hours >= 9 && hours < 17) {
			remaining--;
		}
	}

	return d;
}

export { addBusinessDays, addBusinessHours };
