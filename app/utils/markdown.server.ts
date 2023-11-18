import matter from 'gray-matter'
import * as fs from 'fs/promises'

export async function readMarkdownFile(filename: string): Promise<string> {
	try {
		const content = await fs.readFile(`./app/posts/${filename}`, 'utf-8')
		return content
	} catch (error) {
		console.error(`Error reading file '${filename}': ${error}`)
		throw error
	}
}

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
