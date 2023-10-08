import { createSlugFromTitle } from '../markdownToDatabase.server'

test('createSlugFromTitle', () => {
	const title = 'This is a Post Title'
	const slug = createSlugFromTitle(title)
	expect(slug).toBe('this-is-a-post-title')
})
