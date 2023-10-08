import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { marked } from 'marked'
import invariant from 'tiny-invariant'
import { getPost } from '~/models/post.server'

export const loader = async ({ params }: LoaderFunctionArgs) => {
	invariant(params.slug, 'params.slug is required')
	const post = await getPost(params.slug)
	invariant(post, `Post not found: ${params.slug}`)
	const html = marked(post.markdown)
	return json({ post, html })
}

export default function PostSlug() {
	const { post, html } = useLoaderData<typeof loader>()

	return (
		<main>
			<h1>Some Post: {post.title}</h1>
			<div dangerouslySetInnerHTML={{ __html: html }} />
		</main>
	)
}
