import { DateTime, Interval } from 'luxon'
import type { CalendlyUserBusyTime } from './calendlyAPI/getCalendlyUserBusyTimes.server'
import type {
	CalendlyUserAvailabilityScheduleResource,
	ScheduleInterval,
} from './calendlyAPI/getCalendlyUserAvailabilitySchedule.server'
import { calculateAvailability } from './calculateAvailability'

export function getNextSevenDaysFrom(date: DateTime<true>): DateTime<true>[] {
	const nextSevenDays: DateTime<true>[] = []
	for (let i = 0; i < 7; i++) {
		const nextDay = date.plus({ days: i })
		nextSevenDays.push(nextDay)
	}
	return nextSevenDays
}

export function getAvailability({
	schedule,
	busyTimes,
	rangeStart,
}: {
	schedule: CalendlyUserAvailabilityScheduleResource
	busyTimes: CalendlyUserBusyTime[]
	rangeStart: DateTime
}) {
	const range = getNextSevenDaysFrom(rangeStart)
	// Iterate through each day within range
	const dailyScheduleData = range.map((day) => {
		// Extract the scheduled intervals for the day
		const scheduleInterval = schedule.rules
			.find((rule) => rule.wday === day.weekdayLong.toLowerCase())
			?.intervals.flat()[0]

		// If there's no schedule interval today then there's no availability
		if (!scheduleInterval) {
			return {}
		}

		// Extract the busy times for this specific day
		const busyTimesForDay = busyTimes.filter((busyTime) =>
			DateTime.fromISO(busyTime.start_time)
				.startOf('day')
				.equals(day.startOf('day'))
		)

		// Filter out any busy times that don't clash with the provided schedule
		const overlappingBusyTimes = busyTimesForDay.filter((busyTime) =>
			checkForBusyTimeOverlapWithScheduledTime({
				day,
				busyTime,
				scheduleInterval,
			})
		)

		// Deduct all overlapping busy times from schedule
		const availability = calculateAvailability({
			day,
			scheduleInterval,
			busyTimes: overlappingBusyTimes,
		})

		return availability
	})

	return dailyScheduleData
}

export function checkForBusyTimeOverlapWithScheduledTime({
	day,
	busyTime,
	scheduleInterval,
}: {
	day: DateTime
	busyTime: CalendlyUserBusyTime
	scheduleInterval: ScheduleInterval | undefined
}) {
	if (!scheduleInterval) {
		return false
	}

	const [scheduleStartHours, scheduleStartMinutes] =
		scheduleInterval.from.split(':')
	const [scheduleEndHours, scheduleEndMinutes] = scheduleInterval.to.split(':')

	const scheduleStartDateTime = day.set({
		hour: Number(scheduleStartHours),
		minute: Number(scheduleStartMinutes),
	})
	const scheduleEndDateTime = day.set({
		hour: Number(scheduleEndHours),
		minute: Number(scheduleEndMinutes),
	})

	const busyTimeStartDateTime = DateTime.fromISO(busyTime.start_time)
	const busyTimeEndDateTime = DateTime.fromISO(busyTime.end_time)

	return Interval.fromDateTimes(
		scheduleStartDateTime,
		scheduleEndDateTime
	).overlaps(Interval.fromDateTimes(busyTimeStartDateTime, busyTimeEndDateTime))
}
