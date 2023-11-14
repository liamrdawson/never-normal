import { prismaMock } from 'prisma/singleton'
import { getAuthor, getPost, getPosts } from '../post.server'

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
		prismaMock.post.findUnique.mockResolvedValueOnce(post)
		expect(getPost('lotr-trotk')).resolves.toEqual(post)
	})
	it('should return null if no post matches given slug', async () => {
		prismaMock.post.findUnique.mockResolvedValueOnce(null)
		await expect(getPost('nonexistent-slug')).resolves.toEqual(null)
	})
	it('should handle errors and throw', async () => {
		const errorMessage = 'Failed to retrieve post for slug "bad-slug".'
		prismaMock.post.findUnique.mockRejectedValueOnce(new Error(errorMessage))
		await expect(getPost('bad-slug')).rejects.toThrowError(errorMessage)
	})
})

describe('getAuthor', () => {
	const logSpy = jest.spyOn(global.console, 'log')
	beforeEach(() => {
		jest.clearAllMocks()
	})
	it('should return an author matching the given email', async () => {
		const newDate = new Date()
		const author = {
			id: 1,
			firstName: 'John',
			lastName: 'Tolkien',
			email: 'john.tolkiien@middleearth.com',
			twitter: null,
			createdAt: newDate,
			updatedAt: newDate,
		}
		prismaMock.author.findUnique.mockResolvedValueOnce(author)
		await expect(getAuthor('john.tolkien@middleearth.com')).resolves.toEqual(
			author
		)
		expect(logSpy).toHaveBeenCalled()
		expect(logSpy).toHaveBeenCalledWith(
			'Author found with email: john.tolkien@middleearth.com'
		)
	})
	it('should return null if no author can be found with matching email', async () => {
		prismaMock.author.findUnique.mockResolvedValueOnce(null)
		await expect(getAuthor('non.existent@example.com')).resolves.toEqual(null)
		expect(logSpy).toHaveBeenCalled()
		expect(logSpy).toHaveBeenCalledWith(
			'No author found with email: non.existent@example.com'
		)
	})
	it('should throw when an error occurs', async () => {
		prismaMock.author.findUnique.mockRejectedValueOnce({
			code: 'P1017',
			message: 'Server has closed the connection.',
		})
		await expect(getAuthor('throw.error@example.com')).rejects.toThrowError()
	})
})
