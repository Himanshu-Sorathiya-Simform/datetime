function _tzParts(date: Date): {
	sign: string;
	hours: string;
	minutes: string;
} {
	const rawOffset = date.getTimezoneOffset();
	const sign = rawOffset <= 0 ? "+" : "-";
	const abs = Math.abs(rawOffset);

	return {
		sign,
		hours: String(Math.floor(abs / 60)).padStart(2, "0"),
		minutes: String(abs % 60).padStart(2, "0"),
	};
}

export { _tzParts };
