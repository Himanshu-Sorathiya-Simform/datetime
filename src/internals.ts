import type { WeekStartsOn } from './types';

function _tzParts(date: Date): { sign: string; hours: string; minutes: string } {
	const rawOffset = date.getTimezoneOffset();
	const sign = rawOffset <= 0 ? '+' : '-';
	const abs = Math.abs(rawOffset);

	return {
		sign,
		hours: String(Math.floor(abs / 60)).padStart(2, '0'),
		minutes: String(abs % 60).padStart(2, '0'),
	};
}

function _startOfWeekForDate(d: Date, weekStartsOn: WeekStartsOn): Date {
	const result = new Date(d);

	const day = result.getDay();
	const diff = (day - weekStartsOn + 7) % 7;
	result.setDate(result.getDate() - diff);
	result.setHours(0, 0, 0, 0);

	return result;
}

export { _startOfWeekForDate, _tzParts };
