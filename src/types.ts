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

export type { DateInput, DateInterval, DateRange, Duration, WeekStartsOn };
