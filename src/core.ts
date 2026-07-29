import type { DateInput } from "./types";

function toDate(input: DateInput): Date {
	if (input instanceof Date) {
		return new Date(input.getTime());
	}

	if (typeof input !== "number" && typeof input !== "string") {
		return new Date(NaN);
	}

	return new Date(input);
}

function isDate(value: unknown): value is Date {
	return value instanceof Date;
}

function isValid(date: Date): boolean {
	return isDate(date) && !isNaN(date.getTime());
}

function createDate(year: number, month: number, day: number = 1): Date {
	const d = new Date(year, month - 1, day);

	if (d.getMonth() !== month - 1) {
		return new Date(year, month, 0);
	}

	return d;
}

function getYear(date: DateInput): number {
	return toDate(date).getFullYear();
}

function getMonth(date: DateInput): number {
	return toDate(date).getMonth() + 1;
}

function getDate(date: DateInput): number {
	return toDate(date).getDate();
}

function getHours(date: DateInput): number {
	return toDate(date).getHours();
}

function getMinutes(date: DateInput): number {
	return toDate(date).getMinutes();
}

function getSeconds(date: DateInput): number {
	return toDate(date).getSeconds();
}

function getMilliseconds(date: DateInput): number {
	return toDate(date).getMilliseconds();
}

function getTimestamp(date: DateInput): number {
	return toDate(date).getTime();
}

function getDayOfWeek(date: DateInput): number {
	return toDate(date).getDay();
}

function getDaysInMonth(date: DateInput): number {
	const d = toDate(date);

	return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function getQuarter(date: DateInput): number {
	return Math.ceil((toDate(date).getMonth() + 1) / 3);
}

function getDayOfYear(date: DateInput): number {
	const d = toDate(date);

	const yearStart = new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
	const dayStart = new Date(
		d.getFullYear(),
		d.getMonth(),
		d.getDate(),
		0,
		0,
		0,
		0,
	);

	return Math.round((dayStart.getTime() - yearStart.getTime()) / 86_400_000) + 1;
}

function getDaysInYear(date: DateInput): number {
	const d = toDate(date);

	if (!isValid(d)) return NaN;

	const year = d.getFullYear();

	return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0) ? 366 : 365;
}

export {
	createDate,
	getDate,
	getDayOfWeek,
	getDayOfYear,
	getDaysInMonth,
	getDaysInYear,
	getHours,
	getMilliseconds,
	getMinutes,
	getMonth,
	getQuarter,
	getSeconds,
	getTimestamp,
	getYear,
	isDate,
	isValid,
	toDate,
};
