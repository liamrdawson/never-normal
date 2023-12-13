import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { getContactByExternalId } from '~/models/contact.server'
import { getAvailability } from '~/utils/availability'
import { DateTime } from 'luxon'
import { MeetingScheduler } from '~/components/organisms/MeetingScheduler/MeetingScheduler'

export const loader = async ({ params }: LoaderFunctionArgs) => {
	invariant(params.externalId, 'params.externalId is required.')
	const rangeStart = DateTime.now()
	const rangeEnd = rangeStart.plus({ days: 6 })
	const availability = await getAvailability({ rangeStart, rangeEnd })

	const contact = await getContactByExternalId(params.externalId)
	invariant(contact, 'page not found.')

	return json({ availability, firstName: contact.first_name } as const)
}

export default function Onboarding() {
	const data = useLoaderData<typeof loader>()

	const { availability, firstName } = data

	return (
		<main>
			<h1>Onboarding</h1>
			<h2>
				Welcome,{' '}
				<span style={{ textTransform: 'capitalize' }}>{firstName}</span>, nice
				to meet you 😎.
			</h2>
			<MeetingScheduler availableSlots={availability} />
		</main>
	)
}
