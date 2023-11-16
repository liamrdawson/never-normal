import { prismaMock } from 'prisma/singleton'
import {
	createPost,
	getAuthor,
	getOrCreateAuthor,
	getPost,
	getPosts,
	updatePost,
} from '../post.server'
import { Post } from '@prisma/client'

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

describe('getOrCreateAuthor', () => {
	it('should return the same author if an author with the given email already exists', async () => {
		const newDate = new Date()
		const existingAuthor = {
			id: 42,
			firstName: 'Douglas',
			lastName: 'Adams',
			email: 'douglas.adams@hitchhikersguide.com',
			twitter: null,
			createdAt: newDate,
			updatedAt: newDate,
		}

		prismaMock.author.findUnique.mockResolvedValueOnce(existingAuthor)
		await expect(
			getOrCreateAuthor({
				firstName: existingAuthor.firstName,
				lastName: existingAuthor.lastName,
				email: existingAuthor.email,
			})
		).resolves.toEqual(existingAuthor)
	})
	it('should return an updated author if the author exist but the name is different', async () => {
		const newDate = new Date()
		const existingAuthor = {
			id: 4,
			firstName: 'John',
			lastName: 'Tolkien',
			email: 'john.tolkien@middleearth.com',
			twitter: null,
			createdAt: newDate,
			updatedAt: newDate,
		}
		const updatedAuthorData = {
			firstName: 'JRR',
			lastName: 'Tolkien',
			email: 'john.tolkien@middleearth.com',
		}
		prismaMock.author.findUnique.mockResolvedValueOnce(existingAuthor)
		prismaMock.author.update.mockResolvedValueOnce({
			...existingAuthor,
			firstName: updatedAuthorData.firstName,
		})
		await expect(getOrCreateAuthor(updatedAuthorData)).resolves.toEqual({
			...existingAuthor,
			firstName: 'JRR',
		})
	})

	it('should create and return a new author if an author with the given email does not already exist', async () => {
		const newDate = new Date()
		const newAuthor = {
			id: 5,
			firstName: 'Bilbo',
			lastName: 'Baggins',
			email: 'bilbo.baggins@theshire.com',
			twitter: null,
			createdAt: newDate,
			updatedAt: newDate,
		}
		prismaMock.author.findUnique.mockResolvedValueOnce(null)
		prismaMock.author.create.mockResolvedValueOnce(newAuthor)
		await expect(
			getOrCreateAuthor({
				firstName: newAuthor.firstName,
				lastName: newAuthor.lastName,
				email: newAuthor.email,
			})
		).resolves.toEqual(newAuthor)
	})
	it('should throw if an error occurs', async () => {
		prismaMock.author.findUnique.mockRejectedValueOnce({
			code: 'P1017',
			message: 'Server has closed the connection.',
		})
		await expect(getAuthor('throw.error@example.com')).rejects.toThrowError()
	})
})

describe('createPost', () => {
	const newDate = new Date()
	const post: Post = {
		id: 1,
		authorId: 101,
		slug: 'this-is-a-slug',
		title: 'This is a Title',
		markdown: '# Markdown Content',
		likeCount: 0,
		createdAt: newDate,
		updatedAt: newDate,
	}
	it('should create a new post', async () => {
		prismaMock.post.create.mockResolvedValueOnce(post)
		await expect(
			createPost({
				slug: 'this-is-a-slug',
				title: 'This is a Title',
				markdown: '# Markdown Content',
				authorId: 101,
			})
		).resolves.toEqual(post)
	})
	it('should throw if an error occurs', async () => {
		prismaMock.post.create.mockRejectedValue({
			code: 'P2002',
			message: 'Unique constraint failed',
		})

		await expect(createPost(post)).rejects.toThrow(
			'Failed to perform database operation: prisma.post.create(). Unique constraint failed.'
		)
	})
})

describe('updatePost', () => {
	const newDate = new Date()
	const newPostMarkdown = {
		id: 101,
		markdown: '# New Mardown Data',
	}
	const updatedPost = {
		id: 101,
		authorId: 101,
		slug: 'this-is-a-slug',
		title: 'This is a Title',
		markdown: '# New Markdown Data',
		likeCount: 0,
		createdAt: newDate,
		updatedAt: newDate,
	}

	it('should update a post with new markdown', async () => {
		prismaMock.post.update.mockResolvedValue({
			id: 101,
			authorId: 101,
			slug: 'this-is-a-slug',
			title: 'This is a Title',
			markdown: '# New Markdown Data',
			likeCount: 0,
			createdAt: newDate,
			updatedAt: newDate,
		})
		expect(updatePost(newPostMarkdown)).resolves.toEqual(updatedPost)
	})
	it('should throw if an error occurs', async () => {
		prismaMock.post.update.mockRejectedValue({
			code: 'P1008',
			message: 'Operations timed out after {time}',
		})
		await expect(updatePost(newPostMarkdown)).rejects.toThrow(
			'Failed to perform database operation: prisma.post.update(). Operations timed out after {time}.'
		)
	})
})
