import { getEnvVar } from './getEnvVar'
import { DateTime } from 'luxon'

function getCalendlyBearerToken() {
	const token = getEnvVar('CALENDLY_PERSONAL_ACCESS_TOKEN')
	return `Bearer ${token}`
}

export async function getCalendlyUser() {
	const user = await fetch(`${getEnvVar('CALENDLY_API_BASE_URL')}/users/me`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: getCalendlyBearerToken(),
		},
	}).then((res) => res.json())

	return user
}

export async function getCalendlyUserAvailabilitySchedule() {
	const availabilitySchedule = await fetch(
		`${getEnvVar(
			'CALENDLY_API_BASE_URL'
		)}/user_availability_schedules?user=https://api.calendly.com/users/0ced695c-882c-499d-a3d2-412d55ceb44e`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: getCalendlyBearerToken(),
			},
		}
	).then((res) => res.json())

	return availabilitySchedule
}

type ScheduleInterval = {
	from: string
	to: string
}

type ScheduleRule = {
	type: string
	wday:
		| 'sunday'
		| 'monday'
		| 'tuesday'
		| 'wednesday'
		| 'thursday'
		| 'friday'
		| 'saturday'
	intervals: ScheduleInterval[]
}

type Schedule = {
	default: boolean
	name: string
	rules: ScheduleRule[]
	timezone: string
	uri: string
	user: string
}

export async function getWorkingHoursSchedule(): Promise<Schedule> {
	const availability = await getCalendlyUserAvailabilitySchedule()
	return availability.collection.find(
		(colleciton: { name: string }) => colleciton.name === 'Working hours'
	)
}

type CalendlyEvent = {
	uri: string
}

type BusyTime = {
	start_time: string
	end_time: string
	type: 'external' | 'calendly'
	event?: CalendlyEvent
	buffered_start_time?: string
	buffered_end_time?: string
}

type BusyTimeCollection = {
	collection: BusyTime[]
}

export async function getBusyTimes(): Promise<BusyTimeCollection> {
	const baseUrl = getEnvVar('CALENDLY_API_BASE_URL')
	const userUri = getEnvVar('CALENDLY_USER_URI')
	const now = DateTime.now().toISO()
	const end = DateTime.fromISO(now).plus({ days: 7 }).toISO()

	const busyTimes = await fetch(
		`${baseUrl}/user_busy_times?user=${userUri}&start_time=${now}&end_time=${end}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: getCalendlyBearerToken(),
			},
		}
	).then((res) => res.json())
	return busyTimes
}

/**
 ** Gets available timeslots from an availability schedule.
 */
export async function getAvailableTimeSlots() {
	//* Get availability schedule
	//* Get busy times
	//* For each day, subtract busy time from availability
	//* For each day, divide remaining availability into 45 minute blocks
	//* For each day, for each 45 minute block, take the last 30 minutes start time and end time

	const availabilitySchedule = await getWorkingHoursSchedule()
	const busyTimes = await getBusyTimes()

	const remainingAvailability = availabilitySchedule.rules.map((rule) => {
		const busyTimeForToday = busyTimes.collection.filter((busyTime) => {
			return (
				DateTime.fromISO(busyTime.start_time).weekdayLong?.toLowerCase() ===
				rule.wday
			)
		})
		return {
			...rule,
			busyTimeForToday,
		}
	})

	return remainingAvailability[1].busyTimeForToday
}
