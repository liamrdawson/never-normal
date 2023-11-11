import * as fs from 'fs/promises'
import type { Post } from '@prisma/client'
import { parseMarkdown, readMarkdownFile } from './markdown.server'
import {
	createPost,
	getOrCreateAuthor,
	getPost,
	updatePost,
} from '~/models/post.server'
import { createSlugFromTitle } from './utils'

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

	console.log('TESTING ...')
	const author = await getOrCreateAuthor(data)

	const currentPost = await getPost(data.slug)

	const { slug, title } = data
	if (!currentPost) {
		console.log('Creating post...')
		const newPost = await createPost({
			slug,
			title,
			markdown: content,
			authorId: author.id,
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
