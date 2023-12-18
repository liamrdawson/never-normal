import type {
	ActionFunctionArgs,
	LinksFunction,
	LoaderFunctionArgs,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { getContactByExternalId } from '~/models/contact.server'
import { getAvailability } from '~/utils/availability'
import { DateTime } from 'luxon'
import {
	MeetingScheduler,
	links as MeetingSchedulerLinks,
} from '~/components/organisms/MeetingScheduler/MeetingScheduler'
import { getToken } from '~/utils/googleCalendarAPI/googleAPIAuth.server'
import { postGoogleCalendarNewEvent } from '~/utils/googleCalendarAPI/postGoogleCalendarNewEvent.server'

export const links: LinksFunction = () => [...MeetingSchedulerLinks()]

export async function loader({ request, params }: LoaderFunctionArgs) {
	const { externalId } = params

	const url = new URL(request.url)
	const start = url.searchParams.get('start')
	const end = url.searchParams.get('end')

	invariant(externalId, 'params.externalId is required.')

	// ISO date strings are passed in as url params but some characters (e.g.+)
	// are lost when the data is serialized.
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
		email: contact.email,
	} as const)
}

export async function action({ request }: ActionFunctionArgs) {
	const body = await request.formData()
	const bearerToken = await getToken()
	const attendees = body.getAll('attendees').toString()
	const startTime = body.get('startTime')?.toString()
	const endTime = body.get('endTime')?.toString()
	if (attendees && startTime && endTime) {
		const meeting = postGoogleCalendarNewEvent({
			attendees: [JSON.parse(attendees)],
			startTime,
			endTime,
			summary: 'test summary',
			description: 'test description',
			bearerToken,
		})
		return meeting
	}
	return body
}

export default function Onboarding() {
	const data = useLoaderData<typeof loader>()

	const { availability, firstName, externalId, email } = data

	return (
		<main>
			<h1>Onboarding</h1>
			<h2>
				Welcome,{' '}
				<span style={{ textTransform: 'capitalize' }}>{firstName}</span>, nice
				to meet you 😎.
			</h2>
			<MeetingScheduler
				availableSlots={availability}
				externalId={externalId}
				email={email}
				name={firstName}
			/>
		</main>
	)
}
