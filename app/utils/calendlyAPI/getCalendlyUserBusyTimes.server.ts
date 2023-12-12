import type { DateTime } from 'luxon'
import { getEnvVar } from '../getEnvVar'

export type CalendlyUserBusyTime = {
	type: 'calendly' | 'external'
	start_time: string
	end_time: string
	buffered_start_time?: string
	buffered_end_time?: string
	event?: { uri: string }
}

export type CalendlyUserBusyTimes = {
	collection: CalendlyUserBusyTime[]
}

export async function getCalendlyUserBusyTimes({
	rangeStart,
	rangeEnd,
}: {
	rangeStart: DateTime
	rangeEnd: DateTime
}): Promise<CalendlyUserBusyTimes> {
	const baseUrl = getEnvVar('CALENDLY_API_BASE_URL')
	const userUri = getEnvVar('CALENDLY_USER_URI')
	const start = rangeStart.toISO()
	const end = rangeEnd.toISO()

	const busyTimes: CalendlyUserBusyTimes = await fetch(
		`${baseUrl}/user_busy_times?user=${userUri}&start_time=${start}&end_time=${end}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${getEnvVar('CALENDLY_PERSONAL_ACCESS_TOKEN')}`,
			},
		}
	).then((res) => res.json())

	console.log(
		`${baseUrl}/user_busy_times?user=${userUri}&start_time=${start}&end_time=${end}`
	)

	return busyTimes
}
