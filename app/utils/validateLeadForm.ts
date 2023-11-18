import type { Lead } from '@prisma/client'

export function validateLeadInput(lead: Omit<Lead, 'id'>): void {
	if (!lead.firstName || !lead.email) {
		throw new Error('Invalid input: firstName and email are required.')
	}
	const isValidEmail = validateEmail(lead.email)
	if (!isValidEmail) {
		throw new Error(`Invalid input: ${lead.email} is not a valid email.`)
	}
}

export function validateEmail(email: string): boolean {
	// Regular expression for a simple email validation
	const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}
