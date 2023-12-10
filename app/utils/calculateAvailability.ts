import { DateTime, Interval } from 'luxon'
import type { ScheduleInterval } from './calendlyAPI/getCalendlyUserAvailabilitySchedule.server'
import type { CalendlyUserBusyTime } from './calendlyAPI/getCalendlyUserBusyTimes.server'

export function calculateAvailability({
	day,
	scheduleInterval,
	busyTimes,
}: {
	day: DateTime
	scheduleInterval: ScheduleInterval
	busyTimes: CalendlyUserBusyTime[]
}) {
	const scheduleDateTimeInterval = getScheduleDateTimeInterval({
		day,
		scheduleInterval,
	})
	const busyTimeDateTimeIntervals = busyTimes.map((busyTime) =>
		getBusyTimeDateTimeInterval(busyTime)
	)

	const remaining = busyTimeDateTimeIntervals.reduce(
		(remaining, busyTime) => {
			return remaining.flatMap((time) => time.difference(busyTime))
		},
		[scheduleDateTimeInterval]
	)

	return remaining
}

export function getScheduleDateTimeInterval({
	day,
	scheduleInterval,
}: {
	day: DateTime
	scheduleInterval: ScheduleInterval
}): Interval {
	if (!scheduleInterval) {
		return {} as Interval<false>
	}

	const [scheduleStartHour, scheduleStartMinute] = scheduleInterval.from
		.split(':')
		.map((val) => Number(val))
	const [scheduleEndHour, scheduleEndMinute] = scheduleInterval.to
		.split(':')
		.map((val) => Number(val))
	const scheduleStartDateTime = day.set({
		hour: scheduleStartHour,
		minute: scheduleStartMinute,
		second: 0,
		millisecond: 0,
	})
	const scheduleEndDateTime = day.set({
		hour: scheduleEndHour,
		minute: scheduleEndMinute,
		second: 0,
		millisecond: 0,
	})
	const scheduleDateTimeInterval = Interval.fromDateTimes(
		scheduleStartDateTime,
		scheduleEndDateTime
	)
	return scheduleDateTimeInterval
}

export function getBusyTimeDateTimeInterval(busyTime: CalendlyUserBusyTime) {
	const busyTimeStartDateTime = DateTime.fromISO(busyTime.start_time)
	const busyTimeEndDateTime = DateTime.fromISO(busyTime.end_time)
	const busyTimeDateTimeInterval = Interval.fromDateTimes(
		busyTimeStartDateTime,
		busyTimeEndDateTime
	)
	return busyTimeDateTimeInterval
}
