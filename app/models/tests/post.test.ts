import { prismaMock } from 'prisma/singleton'
import { getPost, getPosts } from '../post.server'

describe('getPosts', () => {
	it('should return an array of posts', () => {
		const newDate = new Date()
		const posts = [
			{
				id: 1,
				slug: 'lotr-tfotr',
				title: 'The Fellowship of the Ring',
				markdown: '__MARKDOWN_CONTENT__',
				likeCount: 0,
				authorId: 2,
				createdAt: newDate,
				updatedAt: newDate,
			},
			{
				id: 2,
				slug: 'lotr-ttt',
				title: 'The Two Towers',
				markdown: '__MARKDOWN_CONTENT__',
				likeCount: 0,
				authorId: 2,
				createdAt: newDate,
				updatedAt: newDate,
			},
			{
				id: 3,
				slug: 'lotr-trotk',
				title: 'The Return of the King',
				markdown: '__MARKDOWN_CONTENT__',
				likeCount: 0,
				authorId: 2,
				createdAt: newDate,
				updatedAt: newDate,
			},
		]
		prismaMock.post.findMany.mockResolvedValue(posts)
		const result = getPosts()
		expect(result).resolves.toEqual(posts)
	})
})

describe('getPost', () => {
	it('should return a post matching the given slug', async () => {
		const newDate = new Date()
		const post = {
			id: 3,
			slug: 'lotr-trotk',
			title: 'The Return of the King',
			markdown: '__MARKDOWN_CONTENT__',
			likeCount: 0,
			authorId: 2,
			createdAt: newDate,
			updatedAt: newDate,
		}
		prismaMock.post.findUnique.mockResolvedValue(post)
		expect(getPost('lotr-trotk')).resolves.toEqual(post)
	})
	it('should return null if no post matches given slug', () => {
		prismaMock.post.findUnique.mockResolvedValue(null)
		expect(getPost('nonexistent-slug')).resolves.toEqual(null)
	})
	it.only('should handle errors and throw', async () => {
		const errorMessage = 'Failed to retrieve post for slug "bad-slug".'
		prismaMock.post.findUnique.mockRejectedValueOnce(new Error(errorMessage))
		await expect(getPost('bad-slug')).rejects.toThrowError(errorMessage)
	})
})
