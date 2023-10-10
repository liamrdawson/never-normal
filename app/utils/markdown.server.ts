import matter from 'gray-matter'
import * as fs from 'fs/promises'

/**
 * Reads the content of a markdown file.
 *
 * @param {string} filename - The name of the markdown file to read.
 * @returns {Promise<string>} The content of the markdown file.
 */
export async function readMarkdownFile(filename: string): Promise<string> {
	try {
		const content = await fs.readFile(`./app/posts/${filename}`, 'utf-8')
		return content
	} catch (error) {
		console.error(`Error reading file '${filename}': ${error}`)
		throw error
	}
}

/**
 * Parses the frontmatter and content from a markdown string.
 *
 * @param {string} markdown - The markdown content to parse.
 * @returns {{ data: any, content: string }} An object containing the frontmatter data and content.
 */
export function parseMarkdown(markdown: string): {
	data: any
	content: string
} {
	try {
		const { data, content } = matter(markdown)
		return { data, content }
	} catch (error) {
		console.error('Error parsing frontmatter:', error)
		throw error
	}
}
