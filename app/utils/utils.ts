import type { Lead } from '@prisma/client'

/**
 * Creates a slug from a given title.
 *
 * @param {string} title - The title from which to create the slug.
 * @throws {Error} Thrown if the title is invalid (see {@link validateMarkdownPostTitle}).
 * @returns {string} The generated slug.
 */
export function createSlugFromTitle(title: string): string {
	validateMarkdownPostTitle(title)
	const slug = title.toLowerCase().split(' ').join('-')
	return slug
}

/**
 * Validates the title for a Markdown post and throws an error if it's invalid
 *
 * @param {string} title - The title to validate.
 * @throws {Error} Thrown if the title is a string of only spaces or shorter than 5 characters.
 * @returns {void}
 */
export function validateMarkdownPostTitle(title: string): void {
	if (title.trim().length === 0) {
		throw new Error('Invalid input: Title cannot be a string of only spaces.')
	}
	if (title.length < 5) {
		throw new Error(
			`Invalid input: "${title}" is too short. Title needs to be longer than 4 characters.`
		)
	}
	if (/^[^A-Za-z0-9]+$/.test(title)) {
		throw new Error(
			`Invalid input: "${title}" contains only special characters.`
		)
	}
}

/**
 * Validates the input data for a lead, ensuring that 'firstName' and 'email' are present.
 *
 * @param {Omit<Lead, 'id'>} lead - The lead data excluding the 'id' property.
 * @throws {Error} Throws an error if 'firstName' or 'email' is missing in the input data.
 *
 * @example
 * const leadData = { firstName: 'John', email: 'john@example.com' };
 * try {
 *   validateLeadInput(leadData);
 *   console.log('Lead input is valid.');
 * } catch (error) {
 *   console.error('Error:', error.message);
 * }
 */
export function validateLeadInput(lead: Omit<Lead, 'id'>): void {
	if (!lead.firstName || !lead.email) {
		throw new Error('Invalid input: firstName and email are required.')
	}
	const isValidEmail = validateEmail(lead.email)
	if (!isValidEmail) {
		throw new Error(`Invalid input: ${lead.email} is not a valid email.`)
	}
}

/**
 * Validates an email address using a simple regular expression.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} Returns true if the email is valid, false otherwise.
 *
 * @example
 * const email = 'test@example.com';
 * if (isValidEmail(email)) {
 *   console.log('Email is valid.');
 * } else {
 *   console.log('Email is invalid.');
 * }
 */
export function validateEmail(email: string): boolean {
	// Regular expression for a simple email validation
	const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}
