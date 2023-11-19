export function validateContactForm({
	firstName,
	email,
}: {
	firstName: string
	email: string
}): void {
	console.log('contact.firstName', Boolean(firstName))
	console.log('contact.email', Boolean(typeof email))
	if (!firstName || !email) {
		throw new Error('Invalid input: firstName and email are required.')
	}
	if (firstName.trim().length === 0) {
		throw new Error('Invalid input: firstName cannot consist of only spaces.')
	}
	if (!isValidEmail(email)) {
		throw new Error(`Invalid input: ${email} is not a valid email.`)
	}
}

export function isValidEmail(email: string): boolean {
	const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}
