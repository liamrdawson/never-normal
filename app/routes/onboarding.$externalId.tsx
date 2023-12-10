import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { getContactByExternalId } from '~/models/contact.server'
import { getAvailability } from '~/utils/availability'
import { getCalendlyWorkingHoursSchedule } from '~/utils/calendlyAPI/getCalendlyUserAvailabilitySchedule.server'
import { getCalendlyUserBusyTimes } from '~/utils/calendlyAPI/getCalendlyUserBusyTimes.server'
import { DateTime } from 'luxon'
import util from 'util'

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const rangeStart = DateTime.now()
	const { collection: busyTimes } = await getCalendlyUserBusyTimes()
	const { resource: schedule } = await getCalendlyWorkingHoursSchedule()
	const availability = getAvailability({ rangeStart, busyTimes, schedule })

	util.inspect.defaultOptions.depth = null
	console.log(availability)

	invariant(params.externalId, 'params.externalId is required.')
	const contact = await getContactByExternalId(params.externalId)
	if (contact) {
		return json({ firstName: contact.first_name, email: contact.email })
	}
	return json({ firstName: null, email: null })
}

export default function Onboarding() {
	const { firstName } = useLoaderData<typeof loader>()

	return (
		<main>
			<h1>Onboarding</h1>
			<h2>
				Welcome,{' '}
				<span style={{ textTransform: 'capitalize' }}>{firstName}</span>, nice
				to meet you 😎.
			</h2>
		</main>
	)
}
