import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { getContactByExternalId } from '~/models/contact.server'
import { getAvailability } from '~/utils/availability'
import { DateTime } from 'luxon'
import { MeetingScheduler } from '~/components/organisms/MeetingScheduler/MeetingScheduler'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const { externalId } = params

	const url = new URL(request.url)
	const start = url.searchParams.get('start')
	const end = url.searchParams.get('end')

	invariant(externalId, 'params.externalId is required.')

	const startParsed = start?.replace(/ /g, '+')
	const endParsed = end?.replace(/ /g, '+')

	const rangeStart = startParsed
		? DateTime.fromISO(startParsed)
		: DateTime.now().startOf('day')

	const rangeEnd = endParsed
		? DateTime.fromISO(endParsed)
		: DateTime.now().startOf('day').plus({ days: 6 })

	const availability = await getAvailability({ rangeStart, rangeEnd })

	const contact = await getContactByExternalId(externalId)
	invariant(contact, 'page not found.')
	return json({
		availability,
		firstName: contact.first_name,
		externalId: externalId,
	} as const)
}

export default function Onboarding() {
	const data = useLoaderData<typeof loader>()

	const { availability, firstName, externalId } = data

	return (
		<main>
			<h1>Onboarding</h1>
			<h2>
				Welcome,{' '}
				<span style={{ textTransform: 'capitalize' }}>{firstName}</span>, nice
				to meet you 😎.
			</h2>
			<MeetingScheduler availableSlots={availability} externalId={externalId} />
		</main>
	)
}
