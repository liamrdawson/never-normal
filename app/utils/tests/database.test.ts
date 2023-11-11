import {
	getOrCreateAuthor,
	createPost,
	getPost,
	updatePost,
} from '~/models/post.server'
import { processPostFile } from '../database.server'
import { parseMarkdown, readMarkdownFile } from '../markdown.server'

jest.mock('../markdown.server')
jest.mock('~/models/post.server')

describe('processPostFile', () => {
	let mockedReadMarkdownFile: jest.MockedFunction<typeof readMarkdownFile>
	let mockedParseMarkdown: jest.MockedFunction<typeof parseMarkdown>
	let mockedGetPost: jest.MockedFunction<typeof getPost>
	let mockedGetOrCreateAuthor: jest.MockedFunction<typeof getOrCreateAuthor>

	beforeEach(() => {
		mockedReadMarkdownFile = readMarkdownFile as jest.MockedFunction<
			typeof readMarkdownFile
		>
		mockedParseMarkdown = parseMarkdown as jest.MockedFunction<
			typeof parseMarkdown
		>
		mockedGetPost = getPost as jest.MockedFunction<typeof getPost>
		mockedGetOrCreateAuthor = getOrCreateAuthor as jest.MockedFunction<
			typeof getOrCreateAuthor
		>

		jest.clearAllMocks()
	})

	it('should add a slug if there is not one present in the frontmatter', async () => {
		mockedReadMarkdownFile.mockResolvedValue(
			'---\ntitle: Example\n---\nThis is some content.'
		)
		mockedParseMarkdown.mockReturnValue({
			data: {
				title: 'No Slug',
			},
			content: 'This is some content.',
		})
		mockedGetPost.mockResolvedValue({
			id: 1,
			authorId: 1,
			slug: 'no-slug',
			title: 'No Slug',
			markdown: 'This is some content.',
			likeCount: 1,
			createdAt: new Date(),
			updatedAt: new Date(),
		})

		const post = await processPostFile('EXAMPLE FILE.MD')
		expect(post.slug).toEqual('no-slug')
	})

	it('should create a new post if it the current post is not found on the database', async () => {
		mockedReadMarkdownFile.mockResolvedValue(
			'---\ntitle: Example\n---\nThis is some content.'
		)
		mockedParseMarkdown.mockReturnValue({
			data: {
				title: 'Example Title',
			},
			content: 'This is some content.',
		})
		mockedGetOrCreateAuthor.mockResolvedValue({
			id: 1,
			firstName: 'Michael',
			lastName: 'Scott',
			email: 'Michael.Scott@dundermifflin.com',
			twitter: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		mockedGetPost.mockResolvedValue(null)

		await processPostFile('TEST FILE NAME.MD')
		expect(createPost).toHaveBeenCalledWith({
			slug: 'example-title',
			title: 'Example Title',
			markdown: 'This is some content.',
			authorId: 1,
		})
	})

	it('should update the post if it already exists on the database but the content has changed', async () => {
		mockedReadMarkdownFile.mockResolvedValue(
			'---\ntitle: Example\n---\nThis is some NEW content.'
		)
		mockedParseMarkdown.mockReturnValue({
			data: {
				title: 'No Slug',
			},
			content: 'This is some NEW content.',
		})
		mockedGetPost.mockResolvedValue({
			id: 1,
			authorId: 1,
			slug: 'no-slug',
			title: 'No Slug',
			markdown: 'This is OLD content.',
			likeCount: 1,
			createdAt: new Date(),
			updatedAt: new Date(),
		})

		await processPostFile('EXAMPLE FILE.MD')
		expect(updatePost).toHaveBeenCalledWith({
			id: 1,
			markdown: 'This is some NEW content.',
		})
	})
})
