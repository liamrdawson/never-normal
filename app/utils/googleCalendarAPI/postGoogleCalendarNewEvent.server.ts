type Attendee = {
	email: string
	displayName: string
	responseStatus: string
}

type EventResourceData = {
	attendees: Attendee[]
	startTime: Date
	endTime: Date
	summary: string
	description: string
	bearerToken: string
}

export async function postGoogleCalendarNewEvent({
	attendees,
	startTime,
	endTime,
	summary,
	description,
	bearerToken,
}: EventResourceData) {
	const formatDateTime = (date: Date) => date.toISOString()

	const eventHost = {
		displayName: 'Liam Dawson',
		email: 'liam.dawson@nevernormalcommerce.com',
		self: true,
	}

	const eventResource = {
		start: {
			dateTime: formatDateTime(startTime),
		},
		end: {
			dateTime: formatDateTime(endTime),
		},
		description,
		summary,
		creator: eventHost,
		organizer: eventHost,
		attendees: [
			{
				...eventHost,
				organizer: true,
				responseStatus: 'accepted',
			},
			...attendees,
		],
		guestsCanInviteOthers: true,
	}

	const data = await fetch(
		'https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all',
		{
			method: 'POST',
			headers: { authorization: bearerToken },
			body: JSON.stringify(eventResource),
		}
	)
		.then((res) => res.json())
		.catch((error) => console.error(error))

	return data
}
