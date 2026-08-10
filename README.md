# Date & Time Utilities

A strictly client-side, fully type-safe, zero-dependency toolkit for parsing, querying, manipulating, and formatting dates in TypeScript. Every function is a pure, immutable transformation — no wrapper classes, no prototype patching, no hidden global state.

**[ Deep Dive: Full Documentation & Real-World Use Cases ](https://datetime-frontend.pages.dev/)**

## Motivation (Why this module?)

Native `Date` math is a minefield: months are 0-based, mutation happens in place, arithmetic silently overflows across month boundaries, and adding raw milliseconds breaks the moment a DST transition is crossed. Giant wrapper libraries like Moment.js solve some of this, but drag in mutable object instances, a heavyweight locale bundle, and an API surface that actively encourages chained mutation bugs.

This module takes a different approach — a flat set of small, composable functions built on four non-negotiable pillars:

- **Strict immutability.** Every public function funnels its input through a single `toDate()` gateway. If the input is already a `Date`, it is cloned via `new Date(input.getTime())` before anything touches it. No function in this engine can ever mutate the caller's original reference — which means you can chain ten operations on the same variable without ever worrying about spooky-action-at-a-distance bugs.
- **DST-safe calendar math.** Calendar-level operations (`addDays`, `addWeeks`, `startOfWeek`, etc.) use `setDate()` / `setMonth()` / `setFullYear()` rather than raw millisecond arithmetic. This forces the runtime to preserve local wall-clock time across Daylight Saving Time boundaries, instead of silently shifting `14:00` to `15:00` when a day is added.
- **Human-readable, 1-based months.** `getMonth()`, `setMonth()`, and `createDate()` all use `1 = January … 12 = December`, eliminating the classic native-`Date` off-by-one bug at the source.
- **End-of-month & leap-year clamping.** Adding a month to January 31st gives you February 28th — not an accidental rollover into March. Adding a year to February 29th gives you February 28th of the following year. The engine clamps instead of overflowing.
- **Zero-dependency localization.** All textual formatting (month names, weekday names, AM/PM, relative time, pluralization) is delegated entirely to the native `Intl` API. There are no hardcoded translation dictionaries to download, version, or fall out of date.

## Import Syntax

```tsx
import { toDate, addDays, format, isPast } from "@himanshu-sorathiya/datetime";
```

## Basic Usage

```ts
import { toDate, addDays, format } from "@himanshu-sorathiya/datetime";

const input = toDate("2026-07-16"); // parsed once, safely
const dueDate = addDays(input, 14); // 14 days later, DST-safe

console.log(format(dueDate, "MMMM dd, yyyy"));
// → "July 30, 2026"
```

### API Reference

#### Core

The foundational primitives. Every other function in the library is built on top of these.

| Function                        | Returns   | Notes                                                                                                                        |
| ------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `toDate(input)`                 | `Date`    | Clones if already a `Date`; parses if `string` / `number`. The immutability gateway used internally by every other function. |
| `isDate(value)`                 | `boolean` | Type guard — `value instanceof Date`.                                                                                        |
| `isValid(date)`                 | `boolean` | `isDate(date) && !isNaN(date.getTime())`.                                                                                    |
| `createDate(year, month, day?)` | `Date`    | **1-based month.** Overflow-clamped: `createDate(2026, 2, 31)` → Feb 28, not a rollover into March. `day` defaults to `1`.   |
| `fromUnixTime(seconds)`         | `Date`    | Converts Unix epoch **seconds** (not ms) to a `Date`.                                                                        |
| `toUnixTime(date)`              | `number`  | Converts to Unix epoch **seconds**, truncated.                                                                               |

#### Units

Getters and setters for individual date and time fields. Setters return a new `Date`; originals are never mutated.

| Function                               | Notes                                                                                                         |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `getYear(date)`                        |                                                                                                               |
| `getMonth(date)`                       | **1-based** (1–12), unlike native `getMonth()`.                                                               |
| `getDate(date)`                        | Day of month (1–31).                                                                                          |
| `getHours(date)`                       | Local time (0–23).                                                                                            |
| `getMinutes(date)`                     | 0–59.                                                                                                         |
| `getSeconds(date)`                     | 0–59.                                                                                                         |
| `getMilliseconds(date)`                | 0–999.                                                                                                        |
| `getTimestamp(date)`                   | Epoch milliseconds — prefer this over repeated `isBefore()` calls in hot loops.                               |
| `getDayOfWeek(date)`                   | 0 = Sunday … 6 = Saturday (local time).                                                                       |
| `getDaysInMonth(date)`                 | Leap-year aware.                                                                                              |
| `getDaysInYear(date)`                  | 365 or 366.                                                                                                   |
| `getQuarter(date)`                     | 1–4.                                                                                                          |
| `getDayOfYear(date)`                   | 1–366, DST-safe (computed from start-of-day timestamps).                                                      |
| `getWeekOfMonth(date, weekStartsOn?)`  | 1–6 (depends on day-of-week overflow).                                                                        |
| `getWeeksInMonth(date, weekStartsOn?)` | Total calendar rows needed to render the month.                                                               |
| `getISOWeek(date)`                     | ISO-8601 week number (1–53); Week 1 contains the year's first Thursday.                                       |
| `getISOWeekYear(date)`                 | The ISO week-numbering year.                                                                                  |
| `getISOWeeksInYear(date)`              | Total ISO weeks in the given date's year (52 or 53).                                                          |
| `setYear(date, year)`                  | Leap-year clamped, same as `addYears`.                                                                        |
| `setMonth(date, month)`                | **1-based.** End-of-month clamped, same as `addMonths`.                                                       |
| `setDate(date, day)`                   | Clamps to `[1, daysInMonth]` — never overflows into the next month. Use `addDays` to intentionally roll over. |
| `setHours(date, hours)`                | Out-of-bounds values follow native rollover behavior.                                                         |
| `setMinutes(date, minutes)`            |                                                                                                               |
| `setSeconds(date, seconds)`            |                                                                                                               |
| `setMilliseconds(date, ms)`            |                                                                                                               |
| `set(date, values)`                    | Updates multiple fields at once via a `DateValues` object.                                                    |
| `setDay(date, dayOfWeek, options?)`    | Sets the day of the week _within the current week_.                                                           |
| `setISOWeek(date, week)`               | Shifts the date to the same weekday within the target ISO week.                                               |

#### Boundaries

Functions for finding the start or end of a specific period, plus clamping and rounding utilities.

| Function                                              | Notes                                                                                |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `startOfDay` / `endOfDay`                             | `00:00:00.000` / `23:59:59.999`.                                                     |
| `startOfHour` / `endOfHour`                           |                                                                                      |
| `startOfMinute` / `endOfMinute`                       |                                                                                      |
| `startOfWeek(date, weekStartsOn?)` / `endOfWeek(...)` | Defaults to Sunday (`0`).                                                            |
| `startOfMonth` / `endOfMonth`                         | `endOfMonth` uses the "day 0 of next month" trick — automatically leap-year correct. |
| `startOfQuarter` / `endOfQuarter`                     |                                                                                      |
| `startOfYear` / `endOfYear`                           |                                                                                      |
| `startOfISOWeekYear` / `endOfISOWeekYear`             | The exact start/end boundary of the ISO year.                                        |
| `clampDate(date, min, max)`                           | Enforces `minDate` / `maxDate` picker constraints without mutation.                  |
| `roundToNearestMinutes(date, step)`                   | Snaps to the nearest multiple of `step` minutes.                                     |
| `roundToNearestHours(date, step)`                     | Snaps to the nearest multiple of `step` hours.                                       |

#### Math

Date arithmetic and difference calculations.

| Function                                                            | Notes                                                                                                                      |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `addMilliseconds` / `subMilliseconds`                               | Raw millisecond math (safe — no calendar quirks at this granularity).                                                      |
| `addSeconds` / `subSeconds`                                         | Raw millisecond math.                                                                                                      |
| `addMinutes` / `subMinutes`                                         | Raw millisecond math.                                                                                                      |
| `addHours` / `subHours`                                             | Raw millisecond math.                                                                                                      |
| `addDays` / `subDays`                                               | Uses `setDate()` — DST transitions never shift the time-of-day component.                                                  |
| `addWeeks` / `subWeeks`                                             | Delegates to `addDays(date, amount * 7)`.                                                                                  |
| `addMonths` / `subMonths`                                           | End-of-month clamped: `addMonths(Jan 31, 1)` → Feb 28, not Mar 3.                                                          |
| `addYears` / `subYears`                                             | Leap-year clamped: `addYears(Feb 29 2024, 1)` → Feb 28 2025.                                                               |
| `add` / `sub`                                                       | Applies a complex `Duration` object (e.g. `{ months: 1, days: 5 }`). Processes largest-to-smallest units to prevent drift. |
| `nextDay` / `previousDay`                                           | Skips forward/backward to the next/previous occurrence of a specific weekday (0-6).                                        |
| `differenceInMilliseconds(left, right)`                             | Base primitive for all sub-day differences.                                                                                |
| `differenceInSeconds` / `differenceInMinutes` / `differenceInHours` | Truncated (`Math.trunc`).                                                                                                  |
| `differenceInDays`                                                  | Both inputs snapped to `startOfDay()` first, then `Math.round()` — DST-safe.                                               |
| `differenceInWeeks`                                                 | `Math.trunc(differenceInDays / 7)`.                                                                                        |
| `differenceInMonths`                                                | Returns only **completed** months (Jan 31 → Feb 1 is `0`, not `1`).                                                        |
| `differenceInYears`                                                 | Returns only **completed** years; correctly handles Feb 29 birthdays.                                                      |

#### Business

Calculations that exclude weekends and typical non-business hours.

| Function                                 | Notes                                                                             |
| ---------------------------------------- | --------------------------------------------------------------------------------- |
| `addBusinessDays(date, amount)`          | Traverses one day at a time skipping Sat/Sun. Negative amounts traverse backward. |
| `addBusinessHours(date, amount)`         | Skips Sat/Sun and typical non-business hours (before 9am and 5pm+).               |
| `differenceInBusinessDays(left, right)`  | O(n % 7) — counts full weeks as 5 days each, then iterates the remainder.         |
| `differenceInBusinessHours(left, right)` | Calculates the number of working 9-5 hours between two dates.                     |

#### Query

Pure boolean predicates and comparisons. Invalid inputs always resolve to `false`.

| Function                            | Notes                                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------- |
| `isSameDay(a, b)`                   | Ignores time component.                                                               |
| `isSameMonth(a, b)`                 | Checks year too — October 2025 ≠ October 2026.                                        |
| `isSameYear(a, b)`                  |                                                                                       |
| `isSameQuarter(a, b)`               | Checks year too.                                                                      |
| `isSameWeek(a, b, weekStartsOn?)`   | Defaults to Sunday start (`0`); pass `1` for Monday / ISO.                            |
| `isSameISOWeekYear(a, b)`           | Compares the ISO-8601 week-numbering year.                                            |
| `isSameHour(a, b)`                  | Checks full date + hour.                                                              |
| `isSameMinute(a, b)`                | Checks full date + hour + minute.                                                     |
| `isSameSecond(a, b)`                | Checks full date + H:M:S.                                                             |
| `isSameTime(a, b)`                  | Checks H:M:S only — ignores the calendar date entirely.                               |
| `isBefore(date, compareDate)`       | Strict millisecond comparison.                                                        |
| `isAfter(date, compareDate)`        | Strict millisecond comparison.                                                        |
| `isSameOrBefore(date, compareDate)` | Inclusive boundary check.                                                             |
| `isSameOrAfter(date, compareDate)`  | Inclusive boundary check.                                                             |
| `isEqual(a, b)`                     | Fixes native `Date` object-reference inequality by comparing timestamps.              |
| `isToday(date)`                     | Local timezone.                                                                       |
| `isYesterday(date)`                 | Local timezone.                                                                       |
| `isTomorrow(date)`                  | Local timezone.                                                                       |
| `isPast(date)`                      | Strict millisecond comparison against `Date.now()`.                                   |
| `isFuture(date)`                    | Strict millisecond comparison against `Date.now()`.                                   |
| `isFirstDayOfMonth(date)`           | `getDate() === 1`.                                                                    |
| `isLastDayOfMonth(date)`            | Detects the month change after advancing one day.                                     |
| `isWeekend(date)`                   | Saturday or Sunday, local time.                                                       |
| `isWeekday(date)`                   | Monday–Friday, local time.                                                            |
| `isAM(date)`                        | Hour is before noon (0–11).                                                           |
| `isPM(date)`                        | Hour is noon or later (12–23).                                                        |
| `isLeapYear(yearOrDate)`            | Accepts a raw `number` **or** a `Date`. Standard Gregorian rule.                      |
| `isInLeapYear(date)`                | Convenience wrapper — extracts the year and delegates to `isLeapYear`.                |
| `compareAsc(left, right)`           | Array sort comparator: returns `-1`, `0`, or `1`.                                     |
| `compareDesc(left, right)`          | Reverse array sort comparator: returns `1`, `0`, or `-1`.                             |
| `min(datesArray[])`                 | Earliest date in the array. Accepts `DateInput[]`. Returns `null` for an empty array. |
| `max(datesArray[])`                 | Latest date in the array. Accepts `DateInput[]`. Returns `null` for an empty array.   |
| `closestTo(date, datesArray[])`     | Nearest date by absolute difference. Returns `null` for an empty array.               |

#### Intervals

Operations involving date ranges and arrays.

| Function                                    | Notes                                                                             |
| ------------------------------------------- | --------------------------------------------------------------------------------- |
| `isBetween(date, start, end, options?)`     | Inclusive/exclusive bounded range check (supports `[]`, `()`, `[)`, `(]`).        |
| `isWithinRange(date, start, end)`           | Inclusive. **Auto-swaps an inverted `start`/`end`** instead of returning `false`. |
| `isOverlapping(rangeA, rangeB)`             | Strict — exact boundary touches (`rangeA.end === rangeB.start`) return `false`.   |
| `getOverlappingDaysInInterval(left, right)` | Calculates the number of overlapping 24-hour periods between two `DateInterval`s. |
| `eachMinuteOfInterval(interval, step?)`     | Generates a date for every `step` minute (defaults to 1).                         |
| `eachHourOfInterval(interval, step?)`       | Generates a date for every `step` hour (defaults to 1).                           |
| `eachDayOfInterval(interval, step?)`        | Every calendar day, inclusive of both boundaries.                                 |
| `eachWeekOfInterval(interval, options?)`    | First day of every week. Options support `step` and `weekStartsOn`.               |
| `eachMonthOfInterval(interval, step?)`      | First day of every month in the interval.                                         |
| `eachYearOfInterval(interval, step?)`       | January 1st of every year in the interval.                                        |

#### Format

Locale-aware formatting and parsing powered entirely by the native `Intl` API, plus duration utilities.

| Function                                                   | Notes                                                                                                                          |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `format(date, formatString, options?)`                     | Token-based pattern formatting (`"yyyy-MM-dd"`, etc.). Supports `'literal text'` escaping.                                     |
| `formatDate(date, locale?, options?)`                      | Thin wrapper over `Intl.DateTimeFormat` — use for strict, options-driven localization.                                         |
| `formatRelativeTime(date, baseDate?, locale?)`             | Wraps `Intl.RelativeTimeFormat`; auto-selects the most meaningful unit (seconds → years).                                      |
| `formatDistance(date, baseDate, options?)`                 | "less than a minute", "about 2 hours", etc. Supports `addSuffix`.                                                              |
| `formatDistanceStrict(date, baseDate, options?)`           | Strict unit distance without fuzzy words. Enforces specific units and rounding.                                                |
| `formatDistanceToNow(date, options?)`                      | Convenience wrapper over `formatDistance` against current time.                                                                |
| `formatDistanceIntl(date, baseDate, options?)`             | `Intl`-powered exact relative time (e.g. "in 2 days", "3 hours ago").                                                          |
| `formatInTimeZone(date, formatString, timeZone, options?)` | Uses `Intl.DateTimeFormat` internally to shift time to `timeZone` before formatting.                                           |
| `formatRelative(date, baseDate, options?)`                 | "Today at 2:00 PM", "Tomorrow at...", "Last Friday at...".                                                                     |
| `formatISO(date, options?)`                                | ISO 8601 using the **local** timezone offset, unlike native `toISOString()`.                                                   |
| `formatRFC3339(date, options?)`                            | RFC 3339 — the internet-protocol profile of ISO 8601. Outputs `"Z"` for UTC offset.                                            |
| `formatISO9075(date, options?)`                            | The SQL datetime standard (space separator, no offset) used by Postgres/MySQL/SQLite.                                          |
| `formatRFC2822(date)`                                      | Email/HTTP header format. Day and month names are always English per the RFC spec.                                             |
| `toISOString(date)`                                        | Thin wrapper over native `toISOString()` — always UTC, always ends in `"Z"`.                                                   |
| `parseISO(isoString)`                                      | **Strict** ISO 8601 parser — rejects locale-specific/ambiguous formats (unlike the permissive `toDate()`).                     |
| `intervalToDuration(interval)`                             | Cascades an interval into `{ years, months, days, hours, minutes, seconds }` largest-to-smallest, so units never double-count. |
| `durationToMilliseconds(duration)`                         | Approximate total — see [Gotchas](#gotchas--edge-cases).                                                                       |
| `formatDuration(duration, options?)`                       | Human-readable duration string with `Intl.PluralRules`-correct pluralization.                                                  |

## Advanced Usage & Examples

### Safe Date Chaining

Because every function clones its input before touching it, you can chain operations inline without ever worrying about a downstream call mutating an upstream reference:

```ts
import { startOfWeek, addBusinessDays, format } from "@himanshu-sorathiya/datetime";

const today = new Date();

const dueDate = format(
	addBusinessDays(startOfWeek(today, 1), 3), // Monday-start week + 3 business days
	"EEEE, MMMM dd yyyy",
);

console.log(dueDate); // → "Thursday, July 16 2026"
console.log(today); // → untouched — the original reference was never mutated
```

`startOfWeek` clones `today` before snapping it to Monday, `addBusinessDays` clones that result again before walking forward — so `today` is guaranteed to still point at the exact instant it was created, no matter how many functions are chained on top of it.

## Real-World Use Cases

- Building custom date-picker calendar grids, including blank-cell padding before the 1st and "Today" highlighting.
- Calculating user trial or subscription expiration dates, and the number of days remaining.
- Rendering localized activity/timeline feeds ("3 hours ago", "in 2 days") without a translation bundle.
- Validating age restrictions (e.g. 18+) on signup or KYC forms.
- Drawing Gantt chart bars and interval overlays from raw start/end dates.
- Detecting scheduling conflicts or double-bookings in calendar and meeting-room apps.
- Snapping free-form time selections to fixed appointment slots (e.g. rounding to the nearest 15 minutes).
- Computing business-day SLAs and shipping/delivery estimates while skipping weekends.
- Generating recurring event occurrences across a bounded date range.
- Formatting timestamps for API payloads, database inserts, and email headers (RFC 3339, ISO 9075, RFC 2822).

## Gotchas & Edge Cases

- **Local timezone mandate.** The entire library operates in the runtime's local timezone. Parsing a UTC string (e.g. via `toDate()`) converts it to local time under the hood — there is no "UTC mode."
- **Graceful failures, not exceptions.** All numeric getters return `NaN` and all query/predicate functions return `false` when given an invalid date input. Nothing in this library throws on bad input.
- **Day-level past/future checks.** `isPast(startOfDay(today))` evaluates to `true`, because midnight of the current day is already in the past. If you need to know whether a _calendar day_ (not a timestamp) is yesterday or older, use `isBefore(date, startOfDay(new Date()))` instead of `isPast()` directly.
- **Zero-duration overlaps.** `isOverlapping` treats an exact boundary touch (Event A ends exactly when Event B starts) as **not** overlapping — it returns `false`. This holds true even for zero-duration events (`start === end`) that land precisely on a boundary.
- **`durationToMilliseconds` is an approximation — never use it for arithmetic.** It computes years and months using mean averages (365.25 days/year, 30.4375 days/month) because their true length varies. It is intended strictly for **sorting and comparing** the relative size of durations. Using its output to actually advance a clock or a calendar date will introduce drift.
- **`intervalToDuration` always returns an absolute duration.** It strips away chronological direction: even if `interval.start` is chronologically _after_ `interval.end`, the returned `Duration` is always positive.
- **`format` vs. `formatDate`.** Prefer `formatDate` when you need strict, correct localization — it delegates fully to `Intl.DateTimeFormat`, which natively supports non-Gregorian calendars and Eastern Arabic numerals. The `format` token parser, by contrast, builds its output from padded native getters, so it **always** produces Western Arabic numerals (0–9) on the **Gregorian calendar**, regardless of the `locale` option passed.
- **`formatDuration`'s locale support is partial.** It uses `Intl.PluralRules` to select the grammatically correct plural form (correctly handling languages like Arabic, which has six plural categories) — but the unit label strings themselves ("years", "months", "days", …) are currently hardcoded to English only.
