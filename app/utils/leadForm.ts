import type { Lead } from '@prisma/client'

export function validateLeadForm(lead: Omit<Lead, 'id'>): void {
	console.log('lead.firstName', Boolean(lead.firstName))
	console.log('lead.email', Boolean(typeof lead.email))
	if (!lead.firstName || !lead.email) {
		throw new Error('Invalid input: firstName and email are required.')
	}
	if (lead.firstName.trim().length === 0) {
		throw new Error('Invalid input: firstName cannot consist of only spaces.')
	}
	if (!isValidEmail(lead.email)) {
		throw new Error(`Invalid input: ${lead.email} is not a valid email.`)
	}
}

export function isValidEmail(email: string): boolean {
	const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}
