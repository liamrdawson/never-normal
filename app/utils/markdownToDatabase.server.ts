/**
 * ✨ This module is responsible for parsing markdown files and updating a database with their content.
 * 		It scans the "posts" directory, reads markdown files, and inserts or updates corresponding records in the database.
 */

import * as fs from 'fs/promises'
import type { Post } from '@prisma/client'
import matter from 'gray-matter'
import { createPost, getPost, updatePost } from '../models/post.server'

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

/**
 * Creates a slug from a given title.
 *
 * @param {string} title - The title from which to create the slug.
 * @returns {string} The generated slug.
 */
export function createSlugFromTitle(title: string): string {
	const slug = title.toLowerCase().split(' ').join('-')
	return slug
}

/**
 * Processes a markdown file, updating the database if necessary.
 *
 * @param {string} filename - The name of the markdown file to process.
 * @returns {Promise<Post>} The post object in the database.
 */
export async function processPostFile(filename: string): Promise<Post> {
	const markdownContent = await readMarkdownFile(filename)
	const { data, content } = parseMarkdown(markdownContent)

	if (!data.slug) {
		data.slug = createSlugFromTitle(data.title)
	}

	const currentPost = await getPost(data.slug)
	const { slug, title } = data

	if (!currentPost) {
		const newPost = await createPost({
			slug,
			title,
			markdown: content,
		})
		return newPost
	}

	if (currentPost.markdown !== content) {
		const updatedPost = await updatePost({
			id: currentPost.id,
			markdown: content,
		})
		return updatedPost
	}

	return currentPost
}

/**
 * Updates the posts table by processing markdown files.
 *
 * @returns {Promise<Post[]>} An array of post objects in the database.
 */
export async function updatePostsTable(): Promise<Post[]> {
	const filenames = await fs.readdir('./app/posts')
	const posts = await Promise.all(filenames.map(processPostFile))
	return posts
}
