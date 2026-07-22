# Date & Time Utilities

A strictly client-side, fully type-safe, zero-dependency toolkit for parsing, querying, manipulating, and formatting dates in TypeScript. Every function is a pure, immutable transformation — no wrapper classes, no prototype patching, no hidden global state.

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
// Preferred
import { toDate, addDays, format, isPast } from "@himanshu-sorathiya/react-kit/datetime";
// Or
import { toDate, addDays, format, isPast } from "@himanshu-sorathiya/react-kit";
```

## Basic Usage

```ts
import { toDate, addDays, format } from "@himanshu-sorathiya/react-kit/datetime";

const input = toDate("2026-07-16"); // parsed once, safely
const dueDate = addDays(input, 14); // 14 days later, DST-safe

console.log(format(dueDate, "MMMM dd, yyyy"));
// → "July 30, 2026"
```

## API Reference

### Core & Getters

The immutability gateway and primitive getters. Every other function in the library is built on top of these.

| Function | Returns | Notes |
| --- | --- | --- |
| `toDate(input)` | `Date` | Clones if already a `Date`; parses if `string` / `number`. The immutability gateway used internally by every other function. |
| `isDate(value)` | `boolean` | Type guard — `value instanceof Date`. |
| `isValid(date)` | `boolean` | `isDate(date) && !isNaN(date.getTime())`. |
| `createDate(year, month, day?)` | `Date` | **1-based month.** Overflow-clamped: `createDate(2026, 2, 31)` → Feb 28, not a rollover into March. `day` defaults to `1`. |
| `getYear(date)` | `number` | |
| `getMonth(date)` | `number` | **1-based** (1–12), unlike native `getMonth()`. |
| `getDate(date)` | `number` | Day of month (1–31). |
| `getHours(date)` | `number` | Local time (0–23). |
| `getMinutes(date)` | `number` | 0–59. |
| `getSeconds(date)` | `number` | 0–59. |
| `getMilliseconds(date)` | `number` | 0–999. |
| `getTimestamp(date)` | `number` | Epoch milliseconds — prefer this over repeated `isBefore()` calls in hot loops. |
| `getDayOfWeek(date)` | `number` | 0 = Sunday … 6 = Saturday (local time). |
| `getDaysInMonth(date)` | `number` | Leap-year aware. |
| `getQuarter(date)` | `number` | 1–4. |
| `getDayOfYear(date)` | `number` | 1–366, DST-safe (computed from start-of-day timestamps). |

### Queries (Predicates)

Pure boolean functions. No date values are ever returned here — only `true` or `false`, and **invalid inputs always resolve to `false`**, never `NaN` or a thrown error.

| Function | Notes |
| --- | --- |
| `isSameDay(a, b)` | Ignores time component. |
| `isSameMonth(a, b)` | Checks year too — October 2025 ≠ October 2026. |
| `isSameYear(a, b)` | |
| `isSameQuarter(a, b)` | Checks year too. |
| `isSameWeek(a, b, weekStartsOn?)` | Defaults to Sunday start (`0`); pass `1` for Monday / ISO. |
| `isSameHour(a, b)` | Checks full date + hour. |
| `isSameMinute(a, b)` | Checks full date + hour + minute. |
| `isSameSecond(a, b)` | Checks full date + H:M:S. |
| `isSameTime(a, b)` | Checks H:M:S only — ignores the calendar date entirely. |
| `isBefore(date, compareDate)` | Strict millisecond comparison. |
| `isAfter(date, compareDate)` | Strict millisecond comparison. |
| `isEqual(a, b)` | Fixes native `Date` object-reference inequality by comparing timestamps. |
| `isWithinRange(date, start, end)` | Inclusive. **Auto-swaps an inverted `start`/`end`** instead of returning `false`. |
| `isOverlapping(rangeA, rangeB)` | Strict — exact boundary touches (`rangeA.end === rangeB.start`) return `false`. |
| `isToday(date)` | Local timezone. |
| `isYesterday(date)` | Local timezone. |
| `isTomorrow(date)` | Local timezone. |
| `isPast(date)` | Strict millisecond comparison against `Date.now()`. |
| `isFuture(date)` | Strict millisecond comparison against `Date.now()`. |
| `isThisWeek(date, weekStartsOn?)` | |
| `isThisMonth(date)` | |
| `isThisYear(date)` | |
| `isFirstDayOfMonth(date)` | `getDate() === 1`. |
| `isLastDayOfMonth(date)` | Detects the month change after advancing one day. |
| `isWeekend(date)` | Saturday or Sunday, local time. |
| `isWeekday(date)` | Monday–Friday, local time. |
| `isAM(date)` | Hour is before noon (0–11). |
| `isPM(date)` | Hour is noon or later (12–23). |
| `isLeapYear(yearOrDate)` | Accepts a raw `number` **or** a `Date`. Standard Gregorian rule. |
| `isInLeapYear(date)` | Convenience wrapper — extracts the year and delegates to `isLeapYear`. |

### Manipulation

Date arithmetic, field setters, period snapping, difference calculations, and range utilities. **Every function returns a new `Date`; originals are never mutated.**

**Add / Sub**

| Function | Notes |
| --- | --- |
| `addMilliseconds` / `subMilliseconds` | Raw millisecond math (safe — no calendar quirks at this granularity). |
| `addSeconds` / `subSeconds` | Raw millisecond math. |
| `addMinutes` / `subMinutes` | Raw millisecond math. |
| `addHours` / `subHours` | Raw millisecond math. |
| `addDays` / `subDays` | Uses `setDate()` — DST transitions never shift the time-of-day component. |
| `addWeeks` / `subWeeks` | Delegates to `addDays(date, amount * 7)`. |
| `addMonths` / `subMonths` | End-of-month clamped: `addMonths(Jan 31, 1)` → Feb 28, not Mar 3. |
| `addYears` / `subYears` | Leap-year clamped: `addYears(Feb 29 2024, 1)` → Feb 28 2025. |

**Set** (same overflow-clamping guarantees as their `add` counterparts)

| Function | Notes |
| --- | --- |
| `setYear(date, year)` | Leap-year clamped, same as `addYears`. |
| `setMonth(date, month)` | **1-based.** End-of-month clamped, same as `addMonths`. |
| `setDate(date, day)` | Clamps to `[1, daysInMonth]` — never overflows into the next month. Use `addDays` to intentionally roll over. |
| `setHours(date, hours)` | Out-of-bounds values follow native rollover behavior. |
| `setMinutes(date, minutes)` | |
| `setSeconds(date, seconds)` | |
| `setMilliseconds(date, ms)` | |

**Start / End of Period**

| Function | Notes |
| --- | --- |
| `startOfDay` / `endOfDay` | `00:00:00.000` / `23:59:59.999`. |
| `startOfHour` / `endOfHour` | |
| `startOfMinute` / `endOfMinute` | |
| `startOfWeek(date, weekStartsOn?)` | Defaults to Sunday (`0`). |
| `endOfWeek(date, weekStartsOn?)` | Defaults to Sunday (`0`). |
| `startOfMonth` / `endOfMonth` | `endOfMonth` uses the "day 0 of next month" trick — automatically leap-year correct. |
| `startOfQuarter` / `endOfQuarter` | |
| `startOfYear` / `endOfYear` | |

**Differences** (signed integer — positive means the left argument is later)

| Function | Notes |
| --- | --- |
| `differenceInMilliseconds(left, right)` | Base primitive for all sub-day differences. |
| `differenceInSeconds` / `differenceInMinutes` / `differenceInHours` | Truncated (`Math.trunc`). |
| `differenceInDays` | Both inputs snapped to `startOfDay()` first, then `Math.round()` — DST-safe. |
| `differenceInWeeks` | `Math.trunc(differenceInDays / 7)`. |
| `differenceInMonths` | Returns only **completed** months (Jan 31 → Feb 1 is `0`, not `1`). |
| `differenceInYears` | Returns only **completed** years; correctly handles Feb 29 birthdays. |

**Business Days** (weekends excluded — no holiday calendar)

| Function | Notes |
| --- | --- |
| `addBusinessDays(date, amount)` | Traverses one day at a time skipping Sat/Sun. Negative amounts traverse backward. |
| `differenceInBusinessDays(left, right)` | O(n % 7) — counts full weeks as 5 days each, then iterates the remainder. |

**Range & Array**

| Function | Notes |
| --- | --- |
| `clampDate(date, min, max)` | Enforces `minDate` / `maxDate` picker constraints without mutation. |
| `min(dates[])` | Earliest date in the array. Returns `null` for an empty array. |
| `max(dates[])` | Latest date in the array. Returns `null` for an empty array. |
| `closestTo(date, datesArray[])` | Nearest date by absolute difference. Returns `null` for an empty array. |
| `eachDayOfInterval(interval)` | Every calendar day, inclusive of both boundaries. |
| `eachWeekOfInterval(interval, weekStartsOn?)` | First day of every week in the interval. |
| `eachMonthOfInterval(interval)` | First day of every month in the interval. |
| `eachYearOfInterval(interval)` | January 1st of every year in the interval. |

**Unix Timestamps**

| Function | Notes |
| --- | --- |
| `fromUnixTime(seconds)` | Converts Unix epoch **seconds** (not ms) to a `Date`. |
| `toUnixTime(date)` | Converts to Unix epoch **seconds**, truncated. |

**Rounding & ISO Weeks**

| Function | Notes |
| --- | --- |
| `roundToNearestMinutes(date, step)` | Snaps to the nearest multiple of `step` minutes. |
| `getISOWeek(date)` | ISO-8601 week number (1–53); Week 1 contains the year's first Thursday. |
| `setISOWeek(date, week)` | Shifts the date to the same weekday within the target ISO week. |

**Duration**

| Function | Notes |
| --- | --- |
| `intervalToDuration(interval)` | Cascades an interval into `{ years, months, days, hours, minutes, seconds }` largest-to-smallest, so units never double-count. |
| `durationToMilliseconds(duration)` | Approximate total — see [Gotchas](#gotchas--edge-cases). |

### Formatting & Parsing

Locale-aware formatting and parsing powered entirely by the native `Intl` API.

| Function | Notes |
| --- | --- |
| `format(date, formatString, options?)` | Token-based pattern formatting (`"yyyy-MM-dd"`, etc.). Supports `'literal text'` escaping. |
| `formatDate(date, locale?, options?)` | Thin wrapper over `Intl.DateTimeFormat` — use for strict, options-driven localization. |
| `formatRelativeTime(date, baseDate?, locale?)` | Wraps `Intl.RelativeTimeFormat`; auto-selects the most meaningful unit (seconds → years). |
| `formatISO(date, options?)` | ISO 8601 using the **local** timezone offset, unlike native `toISOString()`. |
| `formatRFC3339(date, options?)` | RFC 3339 — the internet-protocol profile of ISO 8601. Outputs `"Z"` for UTC offset. |
| `formatISO9075(date, options?)` | The SQL datetime standard (space separator, no offset) used by Postgres/MySQL/SQLite. |
| `formatRFC2822(date)` | Email/HTTP header format. Day and month names are always English per the RFC spec. |
| `formatDuration(duration, options?)` | Human-readable duration string with `Intl.PluralRules`-correct pluralization. |
| `toISOString(date)` | Thin wrapper over native `toISOString()` — always UTC, always ends in `"Z"`. |
| `parseISO(isoString)` | **Strict** ISO 8601 parser — rejects locale-specific/ambiguous formats (unlike the permissive `toDate()`). |

## Advanced Usage & Examples

### Safe Date Chaining

Because every function clones its input before touching it, you can chain operations inline without ever worrying about a downstream call mutating an upstream reference:

```ts
import {
  startOfWeek,
  addBusinessDays,
  format,
} from "@himanshu-sorathiya/react-kit/datetime";

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
- **Day-level past/future checks.** `isPast(startOfDay(today))` evaluates to `true`, because midnight of the current day is already in the past. If you need to know whether a *calendar day* (not a timestamp) is yesterday or older, use `isBefore(date, startOfDay(new Date()))` instead of `isPast()` directly.
- **Zero-duration overlaps.** `isOverlapping` treats an exact boundary touch (Event A ends exactly when Event B starts) as **not** overlapping — it returns `false`. This holds true even for zero-duration events (`start === end`) that land precisely on a boundary.
- **`durationToMilliseconds` is an approximation — never use it for arithmetic.** It computes years and months using mean averages (365.25 days/year, 30.4375 days/month) because their true length varies. It is intended strictly for **sorting and comparing** the relative size of durations. Using its output to actually advance a clock or a calendar date will introduce drift.
- **`intervalToDuration` always returns an absolute duration.** It strips away chronological direction: even if `interval.start` is chronologically *after* `interval.end`, the returned `Duration` is always positive.
- **`format` vs. `formatDate`.** Prefer `formatDate` when you need strict, correct localization — it delegates fully to `Intl.DateTimeFormat`, which natively supports non-Gregorian calendars and Eastern Arabic numerals. The `format` token parser, by contrast, builds its output from padded native getters, so it **always** produces Western Arabic numerals (0–9) on the **Gregorian calendar**, regardless of the `locale` option passed.
- **`formatDuration`'s locale support is partial.** It uses `Intl.PluralRules` to select the grammatically correct plural form (correctly handling languages like Arabic, which has six plural categories) — but the unit label strings themselves ("years", "months", "days", …) are currently hardcoded to English only.
