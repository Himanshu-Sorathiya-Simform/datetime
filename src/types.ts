type DateInput = Date | number | string;

type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type DateInterval = {
	start: Date;
	end: Date;
};

type DateRange = {
	start: Date;
	end: Date;
};

type Duration = {
	years?: number;
	months?: number;
	weeks?: number;
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
};

interface FormatDistanceOptions {
	addSuffix?: boolean;
	includeSeconds?: boolean;
}

interface FormatDistanceToNowOptions extends FormatDistanceOptions {}

type FormatDistanceStrictUnit =
	'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';
type RoundingMethod = 'round' | 'floor' | 'ceil';

interface FormatDistanceStrictOptions {
	addSuffix?: boolean;
	unit?: FormatDistanceStrictUnit;
	roundingMethod?: RoundingMethod;
}

type RelativeTimeUnit =
	'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second';

interface FormatDistanceIntlOptions {
	locale?: string | string[];
	numeric?: 'always' | 'auto';
	style?: 'long' | 'short' | 'narrow';
	unit?: RelativeTimeUnit;
}

interface FormatRelativeOptions {
	weekStartsOn?: WeekStartsOn;
	timeFormat?: string;
	fallbackFormat?: string;
	locale?: string | string[];
}

export type {
	DateInput,
	DateInterval,
	DateRange,
	Duration,
	FormatDistanceIntlOptions,
	FormatDistanceOptions,
	FormatDistanceStrictOptions,
	FormatDistanceStrictUnit,
	FormatDistanceToNowOptions,
	FormatRelativeOptions,
	RelativeTimeUnit,
	RoundingMethod,
	WeekStartsOn,
};
