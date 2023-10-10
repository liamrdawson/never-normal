import { createSlugFromTitle } from '../utils'
describe('createSlugFromTitle', () => {
	it('Should convert a post title string to slug friendly kebab case', () => {
		const title = 'This is a Post Title'
		const slug = createSlugFromTitle(title)
		expect(slug).toBe('this-is-a-post-title')
	})
})
