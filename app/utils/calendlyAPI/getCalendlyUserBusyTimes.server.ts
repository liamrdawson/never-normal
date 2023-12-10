import { DateTime } from 'luxon'
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

export async function getCalendlyUserBusyTimes(): Promise<CalendlyUserBusyTimes> {
	const baseUrl = getEnvVar('CALENDLY_API_BASE_URL')
	const userUri = getEnvVar('CALENDLY_USER_URI')
	const now = DateTime.now().toISO()
	const end = DateTime.fromISO(now).plus({ days: 7 }).toISO()

	const busyTimes: CalendlyUserBusyTimes = await fetch(
		`${baseUrl}/user_busy_times?user=${userUri}&start_time=${now}&end_time=${end}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${getEnvVar('CALENDLY_PERSONAL_ACCESS_TOKEN')}`,
			},
		}
	).then((res) => res.json())

	console.log(
		`${baseUrl}/user_busy_times?user=${userUri}&start_time=${now}&end_time=${end}`
	)

	return busyTimes
}
