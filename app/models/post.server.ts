import type { Author, Post } from '@prisma/client'
import prisma from '~/db.server'
import { handlePrismaError } from '~/utils/handlePrismaError'

export async function getPosts(): Promise<Post[] | null> {
	return prisma.post.findMany()
}

export async function getPost(slug: string): Promise<Post | null> {
	try {
		const foundPost = await prisma.post.findUnique({ where: { slug } })
		console.log(`Retrieved post for slug: ${slug}`)
		return foundPost
	} catch (error) {
		handlePrismaError({ operation: 'post.findUnique', error })
	}
}

export async function getAuthor(email: string) {
	try {
		const author = await prisma.author.findUnique({
			where: { email },
		})
		if (!author) {
			console.log(`No author found with email: ${email}`)
			return author
		}
		console.log(`Author found with email: ${email}`)
		return author
	} catch (error) {
		handlePrismaError({ operation: 'author.findUnique', error })
	}
}

export async function getOrCreateAuthor(authorData: {
	firstName: string
	lastName: string
	email: string
}): Promise<Author> {
	try {
		let existingAuthor = await prisma.author.findUnique({
			where: { email: authorData.email },
		})

		if (existingAuthor) {
			// Check if details are the same before updating to avoid unnecessary db writes.
			const detailsChanged =
				existingAuthor.firstName !== authorData.firstName ||
				existingAuthor.lastName !== authorData.lastName

			if (detailsChanged) {
				// Update the existing author's information if their name happens to be different.
				existingAuthor = await prisma.author.update({
					where: { email: authorData.email },
					data: {
						firstName: authorData.firstName,
						lastName: authorData.lastName,
					},
				})
			}
			return existingAuthor
		}
		// Create a new author if they don't exist on the database.
		const newAuthor = prisma.author.create({
			data: {
				...authorData,
			},
		})
		return newAuthor
	} catch (error) {
		handlePrismaError({ operation: 'author.create', error })
	}
}

export async function createPost(
	post: Omit<Post, 'id' | 'likeCount' | 'createdAt' | 'updatedAt'>
): Promise<Post> {
	try {
		const newPost = {
			...post,
			likeCount: 0,
		}
		return await prisma.post.create({ data: newPost })
	} catch (error) {
		handlePrismaError({ operation: 'post.create', error })
	}
}

export async function updatePost(post: Pick<Post, 'id' | 'markdown'>) {
	try {
		return prisma.post.update({
			where: {
				id: post.id,
			},
			data: {
				markdown: post.markdown,
			},
		})
	} catch (error) {
		handlePrismaError({ operation: 'post.update', error })
	}
}

export async function likePost(post: Pick<Post, 'id' | 'likeCount'>) {
	try {
		return prisma.post.update({
			where: {
				id: post.id,
			},
			data: {
				likeCount: post.likeCount,
			},
		})
	} catch (error) {
		handlePrismaError({ operation: 'post.update', error })
	}
}
