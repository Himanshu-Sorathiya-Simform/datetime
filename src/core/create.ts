import type { DateInput } from "../types/types.js";

function toDate(input: DateInput): Date {
	if (input instanceof Date) {
		return new Date(input.getTime());
	}

	if (typeof input !== "number" && typeof input !== "string") {
		return new Date(NaN);
	}

	return new Date(input);
}

function createDate(year: number, month: number, day: number = 1): Date {
	const d = new Date(year, month - 1, day);

	if (d.getMonth() !== month - 1) {
		return new Date(year, month, 0);
	}

	return d;
}

function fromUnixTime(seconds: number): Date {
	return new Date(seconds * 1_000);
}

function toUnixTime(date: DateInput): number {
	return Math.floor(toDate(date).getTime() / 1_000);
}

export { createDate, fromUnixTime, toDate, toUnixTime };
