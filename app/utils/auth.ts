import jwt from 'jsonwebtoken'

export function getSignedJSONWebToken() {
	const secret = process.env.GOOGLE_API_SECRET
	const keyId = process.env.GOOGLE_API_PRIVATE_KEY_ID

	const claimSet = {
		iss: 'calendar@never-normal.iam.gserviceaccount.com',
		sub: 'liam.dawson@nevernormalcommerce.com',
		scope: 'https://www.googleapis.com/auth/calendar',
		aud: 'https://oauth2.googleapis.com/token',
		exp: Math.floor(Date.now() / 1000) + 3600,
		iat: Math.floor(Date.now() / 1000),
	}

	const token = jwt.sign(claimSet, secret as string, {
		header: {
			alg: 'RS256',
			kid: keyId,
			typ: 'JWT',
		},
	})

	return token
}

export async function getToken() {
	const signedJWT = getSignedJSONWebToken()

	const data = {
		grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
		assertion: signedJWT,
	}
	const response = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		body: new URLSearchParams(data),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	})
		.then((res) => res.json())
		.catch((err) => console.error(err))

	return `${response.token_type} ${response.access_token}`
}

type Attendee = {
	email: string
	displayName: string
	responseStatus: string
}

type EventResourceData = {
	attendees: Attendee[]
	startTime: Date
	endTime: Date
}

export async function createNewCalendarEvent({
	attendees,
	startTime,
	endTime,
}: EventResourceData) {
	const formatDateTime = (date: Date) => date.toISOString()

	const eventResource = {
		start: {
			dateTime: formatDateTime(startTime),
		},
		end: {
			dateTime: formatDateTime(endTime),
		},
		description: 'This is a description',
		creator: {
			displayName: 'Liam Dawson',
			email: 'liam.dawson@nevernormalcommerce.com',
			self: true,
		},
		organizer: {
			displayName: 'Liam Dawson',
			email: 'liam.dawson@nevernormalcommerce.com',
			self: true,
		},
		attendees: [
			{
				email: 'liam.dawson@nevernormalcommerce.com',
				displayName: 'Liam Dawson',
				organizer: true,
				self: true,
				responseStatus: 'accepted',
			},
			...attendees,
		],
		guestsCanInviteOthers: true,
		summary: 'This is a summary.',
	}

	const bearerToken = await getToken()
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
