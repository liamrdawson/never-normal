import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { getPosts } from '~/models/post.server'
import { updatePostsTable } from '~/utils/database.server'

export const loader = async () => {
	// read files to database
	await updatePostsTable()
	// retrieve post data from the database
	const posts = await getPosts()

	return json({
		posts: posts,
	})
}

export function headers() {
	return {
		'chache-control': 'max-age=3600',
	}
}

export default function Posts() {
	const { posts } = useLoaderData<typeof loader>()
	return (
		<main>
			<h1>Posts</h1>
			<ul>
				{posts &&
					posts.map((post) => (
						<li key={post.slug}>
							<Link to={post.slug}>{post.title}</Link>
						</li>
					))}
			</ul>
		</main>
	)
}
