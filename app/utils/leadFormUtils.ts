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
