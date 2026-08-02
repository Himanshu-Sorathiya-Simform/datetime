function _pluralize(count: number, unit: string): string {
	return `${count} ${unit}${count === 1 ? "" : "s"}`;
}

export { _pluralize };
