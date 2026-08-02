function _formatUnderAMinute(seconds: number): string {
	if (seconds < 5) return "less than 5 seconds";
	if (seconds < 10) return "less than 10 seconds";
	if (seconds < 20) return "less than 20 seconds";
	if (seconds < 40) return "less than 40 seconds";

	return "less than a minute";
}

export { _formatUnderAMinute };
