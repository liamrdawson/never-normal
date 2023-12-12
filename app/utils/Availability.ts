import { DateTime, Duration, Interval } from 'luxon'
import {
	getCalendlyUserBusyTimes,
	type CalendlyUserBusyTime,
} from './calendlyAPI/getCalendlyUserBusyTimes.server'
import {
	getCalendlyWorkingHoursSchedule,
	type ScheduleInterval,
	type CalendlyUserAvailabilityScheduleResource,
} from './calendlyAPI/getCalendlyUserAvailabilitySchedule.server'
import { getNextSevenDaysFrom } from './getSevenDaysFrom'

/**
 * Given a dayily schedule, a Calendly users busy times and a start date,
 * this function will return an array of time intervals for every range of available time.
 */
export async function getAvailability({
	rangeStart,
}: {
	rangeStart: DateTime
}) {
	const { collection: busyTimes } = await getCalendlyUserBusyTimes()
	const { resource: schedule } = await getCalendlyWorkingHoursSchedule()

	const range = getNextSevenDaysFrom(rangeStart)
	// Iterate through each day within range
	const dailyAvailableSlots = range.map((day) =>
		getDailyAvailableSlots({ day, busyTimes, schedule })
	)

	return dailyAvailableSlots
}

/**
 * Retrieves the daily available slots for a given day,
 * considering the user's schedule and busy times.
 */
function getDailyAvailableSlots({
	day,
	busyTimes,
	schedule,
}: {
	day: DateTime
	busyTimes: CalendlyUserBusyTime[]
	schedule: CalendlyUserAvailabilityScheduleResource
}) {
	// Extract the scheduled intervals for the day
	const scheduleInterval = schedule.rules
		.find((rule) => rule.wday === day.weekdayLong?.toLowerCase())
		?.intervals.flat()[0]

	// If there's no schedule interval today then there's no availability
	if (!scheduleInterval) {
		return {
			day,
			availableSlotIntervals: [],
		}
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

	// Divide availability intervals into meetings based on a given amount of buffer minutes and duration minutes
	const availableSlotIntervals = getAvailableSlots({
		meetingSlotBufferMinutes: 15,
		meetingSlotDurationMinutes: 30,
		availability,
	})

	return {
		day,
		availableSlotIntervals,
	}
}

/**
 * Checks if there is an overlap between a Calendly user busyTime object
 * and a Calendly user schedule for a given day.
 */
function checkForBusyTimeOverlapWithScheduledTime({
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

/**
 * Deducts busyTime ranges from schedule, returning an array of intervals for each
 * range of availability on a given day.
 */
function calculateAvailability({
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

/**
 * 	Converts a Calendly schedule object into a DateTime Interval.
 */
function getScheduleDateTimeInterval({
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

/**
 * 	Converts a Calendly busyTime object into a DateTime Interval.
 */
function getBusyTimeDateTimeInterval(busyTime: CalendlyUserBusyTime) {
	const busyTimeStartDateTime = DateTime.fromISO(busyTime.start_time)
	const busyTimeEndDateTime = DateTime.fromISO(busyTime.end_time)
	const busyTimeDateTimeInterval = Interval.fromDateTimes(
		busyTimeStartDateTime,
		busyTimeEndDateTime
	)
	return busyTimeDateTimeInterval
}

type CalculateAvailableSlotsInput = {
	meetingSlotDurationMinutes: number
	meetingSlotBufferMinutes: number
	availability: Interval[] | []
}

/**
 * 	Divides an array of Intervals into smaller Intervals based on
 * 	a given duration in minutes and buffer in minutes.
 */
function getAvailableSlots({
	meetingSlotDurationMinutes,
	meetingSlotBufferMinutes,
	availability,
}: CalculateAvailableSlotsInput) {
	const slotWithBufferMinutes =
		meetingSlotDurationMinutes + meetingSlotBufferMinutes

	const slotsWithBufferDuration = Duration.fromObject({
		minutes: slotWithBufferMinutes,
	})

	const availableSlots = availability
		.flatMap((interval) => {
			const slot = interval.splitBy(slotsWithBufferDuration)
			return slot
		})
		.map((interval) => {
			const slot = interval.splitBy({ minutes: 30 })[0]
			if (
				slot.toDuration('minutes').as('minutes') === meetingSlotDurationMinutes
			) {
				return slot
			}
			return null
		})

	return availableSlots
}
