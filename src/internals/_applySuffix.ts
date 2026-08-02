function _applySuffix(text: string, isFuture: boolean, addSuffix: boolean): string {
	if (!addSuffix) return text;

	return isFuture ? `in ${text}` : `${text} ago`;
}

export { _applySuffix };
