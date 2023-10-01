import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { getPosts } from '~/models/post.server'

export const loader = async () => {
	// Loader functions are the backend "API" for their component, and it's already wired up for you through useLoaderData.
	// You could have something else here that gets your posts from some other location.
	return json({
		posts: await getPosts(),
	})
}

export default function Posts() {
	const { posts } = useLoaderData<typeof loader>()
	return (
		<main>
			<h1>Posts</h1>
			<ul>
				{posts.map((post) => (
					<li key={post.slug}>
						<Link to={post.slug}>{post.title}</Link>
					</li>
				))}
			</ul>
			<div>
				<Link to='admin' className='text-red-600 underline'>
					Admin
				</Link>
			</div>
		</main>
	)
}
