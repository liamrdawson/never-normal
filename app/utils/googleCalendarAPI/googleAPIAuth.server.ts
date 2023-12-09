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
