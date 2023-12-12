import type { DateTime } from 'luxon'

/**
 * Returns an array of DateTimes for seven days from a given date.
 */
export function getNextSevenDaysFrom(date: DateTime<true>): DateTime<true>[] {
	const nextSevenDays: DateTime<true>[] = []
	for (let i = 0; i < 7; i++) {
		const nextDay = date.plus({ days: i })
		nextSevenDays.push(nextDay)
	}
	return nextSevenDays
}
