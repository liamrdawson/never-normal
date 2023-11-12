import { prismaMock } from 'prisma/singleton'
import { getPosts } from '../post.server'

describe('getPosts', () => {
	it('should return an array of posts', () => {
		const newDate = new Date()
		const posts = [
			{
				id: 1,
				slug: 'lotr',
				title: 'The Fellowship of the Ring',
				markdown: '__MARKDOWN_CONTENT__',
				likeCount: 0,
				authorId: 2,
				createdAt: newDate,
				updatedAt: newDate,
			},
			{
				id: 2,
				slug: 'lotr',
				title: 'The Two Towers',
				markdown: '__MARKDOWN_CONTENT__',
				likeCount: 0,
				authorId: 2,
				createdAt: newDate,
				updatedAt: newDate,
			},
			{
				id: 3,
				slug: 'lotr',
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
