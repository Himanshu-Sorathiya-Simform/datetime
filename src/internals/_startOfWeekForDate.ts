import type { WeekStartsOn } from "../types/types.js";

function _startOfWeekForDate(d: Date, weekStartsOn: WeekStartsOn): Date {
	const result = new Date(d);

	const day = result.getDay();
	const diff = (day - weekStartsOn + 7) % 7;

	result.setDate(result.getDate() - diff);
	result.setHours(0, 0, 0, 0);

	return result;
}

export { _startOfWeekForDate };
