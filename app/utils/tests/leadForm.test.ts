import { isValidEmail, validateLeadForm } from '../leadForm'

describe('validateLeadForm', () => {
	it('should throw an error if firstName is an empty string', () => {
		const lead = { firstName: ' ', email: 'test@example.com' }
		expect(() => validateLeadForm(lead)).toThrowError(
			'Invalid input: firstName cannot consist of only spaces.'
		)
	})

	it('should throw an error if email is invalid', () => {
		const lead = { firstName: 'John', email: 'invalid-email' }
		expect(() => validateLeadForm(lead)).toThrowError(
			`Invalid input: ${lead.email} is not a valid email.`
		)
	})

	it('should not throw an error if input is valid', () => {
		const lead = { firstName: 'John', email: 'test@example.com' }
		expect(() => validateLeadForm(lead)).not.toThrow()
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
