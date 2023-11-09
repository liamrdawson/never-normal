import type { Author, Post, Lead } from '@prisma/client'
import { prisma } from '~/db.server'

export async function getPosts() {
	return prisma.post.findMany()
}

export async function getPost(slug: string) {
	return prisma.post.findUnique({ where: { slug } })
}

export async function getLead(lead: Omit<Lead, 'id'>): Promise<Lead | null> {
	const { firstName, email } = lead
	console.log('finding leads...')
	const newLead = await prisma.lead.findFirst({
		where: {
			AND: [{ firstName: { equals: firstName } }, { email: { equals: email } }],
		},
	})
	console.log('lead found:', newLead)
	return newLead
}

export async function createLead(lead: Omit<Lead, 'id'>): Promise<Lead> {
	const { firstName, email } = lead
	console.log('creating new lead...')
	return await prisma.lead.create({
		data: {
			firstName,
			email,
		},
	})
}

export async function getOrCreateLead(lead: Omit<Lead, 'id'>): Promise<Lead> {
	console.log(lead)

	const { firstName, email } = lead
	const existingLead = await getLead({ firstName, email })
	if (existingLead) {
		return existingLead
	}
	const newLead = await createLead({ firstName, email })
	return newLead
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
