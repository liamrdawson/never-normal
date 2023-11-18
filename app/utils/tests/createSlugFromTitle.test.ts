import { createSlugFromTitle } from '../createSlugFromTitle'

describe('createSlugFromTitle', () => {
	it('Should convert a post title string to slug friendly kebab case', () => {
		const title = 'This is a Post Title'
		const slug = createSlugFromTitle(title)
		expect(slug).toBe('this-is-a-post-title')
	})

	it('should handle a title with special characters', () => {
		const title = 'Special $@!Characters'
		const slug = 'special-$@!characters'

		const result = createSlugFromTitle(title)

		expect(result).toEqual(slug)
	})

	it('should throw an error for an empty title', () => {
		const emptyTitle = ''
		const expectedErrorMessage =
			/^Invalid input: Title cannot be a string of only spaces.$/

		expect(() => createSlugFromTitle(emptyTitle)).toThrow(expectedErrorMessage)
	})

	it('should throw an error for a title with only spaces', () => {
		const titleWithSpaces = '      '
		const expectedErrorMessage =
			/^Invalid input: Title cannot be a string of only spaces.$/

		expect(() => createSlugFromTitle(titleWithSpaces)).toThrow(
			expectedErrorMessage
		)
	})

	it('should throw an error if the title is too short', () => {
		const shortTitle = 'No'
		const expectedErrorMessage =
			/^Invalid input: "No" is too short. Title needs to be longer than 4 characters.$/
		expect(() => createSlugFromTitle(shortTitle)).toThrow(expectedErrorMessage)
	})

	it('should throw an error if the title contains only special characters', () => {
		const specialCharacters = '!@£$%'
		const expectedErrorMessage =
			/^Invalid input: "!@£\$%" contains only special characters.$/
		expect(() => createSlugFromTitle(specialCharacters)).toThrow(
			expectedErrorMessage
		)
	})
})
