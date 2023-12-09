import { DateTime, Interval } from 'luxon'
import type { CalendlyUserBusyTime } from './calendlyAPI/getCalendlyUserBusyTimes.server'
import type {
	CalendlyUserAvailabilityScheduleResource,
	ScheduleInterval,
} from './calendlyAPI/getCalendlyUserAvailabilitySchedule.server'

export function getNextSevenDaysFrom(date: DateTime<true>): DateTime<true>[] {
	const nextSevenDays: DateTime<true>[] = []
	for (let i = 0; i < 7; i++) {
		const nextDay = date.plus({ days: i })
		nextSevenDays.push(nextDay)
	}
	return nextSevenDays
}

type ScheduleData = {
	schedule: CalendlyUserAvailabilityScheduleResource
	busyTimes: CalendlyUserBusyTime[]
	rangeStart: DateTime
	rangeEnd: DateTime
}

export function getAvailability({
	schedule,
	busyTimes,
	rangeStart,
	rangeEnd,
}: ScheduleData) {
	const range = getNextSevenDaysFrom(rangeStart)
	// Iterate through each day within range
	const dailyScheduleData = range.map((day) => {
		// Extract the scheduled intervals for the day
		const scheduleInterval = schedule.rules
			.find((rule) => rule.wday === day.weekdayLong.toLowerCase())
			?.intervals.flat()[0]
		// Extract the busy times for this specific day
		const busyTimesForDay = busyTimes.filter((busyTime) =>
			DateTime.fromISO(busyTime.start_time)
				.startOf('day')
				.equals(day.startOf('day'))
		)

		const overlappingBusyTimes = busyTimesForDay.filter((busyTime) =>
			checkForBusyTimeOverlapWithScheduledTime({
				day,
				busyTime,
				scheduleInterval,
			})
		)

		return {
			day,
			scheduleInterval,
			overlappingBusyTimes,
		}
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

export function getScheduleDateTimeInterval({
	day,
	scheduleInterval,
}: {
	day: DateTime
	scheduleInterval: ScheduleInterval | undefined
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
	})
	const scheduleEndDateTime = day.set({
		hour: scheduleEndHour,
		minute: scheduleEndMinute,
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
