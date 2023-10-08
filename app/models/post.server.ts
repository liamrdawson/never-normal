import type { Post } from '@prisma/client'
import { prisma } from '~/db.server'
import { v4 as uuidv4 } from 'uuid'

export async function getPosts() {
	return prisma.post.findMany()
}

export async function getPost(slug: string) {
	return prisma.post.findUnique({ where: { slug } })
}

export async function createPost(
	post: Omit<Post, 'id' | 'likeCount' | 'createdAt' | 'updatedAt'>
) {
	const newPost = {
		...post,
		id: uuidv4(),
		likeCount: 0,
	}
	return prisma.post.create({ data: newPost })
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
