import { startOfDay } from "../boundaries/startOf.js";
import { MS_PER_HOUR } from "../constants/constants.js";
import { toDate } from "../core/create.js";
import { isValid } from "../core/validation.js";
import { differenceInDays } from "../math/difference.js";
import type { DateInput } from "../types/types.js";

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

export { differenceInBusinessDays, differenceInBusinessHours };
