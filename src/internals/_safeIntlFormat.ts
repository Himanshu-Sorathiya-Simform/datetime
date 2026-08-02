function _safeIntlFormat(
	d: Date,
	loc: string,
	options: Intl.DateTimeFormatOptions,
): string {
	try {
		return new Intl.DateTimeFormat(loc, options).format(d);
	} catch {
		return new Intl.DateTimeFormat("default", options).format(d);
	}
}

function _safeIntlFormatParts(
	d: Date,
	loc: string,
	options: Intl.DateTimeFormatOptions,
	partType: string,
): string {
	try {
		return (
			new Intl.DateTimeFormat(loc, options)
				.formatToParts(d)
				.find((p) => p.type === partType)?.value ?? ""
		);
	} catch {
		return (
			new Intl.DateTimeFormat("default", options)
				.formatToParts(d)
				.find((p) => p.type === partType)?.value ?? ""
		);
	}
}

export { _safeIntlFormat, _safeIntlFormatParts };
