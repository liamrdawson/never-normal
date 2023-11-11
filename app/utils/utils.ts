import type { Lead } from '@prisma/client'

/**
 * Creates a slug from a given title.
 *
 * @param {string} title - The title from which to create the slug.
 * @returns {string} The generated slug.
 */
export function createSlugFromTitle(title: string): string {
	const slug = title.toLowerCase().split(' ').join('-')
	return slug
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
}
