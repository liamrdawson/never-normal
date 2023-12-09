import { getEnvVar } from '../getEnvVar'

type CalendlyUserResource = {
	avatar_url: string | null
	created_at: Date
	current_organization: string
	email: string
	name: string
	resource_type: string
	scheduling_url: string
	slug: string
	timezone: string
	updated_at: Date
	uri: string
}

type CalendlyUser = {
	resource: CalendlyUserResource
}

export async function getCalendlyUser(): Promise<CalendlyUser> {
	const user: CalendlyUser = await fetch(
		`${getEnvVar('CALENDLY_API_BASE_URL')}/users/me`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${getEnvVar('CALENDLY_PERSONAL_ACCESS_TOKEN')}`,
			},
		}
	).then((res) => res.json())

	return user
}
