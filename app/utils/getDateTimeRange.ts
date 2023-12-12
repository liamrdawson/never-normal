import type { DateTime } from 'luxon'

/**
 * Returns an array of DateTimes for seven days from a given date.
 */
export function getDateTimeRange({
	rangeStart,
	rangeEnd,
}: {
	rangeStart: DateTime
	rangeEnd: DateTime
}): DateTime<true>[] {
	const days = []
	let currentDay = rangeStart.startOf('day')

	while (currentDay <= rangeEnd.startOf('day')) {
		days.push(currentDay)
		currentDay = currentDay.plus({ days: 1 })
	}

	return days
}
