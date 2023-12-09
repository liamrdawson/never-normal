import { getEnvVar } from '../getEnvVar'

export type ScheduleInterval = {
	from: string
	to: string
}

export type CalendlyAvailabilityScheduleRule = {
	type: 'wday' | 'date'
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

export type CalendlyUserAvailabilityScheduleResource = {
	default: boolean
	name: string
	rules: CalendlyAvailabilityScheduleRule[]
	timezone: string
	uri: string
	user: string
}

export type CalendlyUserAvailabilitySchedule = {
	resource: CalendlyUserAvailabilityScheduleResource
}

export async function getCalendlyWorkingHoursSchedule(): Promise<CalendlyUserAvailabilitySchedule> {
	const availabilitySchedule: CalendlyUserAvailabilitySchedule = await fetch(
		`${getEnvVar(
			'CALENDLY_API_BASE_URL'
		)}/user_availability_schedules/57659a92-60b9-4d05-a9bc-9d5f30bd6a17`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${getEnvVar('CALENDLY_PERSONAL_ACCESS_TOKEN')}`,
			},
		}
	).then((res) => res.json())

	return availabilitySchedule
}
