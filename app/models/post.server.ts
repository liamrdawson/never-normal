import type { Author, Post } from '@prisma/client'
import prisma from '~/db.server'

export async function getPosts() {
	return prisma.post.findMany()
}

export async function getPost(slug: string) {
	return prisma.post.findUnique({ where: { slug } })
}

export async function getOrCreateAuthor(authorData: {
	firstName: string
	lastName: string
	email: string
}): Promise<Author> {
	const existingAuthor = await prisma.author.findUnique({
		where: { email: authorData.email },
	})

	if (existingAuthor) {
		return existingAuthor
	}

	const newAuthor = await prisma.author.create({
		data: {
			firstName: authorData.firstName,
			lastName: authorData.lastName,
			email: authorData.email,
		},
	})

	return newAuthor
}

export async function createPost(
	post: Omit<Post, 'id' | 'likeCount' | 'createdAt' | 'updatedAt'>
) {
	const newPost = {
		...post,
		likeCount: 0,
	}
	return await prisma.post.create({ data: newPost })
}

export async function updatePost(post: Pick<Post, 'id' | 'markdown'>) {
	return prisma.post.update({
		where: {
			id: post.id,
		},
		data: {
			markdown: post.markdown,
		},
	})
}

export async function likePost(post: Pick<Post, 'id' | 'likeCount'>) {
	return prisma.post.update({
		where: {
			id: post.id,
		},
		data: {
			likeCount: post.likeCount,
		},
	})
}
