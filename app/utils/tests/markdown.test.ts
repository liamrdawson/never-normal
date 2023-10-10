import { readMarkdownFile, parseMarkdown } from '../markdown.server'
import fs from 'fs/promises'

jest.mock('fs/promises')

describe('readMarkdwownFile', () => {
	it('should read a markdown file and return its contents', async () => {
		const mockContent = '---\ntitle: Example\n---\nThis is some content.'
		const fileName = 'example.md'

		;(fs.readFile as jest.Mock).mockResolvedValue(mockContent)

		const content = await readMarkdownFile(fileName)

		expect(content).toEqual(mockContent)
		expect(fs.readFile).toHaveBeenCalledWith(`./app/posts/${fileName}`, 'utf-8')
	})
	it('should throw an error when reading the file fails', async () => {
		const mockError = new Error('File not found')
		const fileName = 'nonexistent.md'

		// Mock the fs.promises.readFile function to throw an error
		;(fs.readFile as jest.Mock).mockImplementation(() => {
			throw mockError
		})

		await expect(readMarkdownFile(fileName)).rejects.toEqual(mockError)
		expect(fs.readFile).toHaveBeenCalledWith(`./app/posts/${fileName}`, 'utf-8')
	})
})

describe('parseMarkdown', () => {
	it('should parse markdown and return data and content', () => {
		const markdown = '---\ntitle: Example\n---\nThis is some content.'
		const result = parseMarkdown(markdown)
		expect(result).toEqual({
			data: {
				title: 'Example',
			},
			content: 'This is some content.',
		})
	})
	it('should throw an error when parsing fails', () => {
		const invalidMarkdown = '---whatever\nabc: xyz\n---'

		expect(() => parseMarkdown(invalidMarkdown)).toThrow()
	})
})
