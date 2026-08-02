function isDate(value: unknown): value is Date {
	return value instanceof Date;
}

function isValid(date: Date): boolean {
	return isDate(date) && !isNaN(date.getTime());
}

export { isDate, isValid };
