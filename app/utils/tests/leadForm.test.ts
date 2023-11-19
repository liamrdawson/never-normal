import { isValidEmail, validateContactForm } from '../contactForm'

describe('validateContactForm', () => {
	it('should throw an error if firstName is an empty string', () => {
		const contact = { firstName: ' ', email: 'test@example.com' }
		expect(() => validateContactForm(contact)).toThrowError(
			'Invalid input: firstName cannot consist of only spaces.'
		)
	})

	it('should throw an error if email is invalid', () => {
		const contact = { firstName: 'John', email: 'invalid-email' }
		expect(() => validateContactForm(contact)).toThrowError(
			`Invalid input: ${contact.email} is not a valid email.`
		)
	})

	it('should not throw an error if input is valid', () => {
		const contact = { firstName: 'John', email: 'test@example.com' }
		expect(() => validateContactForm(contact)).not.toThrow()
	})
})

describe('isValidEmail', () => {
	it('should return true for a valid email', () => {
		const email = 'test@example.com'
		expect(isValidEmail(email)).toBe(true)
	})

	it('should return false for an invalid email', () => {
		const email = 'invalid-email'
		expect(isValidEmail(email)).toBe(false)
	})
})
